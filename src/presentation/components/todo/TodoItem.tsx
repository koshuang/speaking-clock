import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/presentation/components/ui/button'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { Input } from '@/presentation/components/ui/input'
import { GripVertical, Pencil, Trash2, Check, X, Play, Pause } from 'lucide-react'
import type { Todo } from '@/domain/entities/Todo'
import { TodoIcon } from './TodoIcon'
import { IconPicker } from './IconPicker'
import { DurationPicker } from './DurationPicker'

interface TodoItemProps {
  todo: Todo
  isNext: boolean
  isActive?: boolean
  remainingSeconds?: number
  progress?: number
  isPaused?: boolean
  onToggle: (id: string) => void
  onUpdate: (id: string, text: string, icon?: string, durationMinutes?: number) => void
  onRemove: (id: string) => void
  onStartTask?: (id: string) => void
  onPauseTask?: () => void
  onResumeTask?: () => void
  onCompleteTask?: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function TodoItem({
  todo,
  isNext,
  isActive,
  remainingSeconds = 0,
  progress = 0,
  isPaused = false,
  onToggle,
  onUpdate,
  onRemove,
  onStartTask,
  onPauseTask,
  onResumeTask,
  onCompleteTask,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editIcon, setEditIcon] = useState<string | undefined>(todo.icon)
  const [editDuration, setEditDuration] = useState<number | undefined>(todo.durationMinutes)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim(), editIcon, editDuration)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setEditIcon(todo.icon)
    setEditDuration(todo.durationMinutes)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const showActiveState = isActive && todo.durationMinutes && onPauseTask && onResumeTask && onCompleteTask

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border ${
        showActiveState
          ? 'border-primary bg-primary/5'
          : isNext
            ? 'border-primary bg-primary/10'
            : 'border-border'
      } ${todo.completed ? 'opacity-60' : ''}`}
    >
      {/* Main row */}
      <div className="flex items-center gap-2 p-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground"
          aria-label="拖曳排序"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          aria-label={todo.completed ? '標記為未完成' : '標記為完成'}
        />

        {isEditing ? (
          <div className="flex flex-1 items-center gap-1">
            <IconPicker value={editIcon} onChange={setEditIcon} size="sm" />
            <Input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-8"
              autoFocus
              aria-label="編輯待辦事項"
            />
            <DurationPicker value={editDuration} onChange={setEditDuration} size="sm" />
            <Button size="icon" variant="ghost" onClick={handleSave} aria-label="儲存">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} aria-label="取消">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <span className="w-[18px] shrink-0 flex justify-center">
              {todo.icon && <TodoIcon name={todo.icon} size={18} className="text-primary" />}
            </span>
            <span
              className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {todo.text}
              {!showActiveState && todo.durationMinutes && (
                <span className="text-xs text-muted-foreground ml-1">{todo.durationMinutes}分鐘</span>
              )}
              {isNext && !todo.completed && !showActiveState && (
                <span className="ml-2 text-xs text-primary">(下次提醒)</span>
              )}
            </span>

            {/* Active task controls */}
            {showActiveState ? (
              <>
                <span className="text-sm font-medium text-primary whitespace-nowrap">
                  {formatTime(remainingSeconds)}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={isPaused ? onResumeTask : onPauseTask}
                  aria-label={isPaused ? '繼續' : '暫停'}
                  className="h-8 w-8"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onCompleteTask}
                  aria-label="完成"
                  className="h-8 w-8 text-primary hover:text-primary"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                {todo.durationMinutes && !todo.completed && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onStartTask?.(todo.id)}
                    aria-label="開始任務"
                    className="h-8 w-8"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  aria-label="編輯"
                  className="h-8 w-8"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onRemove(todo.id)}
                  aria-label="刪除"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {/* Progress bar for active task */}
      {showActiveState && (
        <div className="px-2 pb-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
