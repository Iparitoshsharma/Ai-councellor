export default function HomePage({
  settings,
  totalInBank,
  chapters,
  chapter1Count,
  onStart,
  onSelectPool,
  goSettings,
}) {
  const testSize = Math.min(settings.questionsPerTest, totalInBank)
  const timerLabel = settings.timerEnabled
    ? `${settings.durationMinutes} minute timer`
    : 'Untimed'

  return (
    <div>
      <header className="app-header">
        <h1>{settings.examName}</h1>
        <p className="app-subtitle">Practice daily. Improve faster.</p>
      </header>

      <section className="card hero-card">
        <p className="hero-kicker">Full mock test</p>
        <p className="hero-line">
          <strong>{testSize}</strong> questions
        </p>
        <p className="hero-sub">
          Mixed from all {totalInBank} questions · {timerLabel} ·{' '}
          {'\u2212'}{settings.negativeMarks} per wrong answer
        </p>
        <button className="btn btn-primary btn-big" onClick={onStart}>
          Start the test
        </button>
        <p className="hero-foot">
          Wrong answers lose {settings.negativeMarks} mark{settings.negativeMarks === '1' ? '' : 's'}.
          Answered but unsure questions lose nothing if correct.
        </p>
      </section>

      <h2 className="section-title">Chapter-wise mock tests</h2>

      <div className="card-grid">
        {chapters.map((ch) => {
          const size = Math.min(settings.questionsPerTest, ch.count)
          return (
            <section className="card tile" key={ch.id}>
              <p className="tile-title">{ch.name}</p>
              <p className="tile-sub">
                {ch.count} questions &middot; {size} per test
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onSelectPool(ch.id)}
              >
                Start
              </button>
            </section>
          )
        })}

        <section className="card tile">
          <p className="hero-kicker">Questionnaire</p>
          <p className="tile-title">Chapter 1 full set</p>
          <p className="tile-sub">
            {chapter1Count} questions &middot;{' '}
            {Math.min(settings.questionsPerTest, chapter1Count)} per test
          </p>
          <button
            className="btn btn-primary"
            onClick={() => onSelectPool('chapter1')}
          >
            Start
          </button>
        </section>
      </div>

      <button className="btn btn-ghost" onClick={goSettings}>
        ⚙️ Exam settings
      </button>
    </div>
  )
}
