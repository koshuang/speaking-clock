import { useCallback, useState } from 'react'
import type { Todo, TodoList } from '../../domain'
import { container } from '../../di/container'

export function useTodos() {
  const { manageTodosUseCase, speakReminderUseCase } = container

  const [todoList, setTodoList] = useState<TodoList>(() => manageTodosUseCase.load())

  /**
   * 從外部設定 todos（用於即時同步）
   * 直接取代本地狀態，不觸發儲存（因為資料來自雲端）
   */
  const setTodosFromExternal = useCallback((todos: Todo[]) => {
    setTodoList({ items: todos })
  }, [])

  const addTodo = useCallback(
    (text: string, icon?: string, durationMinutes?: number) => {
      if (!text.trim()) return
      const updated = manageTodosUseCase.add(todoList, text, icon, durationMinutes)
      setTodoList(updated)
    },
    [manageTodosUseCase, todoList]
  )

  const updateTodo = useCallback(
    (id: string, text: string, icon?: string, durationMinutes?: number) => {
      if (!text.trim()) return
      const updated = manageTodosUseCase.update(todoList, id, text, icon, durationMinutes)
      setTodoList(updated)
    },
    [manageTodosUseCase, todoList]
  )

  const removeTodo = useCallback(
    (id: string) => {
      const updated = manageTodosUseCase.remove(todoList, id)
      setTodoList(updated)
    },
    [manageTodosUseCase, todoList]
  )

  const toggleTodo = useCallback(
    (id: string) => {
      const updated = manageTodosUseCase.toggle(todoList, id)
      setTodoList(updated)
    },
    [manageTodosUseCase, todoList]
  )

  const reorderTodos = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updated = manageTodosUseCase.reorder(todoList, fromIndex, toIndex)
      setTodoList(updated)
    },
    [manageTodosUseCase, todoList]
  )

  const setVoice = useCallback(
    (voiceId: string) => {
      speakReminderUseCase.setVoice(voiceId)
    },
    [speakReminderUseCase]
  )

  const speakReminder = useCallback(
    (onEnd?: () => void, options?: { childName?: string; rate?: number }) => {
      const nextTodo = manageTodosUseCase.getNextUncompleted(todoList)
      if (nextTodo) {
        speakReminderUseCase.execute(nextTodo, onEnd, options)
      } else {
        onEnd?.()
      }
    },
    [manageTodosUseCase, speakReminderUseCase, todoList]
  )

  const sortedTodos = manageTodosUseCase.getSortedItems(todoList)
  const nextUncompletedTodo = manageTodosUseCase.getNextUncompleted(todoList)

  return {
    todos: sortedTodos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    reorderTodos,
    nextUncompletedTodo,
    setVoice,
    speakReminder,
    setTodosFromExternal,
  }
}
