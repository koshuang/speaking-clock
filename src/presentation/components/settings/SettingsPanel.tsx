import { Toggle } from '@/presentation/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/presentation/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { Button } from '@/presentation/components/ui/button'
import { Check } from 'lucide-react'
import type { Voice } from '@/domain/entities/Voice'
import type { ClockSettings } from '@/domain/entities/ClockSettings'

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

  let displayName = voice.name
    .replace(/^(Google|Microsoft|Apple)\s+/i, '')
    .replace(/^(Chinese|Mandarin|Cantonese)\s+/i, '')

  const langLabel = langMap[voice.lang] || voice.lang

  return `${displayName} (${langLabel})`
}

interface SettingsPanelProps {
  settings: ClockSettings
  voices: Voice[]
  voicesLoading: boolean
  selectedVoiceId: string | null
  wakeLockSupported: boolean
  wakeLockActive: boolean
  onToggleEnabled: () => void
  onUpdateInterval: (interval: number) => void
  onVoiceChange: (voiceId: string) => void
  onToggleWakeLock: () => void
  onSpeakNow: () => void
}

export function SettingsPanel({
  settings,
  voices,
  voicesLoading,
  selectedVoiceId,
  wakeLockSupported,
  wakeLockActive,
  onToggleEnabled,
  onUpdateInterval,
  onVoiceChange,
  onToggleWakeLock,
  onSpeakNow,
}: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Announcement Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">報時狀態</span>
        <Toggle
          pressed={settings.enabled}
          onPressedChange={onToggleEnabled}
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
              onPressedChange={onToggleWakeLock}
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
          onValueChange={(value) => value && onUpdateInterval(Number(value))}
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
        <Select
          value={selectedVoiceId || ''}
          onValueChange={onVoiceChange}
          aria-label="選擇語音"
          disabled={voicesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={voicesLoading ? '載入語音中...' : '選擇語音'} />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-60">
            {voices.length === 0 ? (
              <SelectItem value="none" disabled>
                {voicesLoading ? '載入中...' : '無可用語音'}
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
      <Button onClick={onSpeakNow} className="w-full" size="lg" aria-label="立即報時">
        立即報時
      </Button>
    </div>
  )
}
