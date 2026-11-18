// ---- Storage helpers -------------------------------------------------------
// All data lives in the browser's "localStorage": a small storage area that
// stays on this device even after the browser is closed. No server needed.

const SETTINGS_KEY = 'mocktest.settings.v1'
const QUESTIONS_KEY = 'mocktest.questions.v1'

// If an exam setting was never saved before, use these values.
export const DEFAULT_SETTINGS = {
  examName: 'My Exam',
  totalQuestions: 100,
  durationMinutes: 120,
  marksPerCorrect: 1,
  negativeMarks: 0.25,
  sections: [],
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadQuestions() {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveQuestions(questions) {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions))
}
