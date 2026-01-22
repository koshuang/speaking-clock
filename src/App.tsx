import { useSpeakingClock } from './hooks/useSpeakingClock'
import { useWakeLock } from './hooks/useWakeLock'
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

  const { isSupported: wakeLockSupported, isActive: wakeLockActive, request: requestWakeLock, release: releaseWakeLock } = useWakeLock()

  const toggleWakeLock = async () => {
    if (wakeLockActive) {
      await releaseWakeLock()
    } else {
      await requestWakeLock()
    }
  }

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

          {wakeLockSupported && (
            <div className="control-group">
              <label>螢幕常亮</label>
              <button
                className={`toggle-btn ${wakeLockActive ? 'active' : ''}`}
                onClick={toggleWakeLock}
              >
                {wakeLockActive ? '已開啟' : '已關閉'}
              </button>
              <p className="hint">開啟後螢幕不會自動關閉，確保報時正常運作</p>
            </div>
          )}

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
