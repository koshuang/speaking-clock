import { Button } from '@/presentation/components/ui/button'
import { Play, Pause, Check } from 'lucide-react'

interface TaskProgressBarProps {
  todoText: string
  remainingSeconds: number
  progress: number // 0-100
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onComplete: () => void
}

export function TaskProgressBar({
  todoText,
  remainingSeconds,
  progress,
  isPaused,
  onPause,
  onResume,
  onComplete,
}: TaskProgressBarProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          📖
        </span>
        <span className="flex-1 text-sm font-medium">{todoText}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          還剩 {formatTime(remainingSeconds)}
        </span>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={isPaused ? onResume : onPause}
          aria-label={isPaused ? '繼續' : '暫停'}
        >
          {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onComplete}
          aria-label="完成"
        >
          <Check className="size-4" />
        </Button>
      </div>
    </div>
  )
}
