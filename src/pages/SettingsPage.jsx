import { useState } from 'react'
import { saveSettings } from '../lib/storage.js'

export default function SettingsPage({ settings, onSettingsChange, goHome }) {
  const [examName, setExamName] = useState(settings.examName)
  const [questionsPerTest, setQuestionsPerTest] = useState(settings.questionsPerTest)
  const [timerEnabled, setTimerEnabled] = useState(settings.timerEnabled)
  const [durationMinutes, setDurationMinutes] = useState(settings.durationMinutes)
  const [marksPerCorrect, setMarksPerCorrect] = useState(settings.marksPerCorrect)
  const [negativeMarks, setNegativeMarks] = useState(settings.negativeMarks)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  function handleSave(e) {
    e.preventDefault()

    const qpt = Number(questionsPerTest)
    const dur = Number(durationMinutes)
    const mpc = Number(marksPerCorrect)
    const neg = Number(negativeMarks)

    if (!examName.trim()) return setError('Please give the exam a name.')
    if (!Number.isFinite(qpt) || qpt < 1) return setError('Questions per test must be 1 or more.')
    if (timerEnabled && (!Number.isFinite(dur) || dur < 1))
      return setError('Timer duration must be at least 1 minute.')
    if (!Number.isFinite(mpc) || mpc <= 0) return setError('Marks per correct answer must be more than 0.')
    if (!Number.isFinite(neg) || neg < 0) return setError('Negative marking must be 0 or more.')

    const newSettings = {
      examName: examName.trim(),
      questionsPerTest: qpt,
      timerEnabled,
      durationMinutes: dur,
      marksPerCorrect: mpc,
      negativeMarks: neg,
    }
    saveSettings(newSettings)
    onSettingsChange(newSettings)
    setError(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form className="card" onSubmit={handleSave}>
      <button type="button" className="btn btn-ghost btn-back" onClick={goHome}>
        ← Back
      </button>
      <h2 className="card-title">Exam settings</h2>

      <label className="field">
        <span className="field-label">Exam name</span>
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="e.g. Current Affairs Mock Test"
        />
      </label>

      <label className="field">
        <span className="field-label">Questions per test</span>
        <input
          type="number"
          min="1"
          value={questionsPerTest}
          onChange={(e) => setQuestionsPerTest(e.target.value)}
        />
        <span className="field-hint">
          If the bank has fewer questions, the test simply uses all of them.
        </span>
      </label>

      <label className="check-row">
        <input
          type="checkbox"
          checked={timerEnabled}
          onChange={(e) => setTimerEnabled(e.target.checked)}
        />
        <span>Show a countdown timer (auto-submits at zero)</span>
      </label>

      {timerEnabled && (
        <label className="field">
          <span className="field-label">Timer duration (minutes)</span>
          <input
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </label>
      )}

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
        <span className="field-hint">Use 0 for no negative marking.</span>
      </label>

      {error && <div className="banner banner-error">⚠️ {error}</div>}
      {saved && <div className="banner banner-success">✅ Settings saved.</div>}

      <button type="submit" className="btn btn-primary">
        Save settings
      </button>
    </form>
  )
}
