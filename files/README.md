# Dynamic CV Portfolio — Assessment B

An enhanced, dynamic version of my Assessment A CV portfolio, co-developed with an AI coding agent.
The site loads all content from a JSON file and responds visually to user interaction
(a cinematic particle hero on load and scroll-triggered section reveals).

**Author:** Michee Likanda Lifetu

## Project structure
- `index.html` — homepage: name, title, about, cinematic hero
- `cv.html` — full CV page: skills, education, experience, interests
- `style.css` — one shared stylesheet for both pages
- `app.js` — all JavaScript (loads JSON, builds pages, runs the animations)
- `data.json` — all CV content
- `count_new_comments.sh` — Bash script for Task 3
- `Michee_bash_report.txt` — output of the Bash script

## How to run locally
The site loads `data.json` with `fetch()`, which browsers block when a page is opened
directly from the file system. You must serve the folder over a local web server:

1. Open a terminal in the project folder.
2. Run one of:
   - Python: `python -m http.server 8000`  (or `python3 -m http.server 8000`)
   - VS Code: install the **Live Server** extension and click "Go Live"
3. Open `http://localhost:8000/index.html` in your browser.

Opening `index.html` by double-clicking will leave the content blank, because `fetch()` is blocked.

## AI tools used
- **Claude (Anthropic)** — co-developed the website code (HTML, CSS, JavaScript, JSON, Bash).

## Third-party libraries
None — the particle hero and animations are written in plain JavaScript.
