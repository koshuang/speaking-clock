import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { TodoItem } from './TodoItem'
import type { Todo } from '@/domain/entities/Todo'

interface TodoListProps {
  todos: Todo[]
  nextTodoId: string | null
  activeTodoId?: string | null  // ID of the active task
  remainingSeconds?: number  // Remaining time
  progress?: number  // Progress 0-100
  isPaused?: boolean  // Whether paused
  onToggle: (id: string) => void
  onUpdate: (id: string, text: string, icon?: string, durationMinutes?: number) => void
  onRemove: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onStartTask?: (id: string) => void  // Start task
  onPauseTask?: () => void  // Pause task
  onResumeTask?: () => void  // Resume task
  onCompleteTask?: () => void  // Complete task
}

export function TodoList({
  todos,
  nextTodoId,
  activeTodoId,
  remainingSeconds,
  progress,
  isPaused,
  onToggle,
  onUpdate,
  onRemove,
  onReorder,
  onStartTask,
  onPauseTask,
  onResumeTask,
  onCompleteTask,
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((item) => item.id === active.id)
      const newIndex = todos.findIndex((item) => item.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  if (todos.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        尚無待辦事項
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isNext={todo.id === nextTodoId}
              isActive={todo.id === activeTodoId}
              remainingSeconds={todo.id === activeTodoId ? remainingSeconds : undefined}
              progress={todo.id === activeTodoId ? progress : undefined}
              isPaused={todo.id === activeTodoId ? isPaused : undefined}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onStartTask={onStartTask}
              onPauseTask={onPauseTask}
              onResumeTask={onResumeTask}
              onCompleteTask={onCompleteTask}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
