import { SpeakTimeUseCase, ManageSettingsUseCase } from '../domain/usecases'
import {
  WebSpeechSynthesizer,
  LocalStorageSettingsRepository,
  ScreenWakeLockManager,
} from '../infrastructure'

// Infrastructure instances
const speechSynthesizer = new WebSpeechSynthesizer()
const settingsRepository = new LocalStorageSettingsRepository()
const wakeLockManager = new ScreenWakeLockManager()

// Use case instances
const speakTimeUseCase = new SpeakTimeUseCase(speechSynthesizer)
const manageSettingsUseCase = new ManageSettingsUseCase(settingsRepository)

export const container = {
  speechSynthesizer,
  settingsRepository,
  wakeLockManager,
  speakTimeUseCase,
  manageSettingsUseCase,
}
