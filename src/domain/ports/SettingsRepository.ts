import type { ClockSettings } from '../entities/ClockSettings'

export interface SettingsRepository {
  load(): ClockSettings
  save(settings: ClockSettings): void
}
