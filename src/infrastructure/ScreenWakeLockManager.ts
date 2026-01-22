import type { WakeLockManager } from '../domain/ports/WakeLockManager'

export class ScreenWakeLockManager implements WakeLockManager {
  private wakeLock: WakeLockSentinel | null = null
  private _isActive = false

  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator
  }

  isActive(): boolean {
    return this._isActive
  }

  async request(): Promise<boolean> {
    if (!this.isSupported()) {
      return false
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen')
      this._isActive = true

      this.wakeLock.addEventListener('release', () => {
        this._isActive = false
      })

      return true
    } catch (err) {
      console.error('Wake Lock 請求失敗:', err)
      return false
    }
  }

  async release(): Promise<void> {
    if (this.wakeLock) {
      await this.wakeLock.release()
      this.wakeLock = null
      this._isActive = false
    }
  }
}
