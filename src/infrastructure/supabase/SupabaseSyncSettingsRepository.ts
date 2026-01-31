import type { ClockSettings } from '../../domain/entities/ClockSettings'
import { DEFAULT_CLOCK_SETTINGS } from '../../domain/entities/ClockSettings'
import type { SettingsRepository } from '../../domain/ports/SettingsRepository'
import { supabase } from './client'

const LOCAL_STORAGE_KEY = 'speaking-clock-settings'

/**
 * Hybrid Settings Repository - localStorage + Supabase sync
 *
 * Strategy:
 * - Read: First from localStorage (fast), then sync from cloud in background
 * - Write: Write to localStorage immediately, then sync to cloud
 * - Offline: Falls back to localStorage only
 */
export class SupabaseSyncSettingsRepository implements SettingsRepository {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    // Trigger initial sync from cloud
    this.syncFromCloud()
  }

  load(): ClockSettings {
    // Always return from localStorage first for fast UI
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_CLOCK_SETTINGS, ...JSON.parse(saved) }
      }
    } catch {
      console.error('無法讀取設定')
    }
    return DEFAULT_CLOCK_SETTINGS
  }

  save(settings: ClockSettings): void {
    // Save to localStorage first for immediate response
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
    } catch {
      console.error('無法儲存設定到本地')
    }

    // Sync to cloud in background
    this.syncToCloud(settings)
  }

  private async syncFromCloud(): Promise<void> {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings, updated_at')
        .eq('user_id', this.userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - upload local data to cloud
          const localSettings = this.load()
          await this.syncToCloud(localSettings)
        }
        return
      }

      if (data?.settings) {
        // Compare timestamps if available, or just use cloud data
        const cloudSettings = data.settings as ClockSettings
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudSettings))
      }
    } catch {
      console.error('無法從雲端同步設定')
    }
  }

  private async syncToCloud(settings: ClockSettings): Promise<void> {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: this.userId,
          settings,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('無法同步設定到雲端:', error.message)
      }
    } catch {
      console.error('無法同步設定到雲端')
    }
  }
}
