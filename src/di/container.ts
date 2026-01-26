import {
  SpeakTimeUseCase,
  ManageSettingsUseCase,
  ManageTodosUseCase,
  SpeakReminderUseCase,
  TaskDurationUseCase,
  TaskReminderTextGenerator,
  AnnouncementScheduler,
  DisplayTimeFormatter,
  VoiceSelectorUseCase,
  IntervalOptionsUseCase,
  DurationOptionsUseCase,
  PostAnnouncementUseCase,
  TaskTemplateUseCase,
  CompletionFeedbackUseCase,
  ChildModeSettingsUseCase,
  ManageStarRewardsUseCase,
} from '../domain/usecases'
import {
  WebSpeechSynthesizer,
  LocalStorageSettingsRepository,
  LocalStorageTodoRepository,
  ScreenWakeLockManager,
  SoundEffectPlayer,
  LocalStorageStarRewardsRepository,
} from '../infrastructure'
import { SessionStorageActiveTaskStateRepository } from '../infrastructure/repositories/ActiveTaskStateRepository'

// Infrastructure instances
const speechSynthesizer = new WebSpeechSynthesizer()
const settingsRepository = new LocalStorageSettingsRepository()
const todoRepository = new LocalStorageTodoRepository()
const wakeLockManager = new ScreenWakeLockManager()
const activeTaskStateRepository = new SessionStorageActiveTaskStateRepository()
const soundEffectPlayer = new SoundEffectPlayer()
const starRewardsRepository = new LocalStorageStarRewardsRepository()

// Use case instances
const speakTimeUseCase = new SpeakTimeUseCase(speechSynthesizer)
const manageSettingsUseCase = new ManageSettingsUseCase(settingsRepository)
const manageTodosUseCase = new ManageTodosUseCase(todoRepository)
const speakReminderUseCase = new SpeakReminderUseCase(speechSynthesizer)
const taskDurationUseCase = new TaskDurationUseCase()
const taskReminderTextGenerator = new TaskReminderTextGenerator()
const announcementScheduler = new AnnouncementScheduler()
const displayTimeFormatter = new DisplayTimeFormatter()
const voiceSelectorUseCase = new VoiceSelectorUseCase()
const intervalOptionsUseCase = new IntervalOptionsUseCase()
const durationOptionsUseCase = new DurationOptionsUseCase()
const postAnnouncementUseCase = new PostAnnouncementUseCase(taskReminderTextGenerator)
const taskTemplateUseCase = new TaskTemplateUseCase()
const completionFeedbackUseCase = new CompletionFeedbackUseCase()
const childModeSettingsUseCase = new ChildModeSettingsUseCase()
const manageStarRewardsUseCase = new ManageStarRewardsUseCase(starRewardsRepository)

export const container = {
  speechSynthesizer,
  settingsRepository,
  todoRepository,
  wakeLockManager,
  activeTaskStateRepository,
  soundEffectPlayer,
  speakTimeUseCase,
  manageSettingsUseCase,
  manageTodosUseCase,
  speakReminderUseCase,
  taskDurationUseCase,
  taskReminderTextGenerator,
  announcementScheduler,
  displayTimeFormatter,
  voiceSelectorUseCase,
  intervalOptionsUseCase,
  durationOptionsUseCase,
  postAnnouncementUseCase,
  taskTemplateUseCase,
  completionFeedbackUseCase,
  childModeSettingsUseCase,
  starRewardsRepository,
  manageStarRewardsUseCase,
}
