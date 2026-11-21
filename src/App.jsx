import { useMemo, useState } from 'react'
import HomePage from './pages/HomePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import TestPage from './pages/TestPage.jsx'
import ResultPage from './pages/ResultPage.jsx'
import { loadSettings, shuffle } from './lib/storage.js'
import allQuestions from './data/questions.json'

export default function App() {
  // screen: 'home' | 'settings' | 'test' | 'result'
  const [screen, setScreen] = useState('home')
  const [settings, setSettings] = useState(() => loadSettings())
  // attempt = everything about the test currently being taken or just finished
  const [attempt, setAttempt] = useState(null)

  // Chapter list built automatically from the question bank: every distinct
  // `chapter` value in questions.json gets its own mock-test card.
  const chapters = useMemo(() => {
    const byChapter = new Map()
    for (const q of allQuestions) {
      if (!byChapter.has(q.chapter)) byChapter.set(q.chapter, [])
      byChapter.get(q.chapter).push(q)
    }
    return [...byChapter.keys()].map((name) => {
      const questions = byChapter.get(name)
      return { id: chapterPoolId(name), name, count: questions.length, questions }
    })
  }, [])

  // Special pool: the Chapter 1 questionnaire file (pages 6-15), tagged on
  // each question with set: 'chapter1' when it was loaded.
  const chapter1Pool = useMemo(
    () => allQuestions.filter((q) => q.set === 'chapter1'),
    []
  )

  // Every pool the app can start a test from.
  const pools = useMemo(() => {
    const map = { full: allQuestions, chapter1: chapter1Pool }
    for (const ch of chapters) map[ch.id] = ch.questions
    return map
  }, [chapters, chapter1Pool])

  function startTest(poolKey = 'full') {
    // Pick random questions from the chosen pool (never more than it has).
    const pool = pools[poolKey] || pools.full
    const picked = shuffle(pool).slice(
      0,
      Math.min(settings.questionsPerTest, pool.length)
    )
    setAttempt({
      questions: picked,
      answers: picked.map(() => null), // null = not answered yet
      marked: picked.map(() => false), // marked for review
    })
    setScreen('test')
  }

  function submitTest({ answers, timeTakenSeconds, autoSubmitted }) {
    setAttempt({ ...attempt, answers, timeTakenSeconds, autoSubmitted })
    setScreen('result')
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <HomePage
          settings={settings}
          totalInBank={allQuestions.length}
          chapters={chapters}
          chapter1Count={chapter1Pool.length}
          onStart={startTest}
          onSelectPool={(poolKey) => startTest(poolKey)}
          goSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'settings' && (
        <SettingsPage
          settings={settings}
          onSettingsChange={setSettings}
          goHome={() => setScreen('home')}
        />
      )}
      {screen === 'test' && (
        <TestPage
          settings={settings}
          attempt={attempt}
          onSubmit={submitTest}
          onQuit={() => setScreen('home')}
        />
      )}
      {screen === 'result' && (
        <ResultPage
          settings={settings}
          attempt={attempt}
          goHome={() => setScreen('home')}
          onRetake={() => startTest('full')}
        />
      )}
    </div>
  )
}

// Turn a chapter name into a stable pool id, e.g.
// "Uttarakhand - Historical Study" -> "ch-uttarakhand-historical-study"
function chapterPoolId(name) {
  return (
    'ch-' +
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}
