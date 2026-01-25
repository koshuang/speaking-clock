import { useState, useRef, useEffect } from 'react'
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
import { Input } from '@/presentation/components/ui/input'
import { Check, X } from 'lucide-react'
import type { Voice } from '@/domain/entities/Voice'
import type { ClockSettings } from '@/domain/entities/ClockSettings'
import { container } from '@/di/container'

const { intervalOptionsUseCase } = container

const formatVoiceName = (voice: Voice): string => {
  const langMap: Record<string, string> = {
    'zh-TW': '台灣',
    'zh_TW': '台灣',
    'zh-CN': '中國',
    'zh_CN': '中國',
    'zh-HK': '香港',
    'zh_HK': '香港',
  }

  const displayName = voice.name
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
  onToggleChildMode: () => void
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
  onToggleChildMode,
}: SettingsPanelProps) {
  const [isCustomInterval, setIsCustomInterval] = useState(false)
  const [customIntervalValue, setCustomIntervalValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if current interval is a preset
  const isPresetInterval = intervalOptionsUseCase.isPreset(settings.interval)

  // Focus input when entering custom mode
  useEffect(() => {
    if (isCustomInterval && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isCustomInterval])

  const handleIntervalChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomInterval(true)
      setCustomIntervalValue(settings.interval.toString())
    } else if (value) {
      onUpdateInterval(Number(value))
      setIsCustomInterval(false)
    }
  }

  const handleCustomConfirm = () => {
    const num = parseInt(customIntervalValue, 10)
    if (intervalOptionsUseCase.isValid(num)) {
      onUpdateInterval(num)
      setIsCustomInterval(false)
    }
  }

  const handleCustomCancel = () => {
    setIsCustomInterval(false)
    setCustomIntervalValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomConfirm()
    } else if (e.key === 'Escape') {
      handleCustomCancel()
    }
  }

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

      {/* Child Mode Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">兒童模式</span>
          <Toggle
            pressed={settings.childMode}
            onPressedChange={onToggleChildMode}
            variant="outline"
            aria-label={settings.childMode ? '關閉兒童模式' : '開啟兒童模式'}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {settings.childMode ? '已開啟' : '已關閉'}
          </Toggle>
        </div>
        <p className="text-xs text-muted-foreground">
          開啟後顯示大按鈕、慢速語音，適合小朋友使用
        </p>
      </div>

      {/* Interval Selection */}
      <div className="space-y-2">
        <span className="text-sm font-medium">報時間隔</span>
        {isCustomInterval ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="number"
              min={intervalOptionsUseCase.getMinInterval()}
              max={intervalOptionsUseCase.getMaxInterval()}
              value={customIntervalValue}
              onChange={(e) => setCustomIntervalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-20"
              placeholder="分鐘"
            />
            <span className="text-sm text-muted-foreground">分鐘</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCustomConfirm}
              disabled={!customIntervalValue || !intervalOptionsUseCase.isValid(parseInt(customIntervalValue, 10))}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCustomCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <ToggleGroup
            type="single"
            value={isPresetInterval ? String(settings.interval) : 'custom'}
            onValueChange={handleIntervalChange}
            variant="outline"
            aria-label="選擇報時間隔"
            className="flex flex-wrap justify-start gap-2"
          >
            {intervalOptionsUseCase.getPresets().map((interval) => (
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
            <ToggleGroupItem
              value="custom"
              aria-label="自訂報時間隔"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-1"
            >
              {!isPresetInterval && <Check className="h-4 w-4" />}
              {!isPresetInterval ? `${settings.interval} 分鐘` : '自訂'}
            </ToggleGroupItem>
          </ToggleGroup>
        )}
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
