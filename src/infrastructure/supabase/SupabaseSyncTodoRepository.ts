import type { TodoList } from '../../domain/entities/Todo'
import { DEFAULT_TODO_LIST } from '../../domain/entities/Todo'
import type { TodoRepository } from '../../domain/ports/TodoRepository'
import { supabase } from './client'

const LOCAL_STORAGE_KEY = 'speaking-clock-todos'

/**
 * Hybrid Todo Repository - localStorage + Supabase sync
 *
 * Strategy:
 * - Read: First from localStorage (fast), then sync from cloud in background
 * - Write: Write to localStorage immediately, then sync to cloud
 * - Offline: Falls back to localStorage only
 */
export class SupabaseSyncTodoRepository implements TodoRepository {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    // Trigger initial sync from cloud
    this.syncFromCloud()
  }

  load(): TodoList {
    // Always return from localStorage first for fast UI
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_TODO_LIST, ...JSON.parse(saved) }
      }
    } catch {
      console.error('無法讀取待辦清單')
    }
    return DEFAULT_TODO_LIST
  }

  save(todoList: TodoList): void {
    // Save to localStorage first for immediate response
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoList))
    } catch {
      console.error('無法儲存待辦清單到本地')
    }

    // Sync to cloud in background
    this.syncToCloud(todoList)
  }

  private async syncFromCloud(): Promise<void> {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('user_todos')
        .select('todos, updated_at')
        .eq('user_id', this.userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - upload local data to cloud
          const localTodos = this.load()
          await this.syncToCloud(localTodos)
        }
        return
      }

      if (data?.todos) {
        // Compare timestamps if available, or just use cloud data
        const cloudTodos = data.todos as TodoList
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudTodos))
      }
    } catch {
      console.error('無法從雲端同步待辦清單')
    }
  }

  private async syncToCloud(todoList: TodoList): Promise<void> {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('user_todos')
        .upsert({
          user_id: this.userId,
          todos: todoList,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('無法同步待辦清單到雲端:', error.message)
      }
    } catch {
      console.error('無法同步待辦清單到雲端')
    }
  }
}
