import { useCallback, useState } from 'react'
import type { TodoList } from '../../domain'
import { container } from '../../di/container'

export function useTodos() {
  const { manageTodosUseCase, speakReminderUseCase } = container

  const [todoList, setTodoList] = useState<TodoList>(() => manageTodosUseCase.load())

  const addTodo = useCallback(
    (text: string, icon?: string) => {
      if (!text.trim()) return
      const updated = manageTodosUseCase.add(todoList, text, icon)
      setTodoList(updated)
    },
    [manageTodosUseCase, todoList]
  )

  const updateTodo = useCallback(
    (id: string, text: string, icon?: string) => {
      if (!text.trim()) return
      const updated = manageTodosUseCase.update(todoList, id, text, icon)
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
    (onEnd?: () => void) => {
      const nextTodo = manageTodosUseCase.getNextUncompleted(todoList)
      if (nextTodo) {
        speakReminderUseCase.execute(nextTodo, onEnd)
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
  }
}
