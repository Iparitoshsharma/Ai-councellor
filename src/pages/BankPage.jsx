import { useState, useMemo } from 'react'

// Small reusable dropdown. "options" is a list of { value, label }.
function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

// Small coloured chip for difficulty: green = easy, orange = medium, red = hard.
function DifficultyChip({ difficulty }) {
  const cls =
    difficulty === 'easy' ? 'chip chip-easy' : difficulty === 'medium' ? 'chip chip-medium' : 'chip chip-hard'
  return <span className={cls}>{difficulty}</span>
}

export default function BankPage({ questions, goToImport }) {
  // Filters. "all" means "don't filter on this".
  const [chapter, setChapter] = useState('all')
  const [topic, setTopic] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [type, setType] = useState('all')
  // Which question card is expanded open.
  const [openId, setOpenId] = useState(null)

  // Counts of questions in each chapter, recalculated only when the bank changes.
  const chapterCounts = useMemo(() => {
    const counts = {}
    questions.forEach((q) => {
      counts[q.chapter] = (counts[q.chapter] || 0) + 1
    })
    return counts
  }, [questions])

  // Topic list depends on the chosen chapter (so you can't pick a topic
  // that doesn't belong to the selected chapter).
  const topics = useMemo(() => {
    const set = new Set()
    questions
      .filter((q) => chapter === 'all' || q.chapter === chapter)
      .forEach((q) => set.add(q.topic))
    return [...set].sort()
  }, [questions, chapter])

  const filtered = questions.filter(
    (q) =>
      (chapter === 'all' || q.chapter === chapter) &&
      (topic === 'all' || q.topic === topic) &&
      (difficulty === 'all' || q.difficulty === difficulty) &&
      (type === 'all' || q.type === type)
  )

  // ---- Empty state: no questions imported yet ----
  if (questions.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">Your question bank is empty.</p>
        <p>
          Questions come from a <strong>questions.json</strong> file. Open the{' '}
          <strong>Import</strong> tab to upload one — you can download a sample
          file there to see the format.
        </p>
        <button className="btn btn-primary" onClick={goToImport}>
          Go to Import
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* How many questions are in each chapter */}
      <section className="card">
        <h2 className="card-title">Questions in each chapter</h2>
        <ul className="chapter-list">
          {Object.entries(chapterCounts).map(([ch, count]) => (
            <li key={ch} className="chapter-row">
              <span>{ch}</span>
              <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </section>

      {/* Filters */}
      <section className="card">
        <h2 className="card-title">Filters</h2>
        <div className="filter-grid">
          <FilterSelect
            label="Chapter"
            value={chapter}
            onChange={(v) => {
              setChapter(v)
              setTopic('all') // changing chapter resets the topic filter
            }}
            options={[
              { value: 'all', label: `All chapters (${questions.length})` },
              ...Object.entries(chapterCounts)
                .map(([ch, count]) => ({ value: ch, label: `${ch} (${count})` }))
                .sort((a, b) => a.label.localeCompare(b.label)),
            ]}
          />
          <FilterSelect
            label="Topic"
            value={topic}
            onChange={setTopic}
            options={[
              { value: 'all', label: 'All topics' },
              ...topics.map((t) => ({
                value: t,
                label: `${t} (${questions.filter((q) => q.topic === t && (chapter === 'all' || q.chapter === chapter)).length})`,
              })),
            ]}
          />
          <FilterSelect
            label="Difficulty"
            value={difficulty}
            onChange={setDifficulty}
            options={[
              { value: 'all', label: 'Any difficulty' },
              ...['easy', 'medium', 'hard'].map((d) => ({
                value: d,
                label: `${d[0].toUpperCase()}${d.slice(1)} (${questions.filter((q) => q.difficulty === d).length})`,
              })),
            ]}
          />
          <FilterSelect
            label="Type"
            value={type}
            onChange={setType}
            options={[
              { value: 'all', label: 'Any type' },
              { value: 'direct', label: 'Direct' },
              { value: 'statement', label: 'Statement' },
              { value: 'match', label: 'Match' },
              { value: 'assertion_reason', label: 'Assertion & Reason' },
            ]}
          />
        </div>
        <p className="filter-summary">
          Showing <strong>{filtered.length}</strong> of {questions.length} questions.
        </p>
      </section>

      {/* Question list: tap a question to open it */}
      <section>
        {filtered.length === 0 && (
          <p className="muted">
            No questions match these filters. Try removing some filters.
          </p>
        )}
        {filtered.map((q) => {
          const open = openId === q.id
          return (
            <article key={q.id} className="card question-card">
              <button
                className="question-head"
                onClick={() => setOpenId(open ? null : q.id)}
              >
                <span className="question-text">
                  <strong>{q.id}</strong> — {q.question}
                </span>
                <span className="question-meta">
                  <span className="chip">{q.type.replace('_', ' & ')}</span>
                  <DifficultyChip difficulty={q.difficulty} />
                  <span className="open-arrow">{open ? '▲' : '▼'}</span>
                </span>
              </button>

              {open && (
                <div className="question-body">
                  <p className="muted small">
                    {q.chapter} · {q.topic}
                  </p>
                  <ol className="option-list">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={i === q.correct_option ? 'option correct-option' : 'option'}
                      >
                        {opt}
                        {i === q.correct_option && <span className="correct-tag"> ✔ correct</span>}
                      </li>
                    ))}
                  </ol>
                  {q.explanation && <p className="explanation">{q.explanation}</p>}
                  {q.source_page !== null && (
                    <p className="muted small">Source: page {q.source_page}</p>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}
