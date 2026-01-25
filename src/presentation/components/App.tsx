import { useState, useEffect, useCallback, useRef } from 'react'
import { useSpeakingClock, useWakeLock, useTodos, useActiveTask } from '../hooks'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Toggle } from '@/presentation/components/ui/toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { Moon, Sun, Monitor, Download, Volume2, VolumeX, Play, Pause, Check, Timer } from 'lucide-react'
import { TodoForm, TodoList, TodoIcon } from './todo'
import { SettingsPanel } from './settings'
import { BottomNav, type TabId } from './layout'
import { container } from '@/di/container'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('clock')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as 'light' | 'dark' | 'system') || 'system'
  })

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding-completed')
  })

  const completeOnboarding = () => {
    localStorage.setItem('onboarding-completed', 'true')
    setShowOnboarding(false)
  }

  const {
    todos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    reorderTodos,
    nextUncompletedTodo,
    setVoice: setTodoVoice,
    speakReminder,
  } = useTodos()

  // Use refs to store values needed in handleTimeSpoken callback
  const activeTaskDataRef = useRef<{
    activeTodo: typeof activeTodo
    remainingSeconds: number
    isPaused: boolean
    selectedVoiceId: string | null
  }>({ activeTodo: null, remainingSeconds: 0, isPaused: false, selectedVoiceId: null })

  const [isSpeakingReminder, setIsSpeakingReminder] = useState(false)

  const handleTimeSpoken = useCallback(() => {
    const { activeTodo, remainingSeconds, isPaused, selectedVoiceId } = activeTaskDataRef.current
    // If there's an active task running, announce remaining time
    if (activeTodo && activeTodo.durationMinutes && remainingSeconds > 0 && !isPaused) {
      setIsSpeakingReminder(true)
      const remainingMinutes = Math.ceil(remainingSeconds / 60)
      const message = `${activeTodo.text}，還剩 ${remainingMinutes} 分鐘`
      container.speechSynthesizer.speak(message, selectedVoiceId ?? undefined, () => {
        setIsSpeakingReminder(false)
      })
    } else if (nextUncompletedTodo) {
      // Otherwise announce the next uncompleted todo
      setIsSpeakingReminder(true)
      speakReminder(() => setIsSpeakingReminder(false))
    }
  }, [nextUncompletedTodo, speakReminder])

  const {
    currentTime,
    settings,
    updateInterval,
    toggleEnabled,
    speakNow,
    voices,
    voicesLoading,
    selectedVoiceId,
    selectVoice,
    isSpeaking,
  } = useSpeakingClock({ onTimeSpoken: handleTimeSpoken })

  const {
    activeTodo,
    startTask,
    pauseTask,
    resumeTask,
    completeTask,
    remainingSeconds,
    progress,
    isPaused,
  } = useActiveTask(todos, selectedVoiceId)

  // Keep ref in sync with current values
  useEffect(() => {
    activeTaskDataRef.current = { activeTodo, remainingSeconds, isPaused, selectedVoiceId }
  }, [activeTodo, remainingSeconds, isPaused, selectedVoiceId])

  // Sync voice selection between clock and reminder
  const handleVoiceChange = useCallback(
    (voiceId: string) => {
      selectVoice(voiceId)
      setTodoVoice(voiceId)
    },
    [selectVoice, setTodoVoice]
  )

  // Sync todo voice when clock voice is initially set
  useEffect(() => {
    if (selectedVoiceId) {
      setTodoVoice(selectedVoiceId)
    }
  }, [selectedVoiceId, setTodoVoice])

  // Manual complete: finish timer AND mark todo as completed
  const handleManualComplete = useCallback(() => {
    if (activeTodo) {
      toggleTodo(activeTodo.id)
    }
    completeTask()
  }, [activeTodo, toggleTodo, completeTask])

  const {
    isSupported: wakeLockSupported,
    isActive: wakeLockActive,
    request: requestWakeLock,
    release: releaseWakeLock,
  } = useWakeLock()

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (theme === 'system') {
      root.classList.toggle('dark', systemDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  // Capture install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowInstallButton(false)
    }
    setDeferredPrompt(null)
  }

  const toggleWakeLock = async () => {
    if (wakeLockActive) {
      await releaseWakeLock()
    } else {
      await requestWakeLock()
    }
  }

  const formatDisplayTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const getNextAnnouncementTime = (currentTime: Date, interval: number): string => {
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()

    // Find next minute that is divisible by interval
    // If currently at an interval minute and past first 2 seconds, go to next one
    const isAtInterval = minutes % interval === 0
    const isPastTrigger = seconds >= 2

    let nextMinute: number
    if (isAtInterval && !isPastTrigger) {
      // Will trigger soon (within 2 seconds)
      nextMinute = minutes
    } else {
      // Find next interval minute
      nextMinute = (Math.floor(minutes / interval) + 1) * interval
    }

    const next = new Date(currentTime)
    if (nextMinute >= 60) {
      next.setHours(next.getHours() + 1)
      next.setMinutes(nextMinute - 60)
    } else {
      next.setMinutes(nextMinute)
    }
    next.setSeconds(0)

    return next.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  // Count uncompleted todos for badge
  const uncompletedTodoCount = todos.filter((t) => !t.completed).length

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          <div className="flex-1" />
          <h1 className="flex-1 text-center text-xl font-bold text-primary">語音報時器</h1>
          <div className="flex flex-1 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="切換主題">
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5" />
                  ) : theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Monitor className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  淺色
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  深色
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="mr-2 h-4 w-4" />
                  系統
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="mx-auto max-w-md space-y-3 px-3 pt-2">
          {/* Install Prompt */}
          {showInstallButton && (
            <Card className="border-primary/20 bg-primary/10">
              <CardContent className="flex items-center justify-between py-3">
                <span className="text-sm">安裝到主畫面以獲得最佳體驗</span>
                <Button size="sm" onClick={handleInstall}>
                  <Download className="mr-2 h-4 w-4" />
                  安裝
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Clock Display - Always visible */}
          <Card
            className={`cursor-pointer bg-gradient-to-br from-primary to-primary/80 text-primary-foreground transition-shadow hover:shadow-lg active:scale-[0.99] py-2 ${isSpeaking ? 'animate-pulse ring-4 ring-primary/50' : ''}`}
            onClick={speakNow}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                speakNow()
              }
            }}
            aria-label="點擊報時"
          >
            <CardContent className="py-0 text-center">
              <div className="text-[11px] opacity-90">{formatDisplayDate(currentTime)}</div>
              <div className="font-mono text-2xl font-bold tracking-wider">
                {formatDisplayTime(currentTime)}
              </div>
              <div className="text-[10px] opacity-70">
                {settings.enabled
                  ? `下次報時 ${getNextAnnouncementTime(currentTime, settings.interval)}`
                  : '點擊可報時'}
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === 'clock' && (
            <>
              {/* Active Task - Running */}
              {activeTodo && activeTodo.durationMinutes ? (
                <Card className="border-primary bg-primary/5">
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Timer className="h-4 w-4 text-primary shrink-0" />
                        {activeTodo.icon && (
                          <TodoIcon name={activeTodo.icon} size={16} className="text-primary shrink-0" />
                        )}
                        <span className="font-medium truncate">{activeTodo.text}</span>
                      </div>
                      <span className="text-lg font-mono font-bold text-primary tabular-nums shrink-0">
                        {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={isPaused ? resumeTask : pauseTask}
                          className="h-7 w-7"
                        >
                          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleManualComplete}
                          className="h-7 w-7 text-primary"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : nextUncompletedTodo ? (
                /* Next Task - Not Started */
                <Card className="border-primary/50">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {nextUncompletedTodo.icon && (
                          <TodoIcon name={nextUncompletedTodo.icon} size={16} className="text-primary shrink-0" />
                        )}
                        <span className="font-medium truncate">{nextUncompletedTodo.text}</span>
                        {nextUncompletedTodo.durationMinutes && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                            {nextUncompletedTodo.durationMinutes}分
                          </span>
                        )}
                      </div>
                      {nextUncompletedTodo.durationMinutes ? (
                        <Button
                          size="sm"
                          onClick={() => startTask(nextUncompletedTodo.id)}
                          className="h-7 text-xs shrink-0"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          開始
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleTodo(nextUncompletedTodo.id)}
                          className="h-7 text-xs shrink-0"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          完成
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Settings Card */}
              <Card>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.enabled ? (
                        <Volume2 className="h-4 w-4 text-primary" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">自動報時</span>
                    </div>
                    <Toggle
                      pressed={settings.enabled}
                      onPressedChange={toggleEnabled}
                      variant="outline"
                      aria-label={settings.enabled ? '停用報時' : '啟用報時'}
                      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-8 text-xs"
                    >
                      {settings.enabled ? '已啟用' : '已停用'}
                    </Toggle>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center">
                    點擊時鐘可立即報時 · 到「設定」調整間隔和語音
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'todo' && (
            <Card className={isSpeakingReminder ? 'animate-pulse ring-2 ring-primary' : ''}>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">待辦提醒</h2>
                  <p className="text-xs text-muted-foreground">
                    報時後會語音提醒下一個待辦事項
                  </p>
                </div>
                <TodoForm onAdd={addTodo} />
                <TodoList
                  todos={todos}
                  nextTodoId={nextUncompletedTodo?.id ?? null}
                  activeTodoId={activeTodo?.id ?? null}
                  remainingSeconds={remainingSeconds}
                  progress={progress}
                  isPaused={isPaused}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onRemove={removeTodo}
                  onReorder={reorderTodos}
                  onStartTask={startTask}
                  onPauseTask={pauseTask}
                  onResumeTask={resumeTask}
                  onCompleteTask={handleManualComplete}
                />
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardContent>
                <SettingsPanel
                  settings={settings}
                  voices={voices}
                  voicesLoading={voicesLoading}
                  selectedVoiceId={selectedVoiceId}
                  wakeLockSupported={wakeLockSupported}
                  wakeLockActive={wakeLockActive}
                  onToggleEnabled={toggleEnabled}
                  onUpdateInterval={updateInterval}
                  onVoiceChange={handleVoiceChange}
                  onToggleWakeLock={toggleWakeLock}
                  onSpeakNow={speakNow}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} todoCount={uncompletedTodoCount} />

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="space-y-4 py-6">
              <h2 className="text-center text-xl font-bold">歡迎使用語音報時器</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </span>
                  <p>點擊下方「設定」調整報時間隔和語音</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </span>
                  <p>點擊「待辦」新增待辦事項，報時時會自動提醒</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </span>
                  <p>點擊時鐘可隨時立即報時</p>
                </div>
              </div>

              <Button onClick={completeOnboarding} className="w-full">
                開始使用
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
