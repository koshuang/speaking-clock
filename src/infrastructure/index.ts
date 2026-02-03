export { WebSpeechSynthesizer } from './WebSpeechSynthesizer'
export { LocalStorageSettingsRepository } from './LocalStorageSettingsRepository'
export { LocalStorageTodoRepository } from './LocalStorageTodoRepository'
export { ScreenWakeLockManager } from './ScreenWakeLockManager'
export { SessionStorageActiveTaskStateRepository } from './repositories/ActiveTaskStateRepository'
export type { ActiveTaskStateRepository } from './repositories/ActiveTaskStateRepository'
export { SoundEffectPlayer } from './SoundEffectPlayer'
export { LocalStorageStarRewardsRepository } from './LocalStorageStarRewardsRepository'
export { LocalStorageUltimateGoalRepository } from './repositories/UltimateGoalRepository'
export {
  supabase,
  isSupabaseConfigured,
  SupabaseAuthRepository,
  SupabaseSyncSettingsRepository,
  SupabaseSyncTodoRepository,
  SupabaseSyncStarRewardsRepository,
  SupabaseSyncUltimateGoalRepository,
} from './supabase'
