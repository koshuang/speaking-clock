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
  onToggle: (id: string) => void
  onUpdate: (id: string, text: string, icon?: string) => void
  onRemove: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function TodoList({
  todos,
  nextTodoId,
  onToggle,
  onUpdate,
  onRemove,
  onReorder,
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
              onToggle={onToggle}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
