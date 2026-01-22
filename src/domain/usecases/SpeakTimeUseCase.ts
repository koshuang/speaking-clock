import type { SpeechSynthesizer } from '../ports/SpeechSynthesizer'
import { TimeFormatter } from './TimeFormatter'

export class SpeakTimeUseCase {
  private readonly speechSynthesizer: SpeechSynthesizer
  private readonly timeFormatter: TimeFormatter
  private selectedVoiceId: string | undefined

  constructor(speechSynthesizer: SpeechSynthesizer) {
    this.speechSynthesizer = speechSynthesizer
    this.timeFormatter = new TimeFormatter()
  }

  execute(date: Date = new Date(), onEnd?: () => void): void {
    const text = this.timeFormatter.format(date)
    this.speechSynthesizer.speak(text, this.selectedVoiceId, onEnd)
  }

  setVoice(voiceId: string): void {
    this.selectedVoiceId = voiceId
  }

  getVoices() {
    return this.speechSynthesizer.getVoices()
  }
}
