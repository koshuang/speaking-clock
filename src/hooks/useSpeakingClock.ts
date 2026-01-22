import { useCallback, useEffect, useRef, useState } from 'react'
import { useSpeechSynthesis } from './useSpeechSynthesis'

export interface ClockSettings {
  interval: number // 間隔分鐘
  enabled: boolean
}

const DEFAULT_SETTINGS: ClockSettings = {
  interval: 30,
  enabled: false,
}

const STORAGE_KEY = 'speaking-clock-settings'

function loadSettings(): ClockSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch {
    console.error('無法讀取設定')
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: ClockSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    console.error('無法儲存設定')
  }
}

function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()

  let period: string
  if (hours >= 0 && hours < 6) {
    period = '凌晨'
  } else if (hours >= 6 && hours < 12) {
    period = '上午'
  } else if (hours >= 12 && hours < 18) {
    period = '下午'
  } else {
    period = '晚上'
  }

  const displayHours = hours % 12 || 12

  if (minutes === 0) {
    return `現在時間 ${period} ${displayHours} 點整`
  }
  return `現在時間 ${period} ${displayHours} 點 ${minutes} 分`
}

export function useSpeakingClock() {
  const [settings, setSettings] = useState<ClockSettings>(loadSettings)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastSpokenTime, setLastSpokenTime] = useState<Date | null>(null)
  const { speak, voices, selectedVoice, setSelectedVoice } = useSpeechSynthesis()
  const timerRef = useRef<number | null>(null)

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

      // 檢查是否到達報時時間點
      if (minutes % settings.interval === 0) {
        // 避免同一分鐘內重複報時
        if (
          !lastSpokenTime ||
          now.getMinutes() !== lastSpokenTime.getMinutes() ||
          now.getHours() !== lastSpokenTime.getHours()
        ) {
          speak(formatTime(now))
          setLastSpokenTime(now)
        }
      }
    }

    // 立即檢查一次
    checkAndSpeak()

    // 每分鐘檢查
    timerRef.current = setInterval(checkAndSpeak, 60000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [settings.enabled, settings.interval, speak, lastSpokenTime])

  // 儲存設定
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const updateInterval = useCallback((interval: number) => {
    setSettings((prev) => ({ ...prev, interval }))
  }, [])

  const toggleEnabled = useCallback(() => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
  }, [])

  const speakNow = useCallback(() => {
    speak(formatTime(new Date()))
    setLastSpokenTime(new Date())
  }, [speak])

  return {
    currentTime,
    settings,
    updateInterval,
    toggleEnabled,
    speakNow,
    voices,
    selectedVoice,
    setSelectedVoice,
  }
}
