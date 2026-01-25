export interface ChildModeConfig {
  speechRate: number
  fontSize: 'normal' | 'large'
}

export class ChildModeSettingsUseCase {
  private readonly DEFAULT_SPEECH_RATE = 1.0
  private readonly CHILD_MODE_SPEECH_RATE = 0.8

  getConfig(childModeEnabled: boolean): ChildModeConfig {
    return childModeEnabled
      ? { speechRate: this.CHILD_MODE_SPEECH_RATE, fontSize: 'large' }
      : { speechRate: this.DEFAULT_SPEECH_RATE, fontSize: 'normal' }
  }

  getDefaultSpeechRate(): number {
    return this.DEFAULT_SPEECH_RATE
  }

  getChildModeSpeechRate(): number {
    return this.CHILD_MODE_SPEECH_RATE
  }
}
