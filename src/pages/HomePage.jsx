export default function HomePage({ settings, totalInBank, onStart, goSettings }) {
  const testSize = Math.min(settings.questionsPerTest, totalInBank)

  return (
    <div>
      <header className="app-header">
        <h1>{settings.examName}</h1>
        <p className="app-subtitle">Practice daily. Improve faster.</p>
      </header>

      <section className="card hero-card">
        <p className="hero-line">
          <strong>{testSize}</strong> questions
        </p>
        <p className="hero-sub">
          {settings.timerEnabled ? `${settings.durationMinutes} minute timer` : 'Untimed'} ·
          {' −'}{settings.negativeMarks} per wrong answer
        </p>
        <button className="btn btn-primary btn-big" onClick={onStart}>
          Start the test
        </button>
        <p className="hero-foot">
          Wrong answers lose {settings.negativeMarks} mark{settings.negativeMarks === '1' ? '' : 's'}.
          Answered but unsure questions lose nothing if correct.
        </p>
      </section>

      <button className="btn btn-ghost" onClick={goSettings}>
        ⚙️ Exam settings
      </button>
    </div>
  )
}
