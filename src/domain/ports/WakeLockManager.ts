export interface WakeLockManager {
  isSupported(): boolean
  isActive(): boolean
  request(): Promise<boolean>
  release(): Promise<void>
}
