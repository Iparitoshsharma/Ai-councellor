export default function HomePage({
  settings,
  totalInBank,
  chapter1Count,
  historyCount,
  onStart,
  onStartChapter1,
  onStartHistory,
  goSettings,
}) {
  const testSize = Math.min(settings.questionsPerTest, totalInBank)
  const chapter1Size = Math.min(settings.questionsPerTest, chapter1Count)
  const historySize = Math.min(settings.questionsPerTest, historyCount)

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
          Mixed from all {totalInBank} questions ·{' '}
          {settings.timerEnabled ? `${settings.durationMinutes} minute timer` : 'Untimed'} ·{' '}
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

      <section className="card chapter-card">
        <p className="hero-kicker">Chapter 1 mock test</p>
        <p className="chapter-title">
          Uttarakhand &mdash; Political and Administrative Structure
        </p>
        <p className="hero-sub">
          {chapter1Size} questions from this chapter &middot; picked from{' '}
          {chapter1Count} &middot;{' '}
          {settings.timerEnabled ? `${settings.durationMinutes} minute timer` : 'Untimed'}
        </p>
        <button className="btn btn-primary btn-big" onClick={onStartChapter1}>
          Start Chapter 1 test
        </button>
      </section>

      <section className="card chapter-card">
        <p className="hero-kicker">History mock test &middot; a different section</p>
        <p className="chapter-title">
          UK History &mdash; Uttarakhand Historical Study
        </p>
        <p className="hero-sub">
          {historySize} questions from this section &middot; picked from{' '}
          {historyCount} &middot;{' '}
          {settings.timerEnabled ? `${settings.durationMinutes} minute timer` : 'Untimed'}
        </p>
        <button className="btn btn-primary btn-big" onClick={onStartHistory}>
          Start History test
        </button>
      </section>

      <button className="btn btn-ghost" onClick={goSettings}>
        ⚙️ Exam settings
      </button>
    </div>
  )
}
