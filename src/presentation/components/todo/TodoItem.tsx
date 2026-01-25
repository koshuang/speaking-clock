import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/presentation/components/ui/button'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { Input } from '@/presentation/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { GripVertical, Pencil, Trash2, Check, X, Play, Pause, MoreVertical } from 'lucide-react'
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
      <div className="flex items-center gap-1.5 p-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-0.5 text-muted-foreground hover:text-foreground shrink-0"
          aria-label="拖曳排序"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          aria-label={todo.completed ? '標記為未完成' : '標記為完成'}
          className="shrink-0"
        />

        {isEditing ? (
          <div className="flex flex-1 items-center gap-1 min-w-0">
            <IconPicker value={editIcon} onChange={setEditIcon} size="sm" />
            <Input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-8 min-w-0"
              autoFocus
              aria-label="編輯待辦事項"
            />
            <DurationPicker value={editDuration} onChange={setEditDuration} compact />
            <Button size="icon" variant="ghost" onClick={handleSave} aria-label="儲存" className="h-7 w-7 shrink-0">
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} aria-label="取消" className="h-7 w-7 shrink-0">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <>
            {todo.icon && (
              <span className="w-4 shrink-0 flex justify-center">
                <TodoIcon name={todo.icon} size={16} className="text-primary" />
              </span>
            )}
            <span
              className={`flex-1 text-sm truncate min-w-0 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {todo.text}
            </span>

            {/* Tags and actions */}
            <div className="flex items-center gap-1 shrink-0">
              {!showActiveState && todo.durationMinutes && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {todo.durationMinutes}分
                </span>
              )}
              {isNext && !todo.completed && !showActiveState && (
                <span className="text-[10px] text-primary-foreground bg-primary px-1.5 py-0.5 rounded">
                  下次
                </span>
              )}

              {/* Active task controls */}
              {showActiveState ? (
                <>
                  <span className="text-xs font-medium text-primary tabular-nums">
                    {formatTime(remainingSeconds)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={isPaused ? onResumeTask : onPauseTask}
                    aria-label={isPaused ? '繼續' : '暫停'}
                    className="h-7 w-7"
                  >
                    {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onCompleteTask}
                    aria-label="完成"
                    className="h-7 w-7 text-primary hover:text-primary"
                  >
                    <Check className="h-3.5 w-3.5" />
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
                      className="h-7 w-7"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="更多選項">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        編輯
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onRemove(todo.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        刪除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Progress bar for active task */}
      {showActiveState && (
        <div className="px-2 pb-2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
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
