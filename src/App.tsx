import { useSpeakingClock } from './hooks/useSpeakingClock'
import './App.css'

const INTERVAL_OPTIONS = [1, 5, 10, 15, 30, 60]

function App() {
  const {
    currentTime,
    settings,
    updateInterval,
    toggleEnabled,
    speakNow,
    voices,
    selectedVoice,
    setSelectedVoice,
  } = useSpeakingClock()

  const formatDisplayTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>語音報時器</h1>
      </header>

      <main className="main">
        <section className="clock-display">
          <div className="date">{formatDisplayDate(currentTime)}</div>
          <div className="time">{formatDisplayTime(currentTime)}</div>
        </section>

        <section className="controls">
          <div className="control-group">
            <label>報時狀態</label>
            <button
              className={`toggle-btn ${settings.enabled ? 'active' : ''}`}
              onClick={toggleEnabled}
            >
              {settings.enabled ? '已啟用' : '已停用'}
            </button>
          </div>

          <div className="control-group">
            <label>報時間隔</label>
            <div className="interval-options">
              {INTERVAL_OPTIONS.map((interval) => (
                <button
                  key={interval}
                  className={`interval-btn ${settings.interval === interval ? 'selected' : ''}`}
                  onClick={() => updateInterval(interval)}
                >
                  {interval} 分鐘
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>語音選擇</label>
            <select
              className="voice-select"
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find((v) => v.name === e.target.value)
                if (voice) setSelectedVoice(voice)
              }}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <button className="speak-now-btn" onClick={speakNow}>
            立即報時
          </button>
        </section>
      </main>

      <footer className="footer">
        <p>
          {settings.enabled
            ? `每 ${settings.interval} 分鐘報時一次`
            : '報時已停用'}
        </p>
      </footer>
    </div>
  )
}

export default App
