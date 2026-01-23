import {
  SpeakTimeUseCase,
  ManageSettingsUseCase,
  ManageTodosUseCase,
  SpeakReminderUseCase,
} from '../domain/usecases'
import {
  WebSpeechSynthesizer,
  LocalStorageSettingsRepository,
  LocalStorageTodoRepository,
  ScreenWakeLockManager,
} from '../infrastructure'

// Infrastructure instances
const speechSynthesizer = new WebSpeechSynthesizer()
const settingsRepository = new LocalStorageSettingsRepository()
const todoRepository = new LocalStorageTodoRepository()
const wakeLockManager = new ScreenWakeLockManager()

// Use case instances
const speakTimeUseCase = new SpeakTimeUseCase(speechSynthesizer)
const manageSettingsUseCase = new ManageSettingsUseCase(settingsRepository)
const manageTodosUseCase = new ManageTodosUseCase(todoRepository)
const speakReminderUseCase = new SpeakReminderUseCase(speechSynthesizer)

export const container = {
  speechSynthesizer,
  settingsRepository,
  todoRepository,
  wakeLockManager,
  speakTimeUseCase,
  manageSettingsUseCase,
  manageTodosUseCase,
  speakReminderUseCase,
}
