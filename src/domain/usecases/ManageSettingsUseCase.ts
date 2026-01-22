import type { ClockSettings } from '../entities/ClockSettings'
import type { SettingsRepository } from '../ports/SettingsRepository'

export class ManageSettingsUseCase {
  private readonly repository: SettingsRepository

  constructor(repository: SettingsRepository) {
    this.repository = repository
  }

  load(): ClockSettings {
    return this.repository.load()
  }

  save(settings: ClockSettings): void {
    this.repository.save(settings)
  }

  updateInterval(currentSettings: ClockSettings, interval: number): ClockSettings {
    const newSettings = { ...currentSettings, interval }
    this.save(newSettings)
    return newSettings
  }

  toggleEnabled(currentSettings: ClockSettings): ClockSettings {
    const newSettings = { ...currentSettings, enabled: !currentSettings.enabled }
    this.save(newSettings)
    return newSettings
  }

  updateVoiceId(currentSettings: ClockSettings, voiceId: string): ClockSettings {
    const newSettings = { ...currentSettings, voiceId }
    this.save(newSettings)
    return newSettings
  }
}
