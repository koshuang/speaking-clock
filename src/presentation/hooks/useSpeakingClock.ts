import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClockSettings, Voice } from '../../domain'
import { container } from '../../di/container'

export function useSpeakingClock() {
  const { speakTimeUseCase, manageSettingsUseCase, speechSynthesizer } = container

  const [settings, setSettings] = useState<ClockSettings>(() => manageSettingsUseCase.load())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastSpokenTime, setLastSpokenTime] = useState<Date | null>(null)
  const [voices, setVoices] = useState<Voice[]>([])
  const timerRef = useRef<number | null>(null)

  // 載入語音列表
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesizer.getVoices()
      if (availableVoices.length === 0) return

      setVoices(availableVoices)

      // 如果有已保存的語音 ID，檢查是否仍然可用
      if (settings.voiceId) {
        const savedVoice = availableVoices.find((v) => v.id === settings.voiceId)
        if (savedVoice) {
          speakTimeUseCase.setVoice(savedVoice.id)
          return
        }
      }

      // 沒有已保存的語音或已保存的語音不可用，選擇預設語音
      const taiwanVoice = availableVoices.find(
        (voice) => voice.lang === 'zh-TW' || voice.lang === 'zh_TW'
      )
      const chineseVoice = availableVoices.find(
        (voice) => voice.lang.includes('zh') || voice.lang.includes('cmn')
      )
      const defaultVoice = taiwanVoice || chineseVoice || availableVoices[0]

      // 保存預設語音選擇
      const newSettings = manageSettingsUseCase.updateVoiceId(settings, defaultVoice.id)
      setSettings(newSettings)
      speakTimeUseCase.setVoice(defaultVoice.id)
    }

    loadVoices()
    // 某些瀏覽器需要等待 voiceschanged 事件
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [speechSynthesizer, speakTimeUseCase, manageSettingsUseCase, settings.voiceId])

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
      const minutes = now.getMinutes()

      if (minutes % settings.interval === 0) {
        if (
          !lastSpokenTime ||
          now.getMinutes() !== lastSpokenTime.getMinutes() ||
          now.getHours() !== lastSpokenTime.getHours()
        ) {
          speakTimeUseCase.execute(now)
          setLastSpokenTime(now)
        }
      }
    }

    checkAndSpeak()
    timerRef.current = setInterval(checkAndSpeak, 60000)

    return () => {
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
    speakTimeUseCase.execute(new Date())
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
    selectedVoiceId: settings.voiceId ?? null,
    selectVoice,
  }
}
