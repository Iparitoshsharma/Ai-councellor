import { useState } from 'react'
import { saveSettings } from '../lib/storage.js'

export default function SettingsPage({ settings, onSettingsChange }) {
  // The form starts filled in with whatever is already saved.
  const [examName, setExamName] = useState(settings.examName)
  const [totalQuestions, setTotalQuestions] = useState(settings.totalQuestions)
  const [durationMinutes, setDurationMinutes] = useState(settings.durationMinutes)
  const [marksPerCorrect, setMarksPerCorrect] = useState(settings.marksPerCorrect)
  const [negativeMarks, setNegativeMarks] = useState(settings.negativeMarks)
  const [sectionsText, setSectionsText] = useState(settings.sections.join('\n'))
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  function handleSave(e) {
    e.preventDefault()

    // Turn the text boxes into proper numbers.
    const tq = Number(totalQuestions)
    const dur = Number(durationMinutes)
    const mpc = Number(marksPerCorrect)
    const neg = Number(negativeMarks)

    if (!examName.trim()) {
      setError('Please give your exam a name.')
      return
    }
    if (!Number.isFinite(tq) || tq < 1) {
      setError('Total questions per full mock must be 1 or more.')
      return
    }
    if (!Number.isFinite(dur) || dur < 1) {
      setError('Duration must be at least 1 minute.')
      return
    }
    if (!Number.isFinite(mpc) || mpc <= 0) {
      setError('Marks per correct answer must be more than 0.')
      return
    }
    if (!Number.isFinite(neg) || neg < 0) {
      setError('Negative marking must be 0 or more (0 means no negative marking).')
      return
    }

    // Sections are optional: one section per line, empty lines removed.
    const sections = sectionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const newSettings = {
      examName: examName.trim(),
      totalQuestions: tq,
      durationMinutes: dur,
      marksPerCorrect: mpc,
      negativeMarks: neg,
      sections,
    }

    saveSettings(newSettings)
    onSettingsChange(newSettings)
    setError(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000) // hide the "Saved" message after 3 seconds
  }

  return (
    <form className="card" onSubmit={handleSave}>
      <h2 className="card-title">Exam settings</h2>
      <p className="muted small">
        These settings are used by your full mocks (coming in Stage 2) and saved in this
        browser only.
      </p>

      <label className="field">
        <span className="field-label">Exam name</span>
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="e.g. SSC CGL 2026"
        />
      </label>

      <label className="field">
        <span className="field-label">Total questions per full mock</span>
        <input
          type="number"
          min="1"
          value={totalQuestions}
          onChange={(e) => setTotalQuestions(e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field-label">Duration in minutes</span>
        <input
          type="number"
          min="1"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field-label">Marks per correct answer</span>
        <input
          type="number"
          step="0.25"
          min="0"
          value={marksPerCorrect}
          onChange={(e) => setMarksPerCorrect(e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field-label">Negative marks per wrong answer</span>
        <input
          type="number"
          step="0.25"
          min="0"
          value={negativeMarks}
          onChange={(e) => setNegativeMarks(e.target.value)}
        />
        <span className="field-hint">Use 0 if there is no negative marking.</span>
      </label>

      <label className="field">
        <span className="field-label">Sections (optional)</span>
        <textarea
          rows="4"
          value={sectionsText}
          onChange={(e) => setSectionsText(e.target.value)}
          placeholder={'Physics\nChemistry\nBiology'}
        />
        <span className="field-hint">
          One section per line. Leave empty if your exam has no sections.
        </span>
      </label>

      {error && <div className="banner banner-error">⚠️ {error}</div>}
      {saved && <div className="banner banner-success">✅ Settings saved.</div>}

      <button type="submit" className="btn btn-primary">
        Save settings
      </button>
    </form>
  )
}
