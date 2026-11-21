import { useState } from 'react'
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

  // Question pools. Questions tagged with `set: 'chapter1'` belong to the
  // Chapter 1 mock test; History questions are identified by their chapter name.
  const POOLS = {
    full: allQuestions,
    chapter1: allQuestions.filter((q) => q.set === 'chapter1'),
    history: allQuestions.filter((q) => q.chapter === 'Uttarakhand - Historical Study'),
  }

  function startTest(setId = 'full') {
    // Pick random questions from the chosen pool (never more than it has).
    const pool = POOLS[setId] || POOLS.full
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
          chapter1Count={POOLS.chapter1.length}
          historyCount={POOLS.history.length}
          onStart={startTest}
          onStartChapter1={() => startTest('chapter1')}
          onStartHistory={() => startTest('history')}
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
          onRetake={startTest}
        />
      )}
    </div>
  )
}
