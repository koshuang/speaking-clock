import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClockSettings, Voice } from '../../domain'
import { container } from '../../di/container'

export interface UseSpeakingClockOptions {
  onTimeSpoken?: () => void
}

export function useSpeakingClock(options?: UseSpeakingClockOptions) {
  const { speakTimeUseCase, manageSettingsUseCase, speechSynthesizer, voiceSelectorUseCase, announcementScheduler } = container

  const [settings, setSettings] = useState<ClockSettings>(() => manageSettingsUseCase.load())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastSpokenTime, setLastSpokenTime] = useState<Date | null>(null)
  const [voices, setVoices] = useState<Voice[]>([])
  const [voicesLoading, setVoicesLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const timerRef = useRef<number | null>(null)
  const initialVoiceRestoredRef = useRef(false)

  // 載入語音列表
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesizer.getVoices()
      if (availableVoices.length === 0) return

      // 使用 domain use case 排序語音列表
      const sortedVoices = voiceSelectorUseCase.sortVoices(availableVoices)

      // 只在語音列表實際改變時才更新 state
      setVoices((prev) => {
        if (prev.length === sortedVoices.length &&
            prev.every((v, i) => v.id === sortedVoices[i].id)) {
          return prev // 沒變化，返回原陣列避免重新渲染
        }
        return sortedVoices
      })
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
  }, [speechSynthesizer, voiceSelectorUseCase])

  // 語音恢復邏輯（當語音列表載入後執行一次）
  useEffect(() => {
    if (voices.length === 0 || initialVoiceRestoredRef.current) return

    initialVoiceRestoredRef.current = true

    // 使用 domain use case 決定要使用的語音
    const voiceToUse = voiceSelectorUseCase.getVoiceToUse(voices, settings.voiceId)
    if (!voiceToUse) return

    // 如果使用的是已保存的語音，只需設定即可
    if (voiceToUse.id === settings.voiceId) {
      speakTimeUseCase.setVoice(voiceToUse.id)
      return
    }

    // 否則保存新選擇的語音（初始化時自動選擇語音）
    const newSettings = manageSettingsUseCase.updateVoiceId(settings, voiceToUse.id)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(newSettings)
    speakTimeUseCase.setVoice(voiceToUse.id)
  }, [voices, settings.voiceId, speakTimeUseCase, manageSettingsUseCase, settings, voiceSelectorUseCase])

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

      // 使用 domain use case 判斷是否應該報時
      if (announcementScheduler.shouldTriggerAnnouncement(now, settings.interval, lastSpokenTime)) {
        setIsSpeaking(true)
        speakTimeUseCase.execute(now, () => {
          setIsSpeaking(false)
          options?.onTimeSpoken?.()
        })
        setLastSpokenTime(now)
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
  }, [settings.enabled, settings.interval, speakTimeUseCase, lastSpokenTime, options, announcementScheduler])

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
    speakTimeUseCase.execute(new Date(), () => {
      setIsSpeaking(false)
      options?.onTimeSpoken?.()
    })
    setLastSpokenTime(new Date())
  }, [speakTimeUseCase, options])

  const selectVoice = useCallback(
    (voiceId: string) => {
      const newSettings = manageSettingsUseCase.updateVoiceId(settings, voiceId)
      setSettings(newSettings)
      speakTimeUseCase.setVoice(voiceId)
    },
    [manageSettingsUseCase, settings, speakTimeUseCase]
  )

  const toggleChildMode = useCallback(() => {
    const newSettings = { ...settings, childMode: !settings.childMode }
    manageSettingsUseCase.save(newSettings)
    setSettings(newSettings)
  }, [manageSettingsUseCase, settings])

  const updateChildName = useCallback(
    (name: string) => {
      const newSettings = { ...settings, childName: name || undefined }
      manageSettingsUseCase.save(newSettings)
      setSettings(newSettings)
    },
    [manageSettingsUseCase, settings]
  )

  return {
    currentTime,
    settings,
    updateInterval,
    toggleEnabled,
    toggleChildMode,
    updateChildName,
    speakNow,
    voices,
    voicesLoading,
    isSpeaking,
    selectedVoiceId: settings.voiceId ?? null,
    selectVoice,
  }
}
