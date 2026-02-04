import { useState, useEffect, useCallback, useRef } from 'react'
import type { Todo, ActiveTaskState } from '@/domain/entities/Todo'
import { container } from '@/di/container'
import { TaskDurationUseCase } from '@/domain/usecases/TaskDurationUseCase'
import { TaskReminderTextGenerator } from '@/domain/usecases/TaskReminderTextGenerator'
import { SessionStorageActiveTaskStateRepository } from '@/infrastructure/repositories/ActiveTaskStateRepository'

const taskDurationUseCase = new TaskDurationUseCase()
const taskReminderTextGenerator = new TaskReminderTextGenerator()
const activeTaskRepo = new SessionStorageActiveTaskStateRepository()

export interface UseActiveTaskReturn {
  activeTask: ActiveTaskState | null
  activeTodo: Todo | null
  startTask: (todoId: string) => void
  pauseTask: () => void
  resumeTask: () => void
  completeTask: () => void
  remainingSeconds: number
  progress: number
  isPaused: boolean
}

export function useActiveTask(todos: Todo[], voiceId?: string | null): UseActiveTaskReturn {
  // Load active task state from sessionStorage on initial render
  const [activeTask, setActiveTask] = useState<ActiveTaskState | null>(() => activeTaskRepo.load())
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Use refs to avoid stale closures in timer callback
  const activeTaskRef = useRef<ActiveTaskState | null>(null)
  const todosRef = useRef<Todo[]>(todos)
  const voiceIdRef = useRef<string | null | undefined>(voiceId)

  // Keep refs in sync
  useEffect(() => {
    activeTaskRef.current = activeTask
  }, [activeTask])

  useEffect(() => {
    todosRef.current = todos
  }, [todos])

  useEffect(() => {
    voiceIdRef.current = voiceId
  }, [voiceId])

  // Find the active todo
  const activeTodo = activeTask
    ? todos.find((todo) => todo.id === activeTask.todoId) || null
    : null

  const isPaused = activeTask?.status === 'paused'

  // Start a task timer
  const startTask = useCallback(
    (todoId: string) => {
      const todo = todos.find((t) => t.id === todoId)
      if (!todo || !todo.durationMinutes) {
        console.error('Cannot start task: todo not found or no duration set')
        return
      }

      const newState: ActiveTaskState = {
        todoId,
        status: 'active',
        startedAt: Date.now(),
        accumulatedTime: 0,
      }

      setActiveTask(newState)
      activeTaskRepo.save(newState)

      // Announce start
      const timePrefix = taskReminderTextGenerator.generateTimePrefix()
      const startText = taskReminderTextGenerator.generateStartText(
        todo.text,
        todo.durationMinutes
      )
      container.speechSynthesizer.speak(`${timePrefix}，${startText}`, voiceIdRef.current ?? undefined)
    },
    [todos]
  )

  // Pause the task
  const pauseTask = useCallback(() => {
    setActiveTask((prev) => {
      if (!prev) return prev
      const elapsedTime = taskDurationUseCase.getElapsedTime(prev)
      const updatedState: ActiveTaskState = {
        ...prev,
        status: 'paused',
        accumulatedTime: elapsedTime,
        startedAt: Date.now(),
      }
      activeTaskRepo.save(updatedState)
      return updatedState
    })
  }, [])

  // Resume the task
  const resumeTask = useCallback(() => {
    setActiveTask((prev) => {
      if (!prev) return prev
      const updatedState: ActiveTaskState = {
        ...prev,
        status: 'active',
        startedAt: Date.now(),
      }
      activeTaskRepo.save(updatedState)
      return updatedState
    })
  }, [])

  // Complete the task
  const completeTask = useCallback(() => {
    const currentTask = activeTaskRef.current
    const currentTodos = todosRef.current

    if (!currentTask) return

    const currentTodo = currentTodos.find((t) => t.id === currentTask.todoId)
    if (!currentTodo) return

    // Announce complete
    const completeText = taskReminderTextGenerator.generateCompleteText(currentTodo.text)
    container.speechSynthesizer.speak(completeText, voiceIdRef.current ?? undefined)

    // Clear state
    setActiveTask(null)
    activeTaskRepo.clear()

    // Find next uncompleted todo with duration
    const nextTodo = currentTodos.find(
      (todo) => !todo.completed && todo.durationMinutes && todo.id !== currentTodo.id
    )

    if (nextTodo && nextTodo.durationMinutes) {
      // Delay next task announcement slightly
      setTimeout(() => {
        const nextTaskText = taskReminderTextGenerator.generateNextTaskText(
          nextTodo.text,
          nextTodo.durationMinutes!
        )
        container.speechSynthesizer.speak(nextTaskText, voiceIdRef.current ?? undefined)
      }, 1000)
    }
  }, [])

  // Timer effect - separate from state updates
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (!activeTask || !activeTodo || !activeTodo.durationMinutes) {
      // Reset state when no active task - this is intentional initialization
      setRemainingSeconds(0)
      setProgress(0)
      return
    }

    const durationMinutes = activeTodo.durationMinutes

    // Update remaining time and progress
    const updateProgress = () => {
      const currentTask = activeTaskRef.current
      if (!currentTask) return

      const remaining = taskDurationUseCase.getRemainingTime(
        currentTask,
        durationMinutes
      )
      const currentProgress = taskDurationUseCase.getProgress(
        currentTask,
        durationMinutes
      )

      setRemainingSeconds(Math.ceil(remaining / 1000))
      setProgress(currentProgress)

      // Check for checkpoints to announce (only when active)
      if (currentTask.status === 'active') {
        const nextCheckpoint = taskDurationUseCase.getNextCheckpoint(
          currentTask,
          durationMinutes
        )

        if (
          nextCheckpoint &&
          taskDurationUseCase.shouldAnnounceCheckpoint(
            nextCheckpoint,
            currentTask,
            durationMinutes
          )
        ) {
          let message = ''
          const remainingMinutes = Math.ceil(remaining / 1000 / 60)

          if (nextCheckpoint.type === 'progress') {
            const currentTodo = todosRef.current.find(
              (t) => t.id === currentTask.todoId
            )
            if (currentTodo) {
              message = taskReminderTextGenerator.generateProgressText(
                currentTodo.text,
                remainingMinutes
              )
            }
          } else if (nextCheckpoint.type === 'warning') {
            const currentTodo = todosRef.current.find(
              (t) => t.id === currentTask.todoId
            )
            if (currentTodo) {
              message = taskReminderTextGenerator.generateWarningText(
                currentTodo.text,
                remainingMinutes
              )
            }
          }

          if (message) {
            container.speechSynthesizer.speak(message, voiceIdRef.current ?? undefined)

            // Update last announced checkpoint using functional update
            setActiveTask((prev) => {
              if (!prev) return prev
              const updatedState: ActiveTaskState = {
                ...prev,
                lastAnnouncedCheckpoint: nextCheckpoint.id,
              }
              activeTaskRepo.save(updatedState)
              return updatedState
            })
          }
        }

        // When time reaches 0, announce but don't auto-complete
        // User needs to manually click complete button
        if (taskDurationUseCase.isTaskComplete(currentTask, durationMinutes)) {
          const currentTodo = todosRef.current.find(
            (t) => t.id === currentTask.todoId
          )
          if (currentTodo && !currentTask.timeUpAnnounced) {
            container.speechSynthesizer.speak(
              `${currentTodo.text}，時間到了`,
              voiceIdRef.current ?? undefined
            )
            // Mark as announced to prevent repeated announcements
            setActiveTask((prev) => {
              if (!prev) return prev
              const updatedState: ActiveTaskState = {
                ...prev,
                timeUpAnnounced: true,
              }
              activeTaskRepo.save(updatedState)
              return updatedState
            })
          }
        }
      }
    }

    // Initial update
    updateProgress()

    // Run timer every 1 second when active
    if (activeTask.status === 'active') {
      timerRef.current = setInterval(updateProgress, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTask?.todoId, activeTask?.status, activeTodo?.durationMinutes, completeTask])

  return {
    activeTask,
    activeTodo,
    startTask,
    pauseTask,
    resumeTask,
    completeTask,
    remainingSeconds,
    progress,
    isPaused,
  }
}
