import type { Voice } from '../entities/Voice'

export interface SpeechSynthesizer {
  getVoices(): Voice[]
  speak(text: string, voiceId?: string, onEnd?: () => void): void
  cancel(): void
}
