import type { Todo } from '../entities/Todo'
import type { SpeechSynthesizer } from '../ports/SpeechSynthesizer'

export interface SpeakReminderOptions {
  childName?: string
  rate?: number
}

export class SpeakReminderUseCase {
  private readonly speechSynthesizer: SpeechSynthesizer
  private selectedVoiceId: string | undefined

  constructor(speechSynthesizer: SpeechSynthesizer) {
    this.speechSynthesizer = speechSynthesizer
  }

  execute(todo: Todo, onEnd?: () => void, options?: SpeakReminderOptions): void {
    const prefix = options?.childName ? `${options.childName}，` : ''
    const text = `${prefix}提醒您：${todo.text}`
    this.speechSynthesizer.speak(text, this.selectedVoiceId, onEnd, options?.rate)
  }

  setVoice(voiceId: string): void {
    this.selectedVoiceId = voiceId
  }
}
