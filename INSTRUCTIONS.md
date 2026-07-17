# Job Application Helper — Installation and Usage Instructions

This guide explains how to install, run, and use the Job Application Helper Chrome extension.

---

## 1. Requirements

Install the following before starting:

- Google Chrome
- Node.js
- npm
- An OpenAI API key

Check that Node.js and npm are installed:

```bash
node -v
npm -v
```

Both commands should return version numbers.

---

## 2. Download the Project

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/job-application-helper.git
cd job-application-helper
```

Replace `YOUR_USERNAME` with the correct GitHub username.

You may also download the repository as a ZIP file from GitHub and extract it.

---

## 3. Start the Local Server

Open Terminal and move into the `server` folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The server normally runs at:

```text
http://localhost:8787
```

Keep the Terminal window open while using the extension.

### macOS example

If the project is in Downloads:

```bash
cd ~/Downloads/job-application-helper/server
npm install
npm start
```

---

## 4. Install the Chrome Extension

1. Open Google Chrome.
2. Go to:

```text
chrome://extensions/
```

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `extension` folder inside the project.

Select:

```text
job-application-helper/extension
```

Do not select the repository root folder.

The selected folder must directly contain:

```text
manifest.json
```

---

## 5. Pin the Extension

1. Click the extensions icon in the Chrome toolbar.
2. Find **Job Application Helper**.
3. Click the pin icon.
4. Open a job posting page.
5. Click the extension icon to open the side panel.

---

## 6. Add an OpenAI API Key

1. Open the extension.
2. Scroll to the API Key section.
3. Paste your OpenAI API key.
4. Click **Save Key**.

The key is stored in `chrome.storage.local`.

Do not save an API key on a shared or public computer.

Use **Clear Key** to remove it.

---

## 7. Upload and Select Resumes

1. Click the resume upload button.
2. Select one or more files.
3. Wait for parsing to finish.
4. Select the resume you want to use with the radio button.

Supported formats:

- PDF
- DOCX
- TXT
- Markdown

Parsed resume text is cached locally. Uploading the same file again can reuse the cached result.

Scanned PDFs without a text layer may not work because OCR is not included.

---

## 8. Add a Job Description

You can:

- click **Read current page**, or
- paste the job description manually

Always review the extracted text before generating content.

Some websites may block automatic extraction. In that case, paste the job description manually.

---

## 9. Generate a Cover Letter

1. Select a resume.
2. Add the job description.
3. Open **Cover Letter Settings**.
4. Choose:
   - cover letter type
   - tone
   - length
   - additional instructions
5. Select the output language.
6. Click **Generate Cover Letter**.
7. Review and edit the result.
8. Choose PDF or DOCX.
9. Click **Save**.

PDF is the default export format.

---

## 10. Generate a Job Application Answer

1. Paste the application question.
2. Open **Answer Requirements**.
3. Choose:
   - answer tone
   - word limit
   - answer type
   - additional instructions
4. Click **Generate Answer**.
5. Review the result.
6. Click **Copy**.

---

## 11. Change Interface and Output Languages

The interface language and output language are separate settings.

Supported interface languages include:

- English
- Simplified Chinese
- Traditional Chinese
- French
- Spanish
- German
- Japanese
- Korean

The output language controls the language of generated cover letters and answers.

---

## 12. Update the Extension After Code Changes

After editing files in the `extension` folder:

1. Open:

```text
chrome://extensions/
```

2. Find **Job Application Helper**.
3. Click the reload icon.
4. Reopen the extension side panel.

If server files changed, restart the server:

```bash
cd server
npm start
```

---

## 13. Troubleshooting

### `npm: command not found`

Install Node.js, then restart Terminal.

Check again:

```bash
node -v
npm -v
```

### `Failed to fetch`

Make sure the local server is running:

```bash
cd server
npm start
```

Keep the Terminal window open.

### Chrome says the manifest is missing

You selected the wrong folder.

Select the folder that directly contains:

```text
manifest.json
```

Usually:

```text
job-application-helper/extension
```

### The job description cannot be read

The page may be protected or dynamically rendered.

Paste the job description manually.

### PDF or DOCX export fails

Make sure:

- the local server is running
- the generated result is not empty
- dependencies were installed

Run:

```bash
cd server
npm install
npm start
```

### The extension does not update

Reload it from:

```text
chrome://extensions/
```

Then reopen the side panel.

---

## 14. Privacy and Security

The extension may store the following locally:

- parsed resume text
- resume metadata
- selected resume
- interface settings
- output language
- writing preferences
- saved API key

The API key is sent only during generation requests.

Do not commit the following to GitHub:

- `.env`
- API keys
- personal resumes
- generated cover letters
- private job application answers
- `node_modules`

---

## 15. Recommended `.gitignore`

```gitignore
node_modules/

.env
.env.*
!.env.example

*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

.DS_Store
.AppleDouble
.LSOverride

Thumbs.db
Desktop.ini

.vscode/
.idea/
*.swp
*.swo

dist/
build/
coverage/
tmp/
temp/
.cache/

*.pid
*.seed
*.pid.lock

private/
resumes/
generated/
```

---

## 16. Development Checks

Check JavaScript syntax:

```bash
node --check server/server.js
node --check extension/background.js
node --check extension/sidepanel.js
```

---

## 17. Important Notes

- API usage is billed separately.
- Generated content should always be reviewed before submission.
- Do not submit unsupported or invented claims.
- Chrome controls the side panel width; the extension only adapts its internal layout.
