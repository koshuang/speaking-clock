import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClockSettings, Voice } from '../../domain'
import { container } from '../../di/container'

export function useSpeakingClock() {
  const { speakTimeUseCase, manageSettingsUseCase, speechSynthesizer } = container

  const [settings, setSettings] = useState<ClockSettings>(() => manageSettingsUseCase.load())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastSpokenTime, setLastSpokenTime] = useState<Date | null>(null)
  const [voices, setVoices] = useState<Voice[]>([])
  const [voicesLoading, setVoicesLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const timerRef = useRef<number | null>(null)
  const initialVoiceRestoredRef = useRef(false)

  // 載入語音列表（只負責載入，不處理選擇邏輯）
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesizer.getVoices()
      if (availableVoices.length === 0) return

      setVoices(availableVoices)
      setVoicesLoading(false)
    }

    loadVoices()
    // 某些瀏覽器需要等待 voiceschanged 事件
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', loadVoices)
    }

    return () => {
      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }
  }, [speechSynthesizer])

  // 語音恢復邏輯（當語音列表載入後執行一次）
  useEffect(() => {
    if (voices.length === 0 || initialVoiceRestoredRef.current) return

    initialVoiceRestoredRef.current = true

    // 如果有已保存的語音 ID，檢查是否仍然可用
    if (settings.voiceId) {
      const savedVoice = voices.find((v) => v.id === settings.voiceId)
      if (savedVoice) {
        speakTimeUseCase.setVoice(savedVoice.id)
        return
      }
    }

    // 沒有已保存的語音或已保存的語音不可用，選擇預設語音
    const taiwanVoice = voices.find(
      (voice) => voice.lang === 'zh-TW' || voice.lang === 'zh_TW'
    )
    const chineseVoice = voices.find(
      (voice) => voice.lang.includes('zh') || voice.lang.includes('cmn')
    )
    const defaultVoice = taiwanVoice || chineseVoice || voices[0]

    // 保存預設語音選擇
    const newSettings = manageSettingsUseCase.updateVoiceId(settings, defaultVoice.id)
    setSettings(newSettings)
    speakTimeUseCase.setVoice(defaultVoice.id)
  }, [voices, settings.voiceId, speakTimeUseCase, manageSettingsUseCase, settings])

  // 更新當前時間（每秒更新顯示）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 報時邏輯
  useEffect(() => {
    if (!settings.enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const checkAndSpeak = () => {
      const now = new Date()
      const seconds = now.getSeconds()
      const minutes = now.getMinutes()

      // Only speak at the start of minutes (within first 2 seconds)
      if (seconds < 2 && minutes % settings.interval === 0) {
        if (
          !lastSpokenTime ||
          now.getMinutes() !== lastSpokenTime.getMinutes() ||
          now.getHours() !== lastSpokenTime.getHours()
        ) {
          setIsSpeaking(true)
          speakTimeUseCase.execute(now, () => setIsSpeaking(false))
          setLastSpokenTime(now)
        }
      }
    }

    // Align timer with system clock: start at next second boundary
    const now = new Date()
    const msUntilNextSecond = 1000 - now.getMilliseconds()

    // Wait until next second boundary, then check every second
    const alignmentTimeout = setTimeout(() => {
      checkAndSpeak()
      timerRef.current = setInterval(checkAndSpeak, 1000)
    }, msUntilNextSecond)

    return () => {
      clearTimeout(alignmentTimeout)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [settings.enabled, settings.interval, speakTimeUseCase, lastSpokenTime])

  const updateInterval = useCallback(
    (interval: number) => {
      const newSettings = manageSettingsUseCase.updateInterval(settings, interval)
      setSettings(newSettings)
    },
    [manageSettingsUseCase, settings]
  )

  const toggleEnabled = useCallback(() => {
    const newSettings = manageSettingsUseCase.toggleEnabled(settings)
    setSettings(newSettings)
  }, [manageSettingsUseCase, settings])

  const speakNow = useCallback(() => {
    setIsSpeaking(true)
    speakTimeUseCase.execute(new Date(), () => setIsSpeaking(false))
    setLastSpokenTime(new Date())
  }, [speakTimeUseCase])

  const selectVoice = useCallback(
    (voiceId: string) => {
      const newSettings = manageSettingsUseCase.updateVoiceId(settings, voiceId)
      setSettings(newSettings)
      speakTimeUseCase.setVoice(voiceId)
    },
    [manageSettingsUseCase, settings, speakTimeUseCase]
  )

  return {
    currentTime,
    settings,
    updateInterval,
    toggleEnabled,
    speakNow,
    voices,
    voicesLoading,
    isSpeaking,
    selectedVoiceId: settings.voiceId ?? null,
    selectVoice,
  }
}
