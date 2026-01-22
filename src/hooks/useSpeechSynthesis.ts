import { useCallback, useEffect, useState } from 'react'

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)

      // 優先選擇台灣繁體中文語音
      const taiwanVoice = availableVoices.find(
        (voice) => voice.lang === 'zh-TW' || voice.lang === 'zh_TW'
      )
      if (taiwanVoice) {
        setSelectedVoice(taiwanVoice)
      } else {
        // 其次選擇任何中文語音
        const chineseVoice = availableVoices.find(
          (voice) => voice.lang.includes('zh') || voice.lang.includes('cmn')
        )
        if (chineseVoice) {
          setSelectedVoice(chineseVoice)
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0])
        }
      }
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) {
        console.error('瀏覽器不支援語音合成')
        return
      }

      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      speechSynthesis.speak(utterance)
    },
    [selectedVoice]
  )

  return { speak, voices, selectedVoice, setSelectedVoice }
}
