import { useSpeakingClock, useWakeLock } from '../hooks'
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

const INTERVAL_OPTIONS = [1, 5, 10, 15, 30, 60]

export function App() {
  const {
    currentTime,
    settings,
    updateInterval,
    toggleEnabled,
    speakNow,
    voices,
    selectedVoiceId,
    selectVoice,
  } = useSpeakingClock()

  const {
    isSupported: wakeLockSupported,
    isActive: wakeLockActive,
    request: requestWakeLock,
    release: releaseWakeLock,
  } = useWakeLock()

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <header className="pt-4 text-center">
          <h1 className="text-2xl font-bold text-primary">語音報時器</h1>
        </header>

        {/* Clock Display */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="py-8 text-center">
            <div className="text-sm opacity-90">{formatDisplayDate(currentTime)}</div>
            <div className="mt-2 font-mono text-5xl font-bold tracking-wider">
              {formatDisplayTime(currentTime)}
            </div>
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
                className="flex flex-wrap justify-start gap-2"
              >
                {INTERVAL_OPTIONS.map((interval) => (
                  <ToggleGroupItem
                    key={interval}
                    value={String(interval)}
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {interval} 分鐘
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
              <span className="text-sm font-medium">語音選擇</span>
              <Select value={selectedVoiceId || ''} onValueChange={selectVoice}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選擇語音" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speak Now Button */}
            <Button onClick={speakNow} className="w-full" size="lg">
              立即報時
            </Button>
          </CardContent>
        </Card>

        {/* Status Footer */}
        <footer className="pb-4 text-center">
          <p className="text-sm text-muted-foreground">
            {settings.enabled
              ? `每 ${settings.interval} 分鐘報時一次`
              : '報時已停用'}
          </p>
        </footer>
      </div>
    </div>
  )
}
