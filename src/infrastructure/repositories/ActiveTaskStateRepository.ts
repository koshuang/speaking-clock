import type { ActiveTaskState } from '../../domain/entities/Todo'

const STORAGE_KEY = 'active-task-state'

export interface ActiveTaskStateRepository {
  save(state: ActiveTaskState): void
  load(): ActiveTaskState | null
  clear(): void
}

export class SessionStorageActiveTaskStateRepository
  implements ActiveTaskStateRepository
{
  save(state: ActiveTaskState): void {
    try {
      const serialized = JSON.stringify(state)
      sessionStorage.setItem(STORAGE_KEY, serialized)
    } catch (error) {
      console.error('Failed to save active task state:', error)
    }
  }

  load(): ActiveTaskState | null {
    try {
      const serialized = sessionStorage.getItem(STORAGE_KEY)
      if (!serialized) {
        return null
      }
      return JSON.parse(serialized) as ActiveTaskState
    } catch (error) {
      console.error('Failed to load active task state:', error)
      return null
    }
  }

  clear(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear active task state:', error)
    }
  }
}
