import type { Todo } from '../entities/Todo'
import type { SpeechSynthesizer } from '../ports/SpeechSynthesizer'

export class SpeakReminderUseCase {
  private readonly speechSynthesizer: SpeechSynthesizer
  private selectedVoiceId: string | undefined

  constructor(speechSynthesizer: SpeechSynthesizer) {
    this.speechSynthesizer = speechSynthesizer
  }

  execute(todo: Todo, onEnd?: () => void): void {
    const text = `提醒您：${todo.text}`
    this.speechSynthesizer.speak(text, this.selectedVoiceId, onEnd)
  }

  setVoice(voiceId: string): void {
    this.selectedVoiceId = voiceId
  }
}
