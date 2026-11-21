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

      {chapters.map((ch) => {
        const size = Math.min(settings.questionsPerTest, ch.count)
        return (
          <section className="card chapter-card" key={ch.id}>
            <p className="chapter-title">{ch.name}</p>
            <p className="hero-sub">
              {size} questions &middot; from {ch.count} in this chapter &middot;{' '}
              {timerLabel}
            </p>
            <button
              className="btn btn-primary btn-big"
              onClick={() => onSelectPool(ch.id)}
            >
              Start this chapter
            </button>
          </section>
        )
      })}

      <section className="card chapter-card">
        <p className="hero-kicker">Questionnaire</p>
        <p className="chapter-title">
          Chapter 1 full set (pages 6&ndash;15)
        </p>
        <p className="hero-sub">
          {Math.min(settings.questionsPerTest, chapter1Count)} questions &middot; from
          all {chapter1Count} in the questionnaire &middot; {timerLabel}
        </p>
        <button
          className="btn btn-primary btn-big"
          onClick={() => onSelectPool('chapter1')}
        >
          Start Chapter 1 set
        </button>
      </section>

      <button className="btn btn-ghost" onClick={goSettings}>
        ⚙️ Exam settings
      </button>
    </div>
  )
}
