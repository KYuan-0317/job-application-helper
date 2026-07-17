import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import mammoth from "mammoth";
import pdf from "pdf-parse";
import { Document, Packer, Paragraph, TextRun } from "docx";
import PDFDocument from "pdfkit";
import fs from "node:fs";

const app = express();
const port = Number(process.env.PORT || 8787);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
});

app.use(cors({
  origin: /^chrome-extension:\/\//,
  allowedHeaders: ["Content-Type", "X-OpenAI-API-Key"]
}));
app.use(express.json({ limit: "2mb" }));

const MAX_TEXT = 30000;
const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

const cleanText = (value, limit = MAX_TEXT) => String(value || "").slice(0, limit);
const getApiKey = (req) => req.get("X-OpenAI-API-Key")?.trim();
const getOutputText = (data) => data.output_text || data.output
  ?.flatMap(({ content = [] }) => content)
  ?.filter(({ type }) => type === "output_text")
  ?.map(({ text }) => text)
  ?.join("\n")
  ?.trim();

async function requestOpenAI(apiKey, instructions, input) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, instructions, input })
  });
  const data = await response.json();
  if (!response.ok) {
    console.error(data);
    const error = new Error(data?.error?.message || "OpenAI request failed");
    error.status = response.status;
    throw error;
  }
  const text = getOutputText(data);
  if (!text) {
    const error = new Error("Model returned no text");
    error.status = 502;
    throw error;
  }
  return text;
}

function requireCoverLetter(req, res) {
  const text = String(req.body?.coverLetter || "").trim();
  if (!text) { res.status(400).json({ error: "coverLetter is required" }); return null; }
  if (text.length > 50000) { res.status(413).json({ error: "Cover letter is too long" }); return null; }
  return text;
}

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/parse-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No resume file uploaded" });

    const name = req.file.originalname.toLowerCase();
    let text = "";
    if (name.endsWith(".pdf")) {
      text = (await pdf(req.file.buffer)).text;
    } else if (name.endsWith(".docx")) {
      text = (await mammoth.extractRawText({ buffer: req.file.buffer })).value;
    } else if (name.endsWith(".txt") || name.endsWith(".md")) {
      text = req.file.buffer.toString("utf8");
    } else {
      return res.status(415).json({ error: "Only PDF, DOCX, TXT, and MD are supported" });
    }

    text = text.replace(/\u0000/g, "").replace(/[ \t]+\n/g, "\n").trim();
    if (text.length < 100) return res.status(422).json({ error: "Could not extract enough resume text" });
    res.json({ text: text.slice(0, 30000), characters: Math.min(text.length, 30000) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Resume parsing failed" });
  }
});


app.post("/api/export-docx", async (req, res) => {
  try {
    const coverLetter = requireCoverLetter(req, res);
    if (!coverLetter) return;

    const blocks = coverLetter.split(/\n{2,}/).filter(Boolean);
    const children = blocks.map((block) => new Paragraph({
      children: [new TextRun({ text: block.replace(/\n/g, " "), size: 23 })],
      spacing: { after: 220 },
      line: 360
    }));
    const doc = new Document({
      sections: [{
        properties: {
          page: { margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } }
        },
        children
      }]
    });
    const buffer = await Packer.toBuffer(doc);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", 'attachment; filename="cover-letter.docx"');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DOCX export failed" });
  }
});


function selectPdfFont(doc, text) {
  const needsUnicodeFont = /[^\u0000-\u00ff]/.test(text);
  if (!needsUnicodeFont) {
    doc.font("Helvetica");
    return;
  }

  const candidates = [
    ["/System/Library/Fonts/PingFang.ttc", "PingFangSC-Regular"],
    ["/System/Library/Fonts/Hiragino Sans GB.ttc", "HiraginoSansGB-W3"],
    ["/System/Library/Fonts/AppleSDGothicNeo.ttc", "AppleSDGothicNeo-Regular"],
    ["/Library/Fonts/Arial Unicode.ttf", null],
    ["/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", "NotoSansCJKsc-Regular"],
    ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", null]
  ];

  for (const [fontPath, family] of candidates) {
    if (!fs.existsSync(fontPath)) continue;
    try {
      if (family) doc.font(fontPath, family);
      else doc.font(fontPath);
      return;
    } catch (error) {
      console.warn(`Could not load PDF font ${fontPath}:`, error.message);
    }
  }

  throw new Error("No Unicode PDF font was found on this computer");
}

app.post("/api/export-pdf", async (req, res) => {
  try {
    const coverLetter = requireCoverLetter(req, res);
    if (!coverLetter) return;

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 68, right: 64, bottom: 68, left: 64 },
      info: { Title: "Cover Letter", Author: "Cover Letter Generator" }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="cover-letter.pdf"');
    doc.on("error", (error) => {
      console.error(error);
      if (!res.headersSent) res.status(500).json({ error: "PDF export failed" });
      else res.destroy(error);
    });
    doc.pipe(res);

    selectPdfFont(doc, coverLetter);
    doc.fontSize(11.5).fillColor("#111111");
    const blocks = coverLetter.split(/\n{2,}/).filter(Boolean);
    blocks.forEach((block, index) => {
      doc.text(block, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        lineGap: 4,
        paragraphGap: index === blocks.length - 1 ? 0 : 10
      });
    });
    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      const message = error.message?.includes("Unicode PDF font")
        ? "PDF export needs a Unicode font installed on this computer"
        : "PDF export failed";
      res.status(500).json({ error: message });
    }
  }
});

app.post("/api/generate-application-answer", async (req, res) => {
  try {
    const { resumeText, jobDescription = "", pageTitle = "", pageUrl = "", question, answerRequirements = "", language = "English", tone = "professional" } = req.body || {};
    const apiKey = getApiKey(req);
    if (!apiKey) return res.status(401).json({ error: "OpenAI API Key is required" });
    if (!resumeText || !question) return res.status(400).json({ error: "resumeText and question are required" });

    const instructions = `You are an expert job-application writing assistant. Answer the applicant's question using only facts supported by the resume and, when relevant, the job description. Never invent employers, dates, degrees, certifications, metrics, technologies, achievements, work authorization, salary expectations, availability, relocation willingness, demographic information, or personal circumstances. If the question asks for information not supported by the provided materials, state that the applicant should personalize that detail rather than fabricating it. Use a ${tone} tone and write the entire answer in ${language}. Follow any user requirements. Return only the final answer, with no analysis, markdown fences, labels, or process notes. Keep the answer focused and appropriate for pasting into a job application form.`;
    const input = `CURRENT PAGE TITLE:
${cleanText(pageTitle, 1000)}

CURRENT PAGE URL:
${cleanText(pageUrl, 2000)}

JOB APPLICATION QUESTION:
${cleanText(question, 5000)}

USER ANSWER REQUIREMENTS:
${cleanText(answerRequirements || "Provide a concise, specific answer.", 5000)}

RESUME:
${cleanText(resumeText)}

JOB DESCRIPTION:
${cleanText(jobDescription)}`;
    res.json({ answer: await requestOpenAI(apiKey, instructions, input) });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "Answer generation failed" });
  }
});

app.post("/api/generate-cover-letter", async (req, res) => {
  try {
    const { resumeText, jobDescription, pageTitle = "", pageUrl = "", tone = "professional", length = "medium", language = "English", coverLetterRequirements = "" } = req.body || {};
    const apiKey = getApiKey(req);
    if (!apiKey) return res.status(401).json({ error: "OpenAI API Key is required" });
    if (!resumeText || !jobDescription) return res.status(400).json({ error: "resumeText and jobDescription are required" });

    const lengthGuide = { short: "220-280 words", medium: "320-420 words", long: "450-550 words" }[length] || "320-420 words";
    const instructions = `You are an expert career-writing assistant. Write a tailored cover letter using only facts supported by the resume. Never invent employers, dates, degrees, metrics, technologies, or achievements. Match the strongest resume evidence to the job requirements. Use a ${tone} tone and write the entire letter in ${language}. Target ${lengthGuide}. Follow the user's cover-letter preferences when they do not conflict with factual accuracy or these instructions. Return only the final letter, with no analysis, process notes, markdown fences, or unresolved placeholders such as [Company Name]. If the company or hiring manager is unknown, use a natural generic salutation. Avoid clichés and do not merely restate the resume.`;
    const input = `CURRENT PAGE TITLE:
${cleanText(pageTitle, 1000)}

CURRENT PAGE URL:
${cleanText(pageUrl, 2000)}

USER COVER LETTER REQUIREMENTS:
${cleanText(coverLetterRequirements || "Use a standard tailored cover-letter structure.", 5000)}

RESUME:
${cleanText(resumeText)}

JOB DESCRIPTION:
${cleanText(jobDescription)}`;
    res.json({ coverLetter: await requestOpenAI(apiKey, instructions, input) });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "Generation failed" });
  }
});

app.listen(port, () => {
  console.log(`Cover Letter server running at http://localhost:${port}`);
});
