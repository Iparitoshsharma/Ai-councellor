import { useState } from 'react'
import { validateQuestions } from '../lib/validate.js'
import { saveQuestions } from '../lib/storage.js'

export default function ImportPage({ questions, onQuestionsChange }) {
  // The raw contents of the chosen file (already converted from JSON).
  const [parsed, setParsed] = useState(null)
  const [fileName, setFileName] = useState(null)
  // "replace" = wipe the bank and use only this file.
  // "add"     = keep what's in the app and add these questions to it.
  const [mode, setMode] = useState('add')
  const [result, setResult] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [successCount, setSuccessCount] = useState(null)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    // Reset everything when a new file is chosen.
    setParsed(null)
    setResult(null)
    setSuccessCount(null)
    setFileError(null)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      try {
        setParsed(JSON.parse(reader.result))
      } catch {
        setFileError(
          `"${file.name}" is not a valid JSON file. Make sure it was saved/exported as JSON (plain text that starts with a [ ) and try again.`
        )
      }
    }
    reader.onerror = () => setFileError('Could not read the file. Please try again.')
    reader.readAsText(file)
  }

  function importNow() {
    if (!parsed) return
    // When replacing, duplicate ids against the old bank don't matter.
    const idsToAvoid = mode === 'add' ? questions.map((q) => q.id) : []
    const check = validateQuestions(parsed, idsToAvoid)
    setResult(check)

    if (check.errors.length === 0) {
      const newBank = mode === 'add' ? [...questions, ...check.questions] : check.questions
      saveQuestions(newBank)
      onQuestionsChange(newBank)
      setSuccessCount(check.questions.length)
      setParsed(null) // clear the file choice after a successful import
      setFileName(null)
    }
  }

  function reset() {
    setParsed(null)
    setResult(null)
    setSuccessCount(null)
    setFileError(null)
    setFileName(null)
  }

  return (
    <div>
      {successCount !== null && (
        <div className="banner banner-success">
          ✅ Import success — {successCount} {successCount === 1 ? 'question was' : 'questions were'} added
          to your bank. They are now in the <strong>Question Bank</strong> tab.
          <button className="btn btn-small banner-button" onClick={reset}>
            Import another file
          </button>
        </div>
      )}

      <section className="card">
        <h2 className="card-title">1. Choose your questions.json file</h2>
        <p className="muted">
          Right now your bank has <strong>{questions.length}</strong>{' '}
          {questions.length === 1 ? 'question' : 'questions'}.
        </p>
        <p className="muted small">
          Don't have the file yet?{' '}
          <a href="/sample-questions.json" download="questions.json">
            Download the sample questions.json (20 questions)
          </a>{' '}
          to see the exact format.
        </p>
        <input type="file" accept=".json,application/json" onChange={handleFile} />

        {fileError && <div className="banner banner-error">⚠️ {fileError}</div>}

        {parsed && (
          <div className="banner banner-info">
            📄 Loaded <strong>{fileName}</strong> — it contains{' '}
            <strong>{Array.isArray(parsed) ? parsed.length : 'data that is not a list of'}</strong>{' '}
            {Array.isArray(parsed) ? 'questions.' : 'items (it must be a list of questions).'}
          </div>
        )}
      </section>

      {parsed && (
        <section className="card">
          <h2 className="card-title">2. How should we import it?</h2>
          <label className="radio-row">
            <input
              type="radio"
              name="mode"
              checked={mode === 'add'}
              onChange={() => setMode('add')}
            />
            <span>
              <strong>Add these questions</strong> to what's already in the app
            </span>
          </label>
          <label className="radio-row">
            <input
              type="radio"
              name="mode"
              checked={mode === 'replace'}
              onChange={() => setMode('replace')}
            />
            <span>
              <strong>Replace everything</strong> — delete the current bank and use only this file
            </span>
          </label>
          <button className="btn btn-primary" onClick={importNow}>
            Check & import
          </button>
        </section>
      )}

      {result && result.errors.length > 0 && (
        <section className="card">
          <h2 className="card-title">⛔ Nothing was imported — fix these problems first</h2>
          <p className="muted">
            {result.errors.length} problem{result.errors.length === 1 ? '' : 's'} found. Fix them
            in your file and import again.
          </p>
          <ul className="error-list">
            {result.errors.slice(0, 50).map((err, i) => (
              <li key={i}>
                <strong>{err.question}</strong>, field <code>{err.field}</code>: {err.message}
              </li>
            ))}
          </ul>
          {result.errors.length > 50 && (
            <p className="muted">…and {result.errors.length - 50} more problems.</p>
          )}
        </section>
      )}

      {result && result.errors.length === 0 && result.warnings.length > 0 && (
        <section className="card">
          <h2 className="card-title">Gentle reminders (these did not block the import)</h2>
          <ul className="warning-list">
            {result.warnings.slice(0, 20).map((w, i) => (
              <li key={i}>
                <strong>{w.question}</strong>, field <code>{w.field}</code>: {w.message}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
