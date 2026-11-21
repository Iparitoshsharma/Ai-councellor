import { useState, useEffect } from 'react'
import { formatTime } from '../lib/storage.js'

export default function TestPage({ settings, attempt, onSubmit, onQuit }) {
  const { questions } = attempt

  // Answers and "marked for review" flags live here as proper React state,
  // so the screen updates the moment the student taps an option.
  const [answers, setAnswers] = useState(attempt.answers)
  const [marked, setMarked] = useState(attempt.marked)
  const [current, setCurrent] = useState(0)
  const [showPalette, setShowPalette] = useState(false)
  const [confirming, setConfirming] = useState(false)
  // Elapsed seconds tick up always (shown live when untimed).
  const [elapsed, setElapsed] = useState(0)
  // Countdown only when the timer is on.
  const [secondsLeft, setSecondsLeft] = useState(
    settings.timerEnabled ? settings.durationMinutes * 60 : null
  )
  const [finished, setFinished] = useState(false)

  function submit(auto = false) {
    if (finished) return
    setFinished(true)
    onSubmit({ answers, timeTakenSeconds: elapsed, autoSubmitted: auto })
  }

  // Count elapsed time, one tick per second.
  useEffect(() => {
    if (finished) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [finished])

  // One-second countdown that fires auto-submit at exactly zero.
  useEffect(() => {
    if (secondsLeft === null || finished) return
    if (secondsLeft <= 0) {
      submit(true)
      return
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])

  const answeredCount = answers.filter((a) => a !== null).length

  return (
    <div>
      {/* --- Top bar: timer + progress --- */}
      <div className="test-topbar">
        {settings.timerEnabled ? (
          <span className={'timer' + (secondsLeft <= 30 ? ' timer-warning' : '')}>
            ⏱ {formatTime(secondsLeft)}
          </span>
        ) : (
          <span className="timer">⏱ {formatTime(elapsed)}</span>
        )}
        <span className="progress-label">
          {answeredCount} / {questions.length} answered
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* --- Question card --- */}
      <article className="card question-card">
        <div className="question-top-row">
          <span className="muted small">
            Question {current + 1} of {questions.length} · {questions[current].topic}
          </span>
          <button
            className={'btn-mark' + (marked[current] ? ' btn-mark-active' : '')}
            onClick={() =>
              setMarked((m) => m.map((v, i) => (i === current ? !v : v)))
            }
          >
            {marked[current] ? '★ Marked' : '☆ Mark'}
          </button>
        </div>

        <p className="question-text">{questions[current].question}</p>

        <div className="options">
          {questions[current].options.map((opt, i) => (
            <button
              key={i}
              className={'option-btn' + (answers[current] === i ? ' option-selected' : '')}
              onClick={() => setAnswers((a) => a.map((v, idx) => (idx === current ? i : v)))}
            >
              <span className="option-letter">{'ABCD'[i]}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </article>

      {/* --- Navigation --- */}
      <div className="nav-row">
        <button
          className="btn btn-ghost"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          ← Prev
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setAnswers((a) => a.map((v, idx) => (idx === current ? null : v)))}
          disabled={answers[current] === null}
        >
          Clear
        </button>
        {current < questions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrent((c) => c + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setConfirming(true)}>
            Finish
          </button>
        )}
      </div>

      <div className="nav-row">
        <button className="btn btn-ghost" onClick={() => setShowPalette((v) => !v)}>
          {showPalette ? 'Hide list ▲' : 'All questions ▼'}
        </button>
        <button className="btn btn-danger-outline" onClick={() => setConfirming(true)}>
          Submit
        </button>
      </div>

      {/* --- Palette: jump to any question, colours show status --- */}
      {showPalette && (
        <section className="card">
          <h2 className="card-title">Jump to a question</h2>
          <div className="palette">
            {questions.map((q, i) => (
              <button
                key={q.id}
                className={
                  'palette-dot' +
                  (i === current ? ' palette-current' : '') +
                  (marked[i] ? ' palette-marked' : '') +
                  (answers[i] !== null ? ' palette-answered' : '')
                }
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="muted small">
            <span className="palette-legend palette-answered">answered</span>{' '}
            <span className="palette-legend palette-marked">marked</span>{' '}
            <span className="palette-legend">not answered</span>
          </p>
        </section>
      )}

      <button className="btn btn-ghost btn-quit" onClick={onQuit}>
        Leave test (nothing is saved)
      </button>

      {/* --- Submit confirmation --- */}
      {confirming && (
        <div className="modal-overlay" onClick={() => setConfirming(false)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="card-title">Submit the test?</h2>
            <p>
              You answered <strong>{answeredCount}</strong> of {questions.length} questions.
              {questions.length - answeredCount > 0 && (
                <>
                  {' '}
                  <strong>{questions.length - answeredCount}</strong> would count as skipped.
                </>
              )}
            </p>
            <p className="muted small">⚠️ After submitting you cannot change your answers.</p>
            <div className="nav-row">
              <button className="btn btn-ghost" onClick={() => setConfirming(false)}>
                Keep answering
              </button>
              <button className="btn btn-primary" onClick={() => submit(false)}>
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
