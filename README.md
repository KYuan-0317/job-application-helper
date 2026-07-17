# job-application-helper
An AI-powered job application assistant and resume generation plugin that helps users create tailored, professional resumes by analyzing job descriptions, matching relevant skills and experience, and exporting content to PDF or DOCX. It also generates personalized answers to job application questions based on the user's background and target role.

It combines a responsive Chrome side panel with a local Node.js service for resume parsing, AI generation, and PDF/DOCX export.

> Installation, setup, usage, and troubleshooting steps are documented separately in [`INSTRUCTIONS.md`](INSTRUCTIONS.md).

---

## Features

### Multiple resume profiles

- Upload multiple resumes
- Display all uploaded resumes in one list
- Select the active resume with a radio button
- Delete saved resume versions
- Cache parsed resume text locally
- Reuse cached results when the same resume is uploaded again

### Job description support

- Read visible job description text from the current page
- Paste or edit a job description manually
- Review extracted content before generation

### Cover letter generation

Generate a tailored cover letter using:

- the selected resume
- the job description
- cover letter style
- writing tone
- target length
- custom instructions
- selected output language

Generated cover letters can be edited and exported as:

- PDF
- DOCX

PDF is selected by default.

### Job application answers

- Paste an application question
- Select an answer tone
- Set a word limit
- Choose an answer type
- Add custom instructions
- Generate and edit a response
- Copy the result to the clipboard

### Multilingual interface and output

Supported interface languages include:

- English
- Simplified Chinese
- Traditional Chinese
- French
- Spanish
- German
- Japanese
- Korean

The interface language and generated output language are controlled separately.

### Responsive interface

- Chrome side panel layout
- Automatic adaptation to different panel widths
- White input fields
- Blue generated-result fields
- Collapsible settings sections
- Feature-specific validation and error messages
- Hover and focus feedback
- Light and dark mode support

---

## Project Structure

```text
job-application-helper/
├── extension/
│   ├── background.js
│   ├── manifest.json
│   ├── sidepanel.css
│   ├── sidepanel.html
│   └── sidepanel.js
├── server/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── .gitignore
├── INSTRUCTIONS.md
├── LICENSE
└── README.md
```

---

## Architecture

The project has two main parts.

### Chrome extension

The extension is responsible for:

- displaying the side panel
- managing interface state
- storing user preferences
- storing parsed resume text
- selecting the active resume
- extracting visible text from the current page
- sending requests to the local server
- displaying and editing generated content

### Local Node.js server

The local server is responsible for:

- parsing resume files
- sending generation requests to the AI provider
- creating PDF files
- creating DOCX files
- returning structured error responses

This separation keeps file parsing and API requests out of the browser UI code.

---

## Supported Resume Formats

- PDF
- DOCX
- TXT
- Markdown

Scanned PDFs without a text layer may require OCR before they can be parsed correctly.

---

## Local Data

The extension may store the following data in Chrome local storage:

- parsed resume text
- resume metadata
- selected resume identifier
- interface language
- output language
- writing preferences
- saved API key

Original uploaded resume files are not permanently retained by the extension after parsing.

---

## Security

The API key is entered by the user inside the extension and stored with `chrome.storage.local`.

The key is used only for generation requests and is not included in resume parsing requests.

Chrome local storage is not an encrypted password vault. Users should avoid saving an API key on shared or public computers.

Never commit any of the following to the repository:

- API keys
- `.env` files
- personal resumes
- generated cover letters
- private application responses
- `node_modules`

---

## Chrome Permissions

The extension uses permissions similar to:

```json
{
  "permissions": [
    "storage",
    "sidePanel",
    "activeTab",
    "scripting"
  ]
}
```

Permission purposes:

- `storage`: saves settings, resume cache, and the API key
- `sidePanel`: displays the extension interface
- `activeTab`: allows access to the active page after user interaction
- `scripting`: extracts visible text from the current page

The extension cannot read protected Chrome pages such as browser settings, the Chrome Web Store, or most `chrome://` pages.

---

## Local API Endpoints

The local server provides endpoints for:

```text
POST /parse-resume
POST /generate-cover-letter
POST /generate-answer
POST /export-docx
POST /export-pdf
```

---

## Development Notes

Useful syntax checks:

```bash
node --check server/server.js
node --check extension/background.js
node --check extension/sidepanel.js
```

After editing extension files, reload the extension from:

```text
chrome://extensions/
```

Detailed development and setup instructions are available in [`INSTRUCTIONS.md`](INSTRUCTIONS.md).

---

## Privacy

Generation requests may contain:

- parsed resume text
- job descriptions
- cover letter instructions
- job application questions

This information is sent to the configured AI provider only after the user starts a generation request.

Users should review the data-processing and privacy terms of their selected AI provider.

---

## Limitations

- ChatGPT subscriptions do not include OpenAI API usage.
- API billing is separate from ChatGPT subscriptions.
- Some websites may block or limit automatic page-text extraction.
- Scanned PDFs may require OCR.
- Generated content may contain mistakes or unsupported claims.
- The Chrome side panel width is controlled by the user.
- Website layout changes may affect job description extraction.

---

## Disclaimer

This project is a drafting assistant, not an automated job application submission tool.

Users are responsible for:

- reviewing generated content
- checking factual accuracy
- removing unsupported claims
- protecting personal information
- following employer application rules
- monitoring API usage and costs

Generated content should be reviewed before submission.

---

## Contributing

Contributions are welcome.

Suggested workflow:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Submit a pull request with a clear description.

Please avoid including private resumes, API keys, or real application data in issues and pull requests.

---

## License

See the [LICENSE](LICENSE) file for details.
