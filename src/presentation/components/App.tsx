import { useState, useEffect, useCallback, useRef } from 'react'
import { useSpeakingClock, useWakeLock, useTodos, useActiveTask } from '../hooks'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Toggle } from '@/presentation/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/presentation/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { Moon, Sun, Monitor, Download, Check, ListTodo } from 'lucide-react'
import type { Voice } from '@/domain/entities/Voice'
import { TodoForm, TodoList } from './todo'
import { container } from '@/di/container'

const INTERVAL_OPTIONS = [1, 5, 10, 15, 30, 60]

const formatVoiceName = (voice: Voice): string => {
  const langMap: Record<string, string> = {
    'zh-TW': '台灣',
    'zh_TW': '台灣',
    'zh-CN': '中國',
    'zh_CN': '中國',
    'zh-HK': '香港',
    'zh_HK': '香港',
  }

  // Clean up name by removing provider prefixes
  let displayName = voice.name
    .replace(/^(Google|Microsoft|Apple)\s+/i, '')
    .replace(/^(Chinese|Mandarin|Cantonese)\s+/i, '')

  // Get friendly language label
  const langLabel = langMap[voice.lang] || voice.lang

  return `${displayName} (${langLabel})`
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function App() {
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
    const nextMinute = Math.ceil(minutes / interval) * interval

    const next = new Date(currentTime)
    if (nextMinute >= 60) {
      next.setHours(next.getHours() + 1)
      next.setMinutes(nextMinute - 60)
    } else if (nextMinute === minutes && minutes % interval === 0) {
      // If we're exactly on an interval minute, show next one
      next.setMinutes(minutes + interval)
      if (next.getMinutes() >= 60) {
        next.setHours(next.getHours() + 1)
        next.setMinutes(next.getMinutes() - 60)
      }
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-4">
          <div className="flex-1" />
          <h1 className="flex-1 text-center text-2xl font-bold text-primary">語音報時器</h1>
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
        </header>

        {/* Install Prompt */}
        {showInstallButton && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="flex items-center justify-between py-3">
              <span className="text-sm">安裝到主畫面以獲得最佳體驗</span>
              <Button size="sm" onClick={handleInstall}>
                <Download className="mr-2 h-4 w-4" />
                安裝
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Clock Display */}
        <Card
          className={`bg-gradient-to-br from-primary to-primary/80 text-primary-foreground cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.99] ${isSpeaking ? 'animate-pulse ring-4 ring-primary/50' : ''}`}
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
          <CardContent className="py-8 text-center">
            <div className="text-sm opacity-90">{formatDisplayDate(currentTime)}</div>
            <div className="mt-2 font-mono text-5xl font-bold tracking-wider">
              {formatDisplayTime(currentTime)}
            </div>
            <div className="mt-2 text-xs opacity-70">點擊可報時</div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardContent className="space-y-6">
            {/* Announcement Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">報時狀態</span>
              <Toggle
                pressed={settings.enabled}
                onPressedChange={toggleEnabled}
                variant="outline"
                aria-label={settings.enabled ? '停用報時' : '啟用報時'}
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {settings.enabled ? '已啟用' : '已停用'}
              </Toggle>
            </div>

            {/* Wake Lock Toggle */}
            {wakeLockSupported && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">螢幕常亮</span>
                  <Toggle
                    pressed={wakeLockActive}
                    onPressedChange={toggleWakeLock}
                    variant="outline"
                    aria-label={wakeLockActive ? '關閉螢幕常亮' : '開啟螢幕常亮'}
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {wakeLockActive ? '已開啟' : '已關閉'}
                  </Toggle>
                </div>
                <p className="text-xs text-muted-foreground">
                  開啟後螢幕不會自動關閉，確保報時正常運作
                </p>
              </div>
            )}

            {/* Interval Selection */}
            <div className="space-y-2">
              <span className="text-sm font-medium">報時間隔</span>
              <ToggleGroup
                type="single"
                value={String(settings.interval)}
                onValueChange={(value) => value && updateInterval(Number(value))}
                variant="outline"
                aria-label="選擇報時間隔"
                className="flex flex-wrap justify-start gap-2"
              >
                {INTERVAL_OPTIONS.map((interval) => (
                  <ToggleGroupItem
                    key={interval}
                    value={String(interval)}
                    aria-label={`每 ${interval} 分鐘報時`}
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-1"
                  >
                    {settings.interval === interval && <Check className="h-4 w-4" />}
                    {interval} 分鐘
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
              <span className="text-sm font-medium">語音選擇</span>
              <Select value={selectedVoiceId || ''} onValueChange={handleVoiceChange} aria-label="選擇語音" disabled={voicesLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={voicesLoading ? "載入語音中..." : "選擇語音"} />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-60">
                  {voices.length === 0 ? (
                    <SelectItem value="none" disabled>
                      {voicesLoading ? "載入中..." : "無可用語音"}
                    </SelectItem>
                  ) : (
                    voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {formatVoiceName(voice)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Speak Now Button */}
            <Button onClick={speakNow} className="w-full" size="lg" aria-label="立即報時">
              立即報時
            </Button>
          </CardContent>
        </Card>

        {/* Todo Section */}
        <Card className={isSpeakingReminder ? 'ring-2 ring-primary animate-pulse' : ''}>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">待辦提醒</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              報時後會語音提醒下一個待辦事項
            </p>
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
              onCompleteTask={completeTask}
            />
          </CardContent>
        </Card>

        {/* Status Footer */}
        <footer className="pb-4 text-center">
          <p className="text-sm text-muted-foreground">
            {settings.enabled
              ? `下次報時：${getNextAnnouncementTime(currentTime, settings.interval)}`
              : '報時已停用'}
          </p>
        </footer>
      </div>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-sm w-full">
            <CardContent className="py-6 space-y-4">
              <h2 className="text-xl font-bold text-center">歡迎使用語音報時器</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <p>點擊「報時狀態」啟用自動報時功能</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <p>選擇報時間隔（如每 15 分鐘）</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <p>選擇喜歡的語音</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                  <p>點擊時鐘或「立即報時」按鈕可隨時報時</p>
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
