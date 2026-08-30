---
name: github-project-docs
description: Use this skill when writing README files, project summaries, or short GitHub descriptions for a software project.
---

# GitHub Project Docs Writer

Use this skill to create clear, professional documentation for GitHub repositories.

## Goal
Write README content and short GitHub project descriptions that are concise, polished, and easy to understand for visitors, recruiters, or collaborators.

## Standards
- Keep the tone professional, friendly, and concise.
- Write for GitHub users scanning quickly.
- Prefer clear headings, bullets, and short sections.
- Include a project summary, features, tech stack, setup instructions, and live demo placeholder when relevant.
- For short project descriptions, keep it under 500 characters.
- If the repo is a web app, mention how to run it locally and include a placeholder URL for deployment.
- If no screenshot is available, suggest a placeholder or image section.

## README Template
Use this structure when needed:

```md
# Project Name

Short summary of the project.

## Live Demo

[Your hosted app URL](https://your-domain.example.com)

## Screenshot

![Project Screenshot](your-image.png)

## Features
- Feature 1
- Feature 2
- Feature 3

## Tech Stack
- HTML
- CSS
- JavaScript

## Project Structure
```text
project/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run Locally
1. Clone the repository
2. Open the project folder
3. Run a local server or open index.html

## Usage
Describe how the app works.

## Future Improvements
- Improvement idea 1
- Improvement idea 2

## License
Add license info if relevant.
```

## Short GitHub Description Formula
Write a brief description that includes:
- what the project is
- what it does
- the main stack
- optional note about being beginner-friendly or frontend-focused

Example:
"A simple calculator web app built with HTML, CSS, and JavaScript. It supports basic arithmetic operations and a clean, responsive UI for quick everyday calculations."

## Important Notes
- Do not invent features that are not present in the repo.
- Base documentation on the actual files and project structure.
- Keep naming consistent with the repository.
- Use markdown formatting that looks good on GitHub.
- Replace placeholder URLs with the real deployment link when available.
