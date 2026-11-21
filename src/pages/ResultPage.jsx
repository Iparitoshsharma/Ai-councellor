import { formatTime } from '../lib/storage.js'

export default function ResultPage({ settings, attempt, goHome, onRetake }) {
  const { questions, answers, timeTakenSeconds, autoSubmitted } = attempt

  let correct = 0
  let wrong = 0
  let skipped = 0
  questions.forEach((q, i) => {
    if (answers[i] === null) skipped++
    else if (answers[i] === q.correct_option) correct++
    else wrong++
  })

  const rawScore = correct * settings.marksPerCorrect - wrong * settings.negativeMarks
  const maxScore = questions.length * settings.marksPerCorrect
  const percent = Math.round((rawScore / maxScore) * 100)

  return (
    <div>
      <header className="app-header">
        <h1>Results</h1>
        {autoSubmitted && (
          <p className="app-subtitle">⏱ Time was up — the test submitted itself.</p>
        )}
      </header>

      <section className="card score-card">
        <p className="score-big">
          {rawScore} <span className="score-max">/ {maxScore}</span>
        </p>
        <p className="score-percent">{percent}%</p>
        <div className="score-breakdown">
          <span className="pill pill-correct">✔ {correct} correct</span>
          <span className="pill pill-wrong">✘ {wrong} wrong</span>
          <span className="pill pill-skipped">— {skipped} skipped</span>
        </div>
        <p className="muted small">
          Time taken: {formatTime(timeTakenSeconds)} · Lost to negative marking:{' '}
          {wrong * settings.negativeMarks} mark{wrong === 1 && settings.negativeMarks === 1 ? '' : 's'}
        </p>
        <div className="nav-row">
          <button className="btn btn-ghost" onClick={goHome}>
            Home
          </button>
          <button className="btn btn-primary" onClick={onRetake}>
            Take another test
          </button>
        </div>
      </section>

      <h2 className="section-title">Full review</h2>

      {questions.map((q, i) => {
        const userAnswer = answers[i]
        const isCorrect = userAnswer === q.correct_option
        const isSkipped = userAnswer === null
        const statusClass = isSkipped
          ? 'result-wrong result-skipped'
          : isCorrect
            ? 'result-correct'
            : 'result-wrong'

        return (
          <article key={q.id} className={'card review-card ' + statusClass}>
            <div className="review-head">
              <span className="muted small">Q{i + 1} · {q.topic}</span>
              <span className={'pill ' + (isSkipped ? 'pill-skipped' : isCorrect ? 'pill-correct' : 'pill-wrong')}>
                {isSkipped ? 'skipped' : isCorrect ? 'correct' : 'wrong'}
              </span>
            </div>
            <p className="question-text">{q.question}</p>
            <ul className="option-list">
              {q.options.map((opt, oi) => {
                const isCorrectOption = oi === q.correct_option
                const isUserOption = oi === userAnswer
                let cls = 'option'
                if (isCorrectOption) cls += ' option correct-option'
                if (isUserOption && !isCorrect) cls += ' option-wrong-option'
                return (
                  <li key={oi} className={cls}>
                    {opt}
                    {isUserOption && <span className="your-answer-tag"> ← your answer</span>}
                    {isCorrectOption && <span className="correct-tag"> ✔ correct</span>}
                  </li>
                )
              })}
            </ul>
            {q.explanation && <p className="explanation">{q.explanation}</p>}
          </article>
        )
      })}
    </div>
  )
}
