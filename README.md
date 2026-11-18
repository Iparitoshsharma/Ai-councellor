# Mock Test Practice App

A simple mock-test app for one student: question bank, timed mock tests, and
performance analysis. All data stays in your own browser — no accounts, no
server, no internet needed after setup.

## What's included (Stage 1)

- **Import** — upload a `questions.json` file. The app checks every question
  and tells you exactly which question and which field is wrong before it
  imports anything.
- **Question Bank** — every imported question, filterable by chapter, topic,
  difficulty, and question type, with counts.
- **Settings** — exam name, questions per mock, duration, marking scheme,
  optional sections. Saved in the browser.

(Timed tests, results, and analysis come in later stages.)

## Setup for beginners (one-time, about 10 minutes)

### 1. Install Node.js

Go to https://nodejs.org and download the **LTS** version (the green button).
Run the installer and click "Next" through everything. This gives you two
programs: Node.js and npm (npm installs the app's pieces).

### 2. Download this project and open a terminal in it

Download/unzip the project folder. Then open the folder and, in the address
bar of the folder window, type `cmd` and press Enter (Windows) — a black
window opens already pointed at the right folder. On Mac: right-click the
folder → New Terminal at Folder.

### 3. Install what the app needs

In that black/white terminal window, type:

```
npm install
```

Press Enter and wait 1–2 minutes.

### 4. Start the app

```
npm run dev
```

It will print a link like `http://localhost:5173`. Hold Ctrl (or Cmd on Mac)
and click the link, or type it into your browser. The app opens — that's it.

### 5. Try it

1. Open the **Import** tab, download the sample `questions.json` from the
   link there, and upload it.
2. Open the **Question Bank** tab and try the filters.
3. Open the **Settings** tab, change the exam name, press **Save settings**.

### Stopping it

Press `Ctrl + C` in the terminal. To start it again later, repeat step 4.

## Where is my data stored?

Everything is saved **in the browser you used** (localStorage). If you clear
browser data or switch browsers/phones, the question bank and settings are
gone — use the Backup feature (coming in Stage 4) to keep a safe copy.

## The questions.json format

One file = one list of questions:

```json
[
  {
    "id": "q001",
    "chapter": "Chapter 1 - Title",
    "topic": "Subtopic name",
    "difficulty": "easy",
    "type": "direct",
    "question": "The question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_option": 0,
    "explanation": "Why option A is correct.",
    "source_page": 112
  }
]
```

- `correct_option` counts from **0**: first option = 0, second = 1, third = 2, fourth = 3.
- `difficulty` must be `easy`, `medium`, or `hard`.
- `type` must be `direct`, `statement`, `match`, or `assertion_reason`.
- `source_page` is optional.
- A sample file with 20 questions is in `public/sample-questions.json`.

## Deploying it online (later stages)

The finished app is a static site and can be hosted free on Netlify or
Vercel. Step-by-step instructions come in Stage 5.
