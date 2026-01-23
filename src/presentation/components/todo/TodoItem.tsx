import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/presentation/components/ui/button'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { Input } from '@/presentation/components/ui/input'
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react'
import type { Todo } from '@/domain/entities/Todo'
import { TodoIcon } from './TodoIcon'
import { IconPicker } from './IconPicker'

interface TodoItemProps {
  todo: Todo
  isNext: boolean
  onToggle: (id: string) => void
  onUpdate: (id: string, text: string, icon?: string) => void
  onRemove: (id: string) => void
}

export function TodoItem({ todo, isNext, onToggle, onUpdate, onRemove }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editIcon, setEditIcon] = useState<string | undefined>(todo.icon)

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
      onUpdate(todo.id, editText.trim(), editIcon)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setEditIcon(todo.icon)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 rounded-md border ${
        isNext ? 'border-primary bg-primary/10' : 'border-border'
      } ${todo.completed ? 'opacity-60' : ''}`}
    >
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
            {isNext && !todo.completed && (
              <span className="ml-2 text-xs text-primary">(下次提醒)</span>
            )}
          </span>
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
    </div>
  )
}
