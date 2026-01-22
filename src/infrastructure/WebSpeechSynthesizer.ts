import type { Voice } from '../domain/entities/Voice'
import type { SpeechSynthesizer } from '../domain/ports/SpeechSynthesizer'

export class WebSpeechSynthesizer implements SpeechSynthesizer {
  private voiceMap: Map<string, SpeechSynthesisVoice> = new Map()

  constructor() {
    this.loadVoices()
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.onvoiceschanged = () => this.loadVoices()
    }
  }

  private loadVoices(): void {
    if (typeof speechSynthesis === 'undefined') return

    const voices = speechSynthesis.getVoices()
    this.voiceMap.clear()
    voices.forEach((voice) => {
      this.voiceMap.set(voice.name, voice)
    })
  }

  getVoices(): Voice[] {
    if (typeof speechSynthesis === 'undefined') return []

    const voices = speechSynthesis.getVoices()
    return voices.map((voice) => ({
      id: voice.name,
      name: voice.name,
      lang: voice.lang,
    }))
  }

  speak(text: string, voiceId?: string): void {
    if (typeof speechSynthesis === 'undefined') {
      console.error('瀏覽器不支援語音合成')
      return
    }

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    if (voiceId) {
      const voice = this.voiceMap.get(voiceId)
      if (voice) {
        utterance.voice = voice
      }
    }

    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    speechSynthesis.speak(utterance)
  }

  cancel(): void {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel()
    }
  }
}
