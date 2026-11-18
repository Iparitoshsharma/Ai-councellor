import { useState } from 'react'
import BankPage from './pages/BankPage.jsx'
import ImportPage from './pages/ImportPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { loadSettings, loadQuestions } from './lib/storage.js'

// Stage 1 has three screens. More screens (Mocks, Analysis...)
// will be added here in the later stages.
const TABS = [
  { id: 'bank', label: 'Question Bank' },
  { id: 'import', label: 'Import' },
  { id: 'settings', label: 'Settings' },
]

export default function App() {
  // "tab" remembers which screen is open right now.
  const [tab, setTab] = useState('bank')

  // questions = the question bank (loaded from the browser's storage).
  // settings = exam name, duration, marking scheme, etc.
  const [questions, setQuestions] = useState(() => loadQuestions())
  const [settings, setSettings] = useState(() => loadSettings())

  return (
    <div className="app">
      <header className="app-header">
        <h1>{settings.examName}</h1>
        <p className="app-subtitle">Mock Test Practice</p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={'tab' + (tab === t.id ? ' tab-active' : '')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === 'bank' && questions.length > 0 && (
              <span className="tab-count">{questions.length}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="page">
        {tab === 'bank' && (
          <BankPage questions={questions} goToImport={() => setTab('import')} />
        )}
        {tab === 'import' && (
          <ImportPage questions={questions} onQuestionsChange={setQuestions} />
        )}
        {tab === 'settings' && (
          <SettingsPage settings={settings} onSettingsChange={setSettings} />
        )}
      </main>
    </div>
  )
}
