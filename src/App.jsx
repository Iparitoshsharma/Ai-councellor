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

  function startTest() {
    // Pick random questions from the bank (never more than the bank has).
    const picked = shuffle(allQuestions).slice(
      0,
      Math.min(settings.questionsPerTest, allQuestions.length)
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
          onStart={startTest}
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
