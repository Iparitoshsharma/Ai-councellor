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
          const topics = [...new Set(ch.questions.map((q) => q.topic))]
          const diff = { easy: 0, medium: 0, hard: 0 }
          ch.questions.forEach((q) => {
            diff[q.difficulty] = (diff[q.difficulty] || 0) + 1
          })
          return (
            <section className="card tile" key={ch.id}>
              <p className="tile-title">{ch.name}</p>

              <div className="tile-stats">
                <div className="stat">
                  <span className="stat-num">{ch.count}</span>
                  <span className="stat-label">questions</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{size}</span>
                  <span className="stat-label">per test</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{topics.length}</span>
                  <span className="stat-label">topics</span>
                </div>
                <div className="stat">
                  <span className="stat-num">
                    {settings.timerEnabled ? settings.durationMinutes : '\u221E'}
                  </span>
                  <span className="stat-label">
                    {settings.timerEnabled ? 'min timer' : 'untimed'}
                  </span>
                </div>
              </div>

              <div className="diff-bar" title={`${diff.easy} easy · ${diff.medium} medium · ${diff.hard} hard`}>
                {diff.easy > 0 && (
                  <span className="diff-seg diff-easy" style={{ flexGrow: diff.easy }} />
                )}
                {diff.medium > 0 && (
                  <span className="diff-seg diff-medium" style={{ flexGrow: diff.medium }} />
                )}
                {diff.hard > 0 && (
                  <span className="diff-seg diff-hard" style={{ flexGrow: diff.hard }} />
                )}
              </div>
              <p className="diff-legend">
                {diff.easy} easy · {diff.medium} medium · {diff.hard} hard
              </p>

              <p className="tile-topics">
                {topics.slice(0, 3).join(' · ')}
                {topics.length > 3 ? ` +${topics.length - 3} more` : ''}
              </p>

              <button
                className="btn btn-primary"
                onClick={() => onSelectPool(ch.id)}
              >
                Start chapter test
              </button>
            </section>
          )
        })}

        <section className="card tile">
          <p className="hero-kicker">Questionnaire</p>
          <p className="tile-title">Chapter 1 full set (pages 6&ndash;15)</p>

          <div className="tile-stats">
            <div className="stat">
              <span className="stat-num">{chapter1Count}</span>
              <span className="stat-label">questions</span>
            </div>
            <div className="stat">
              <span className="stat-num">
                {Math.min(settings.questionsPerTest, chapter1Count)}
              </span>
              <span className="stat-label">per test</span>
            </div>
            <div className="stat">
              <span className="stat-num">2</span>
              <span className="stat-label">chapters</span>
            </div>
            <div className="stat">
              <span className="stat-num">
                {settings.timerEnabled ? settings.durationMinutes : '\u221E'}
              </span>
              <span className="stat-label">
                {settings.timerEnabled ? 'min timer' : 'untimed'}
              </span>
            </div>
          </div>

          <p className="tile-topics">
            Political &amp; Administrative Structure · Historical Study
          </p>

          <button
            className="btn btn-primary"
            onClick={() => onSelectPool('chapter1')}
          >
            Start Chapter 1 set
          </button>
        </section>
      </div>

      <button className="btn btn-ghost" onClick={goSettings}>
        ⚙️ Exam settings
      </button>
    </div>
  )
}
