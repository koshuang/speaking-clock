import type { ClockSettings } from '../domain/entities/ClockSettings'
import { DEFAULT_CLOCK_SETTINGS } from '../domain/entities/ClockSettings'
import type { SettingsRepository } from '../domain/ports/SettingsRepository'

const STORAGE_KEY = 'speaking-clock-settings'

export class LocalStorageSettingsRepository implements SettingsRepository {
  load(): ClockSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_CLOCK_SETTINGS, ...JSON.parse(saved) }
      }
    } catch {
      console.error('無法讀取設定')
    }
    return DEFAULT_CLOCK_SETTINGS
  }

  save(settings: ClockSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      console.error('無法儲存設定')
    }
  }
}
