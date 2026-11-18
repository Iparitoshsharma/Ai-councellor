# Exam Prep Practice App

A simple, clean practice app for students: open it, start a test, answer
multiple-choice questions (with an optional countdown timer), and get a full
results review with explanations.

- **No login. No ads. No server costs.** Everything runs in the browser.
- Questions are fed from **one file in this repository** (`src/data/questions.json`)
  — the "backend" is your GitHub repo. To add or update questions, edit that
  file and the new set goes live after the site is redeployed.

## Setup for beginners (about 10 minutes, one time)

### 1. Install Node.js

Go to https://nodejs.org → download the **LTS** version (green button) → run
the installer → click "Next" through everything.

### 2. Get this project onto your computer

Open **VS Code**:

1. Click the **Source Control** icon (three circles joined by lines) in the left bar.
2. Click **Clone Git Repository...** (or press `Ctrl+Shift+P`, type `clone`).
3. Sign in with GitHub if asked.
4. Type `Iparitoshsharma/Ai-councellor` and pick it from the list.
5. Choose a folder (e.g. `Documents`) → when asked, click **Open**.

### 3. Install and run

In VS Code: **Terminal → New Terminal**, then type:

```
npm install
```

press Enter, wait 1–2 minutes, then type:

```
npm run dev
```

Ctrl+click (Mac: Cmd+click) the `http://localhost:5173` link that appears.

### 4. Try it

1. Press **Start the test** and answer the questions — try the timer,
   "Mark", the question list, and **Submit**.
2. Check your **Results** page with the full review and explanations.
3. Open **⚙️ Exam settings**, change the name or turn the timer off, save, and start a new test.

### Stopping and restarting

Press `Ctrl+C` in the terminal to stop. Later, repeat step 3 (`npm run dev`).

## Adding/updating questions (the "backend")

Questions live in **`src/data/questions.json`**. Each question looks like this:

```json
{
  "id": "ca001",
  "topic": "Sports",
  "difficulty": "easy",
  "type": "direct",
  "question": "Which city hosted the 2024 Summer Olympics?",
  "options": ["Tokyo", "Paris", "Los Angeles", "Brisbane"],
  "correct_option": 1,
  "explanation": "Paris hosted the 2024 Games.",
  "source_page": null
}
```

Rules:

- `correct_option` counts from **0** (first option = 0, second = 1, ...).
- `difficulty`: `easy`, `medium`, or `hard`.
- Every `id` must be unique.
- `source_page` is optional (use `null` if not needed).

The built-in sample set is current affairs — replace it with your real
questions whenever you're ready.

## Publishing online (later stage)

The finished app can be hosted **free** on Netlify or Vercel so students can
use a normal link from any phone. Step-by-step instructions come at that stage.
