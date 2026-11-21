// ---- Settings stored in the browser ----------------------------------------
// localStorage is a small storage area inside the browser that survives
// closing the app. No server involved.

// v3: bumped when the exam content was switched from Hindi to English,
// so older saved settings (with the Hindi exam name) are ignored.
const SETTINGS_KEY = 'examprep.settings.v3'

export const DEFAULT_SETTINGS = {
  examName: 'Uttarakhand General Knowledge Mock Test',
  questionsPerTest: 25,
  timerEnabled: true,
  durationMinutes: 25,
  marksPerCorrect: 1,
  negativeMarks: 0.25,
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

// ---- Small helper: shuffle a list randomly (Fisher–Yates) -------------------
export function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// ---- Small helper: 125 seconds -> "02:05" ------------------------------------
export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(s / 60)
  const seconds = s % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
