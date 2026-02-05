/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { ManageTodosUseCase } from '../../domain/usecases'
import {
  LocalStorageTodoRepository,
  SupabaseSyncTodoRepository,
} from '../../infrastructure'
import { useAuthContext } from './AuthContext'

interface TodoContextValue {
  manageTodosUseCase: ManageTodosUseCase
}

const TodoContext = createContext<TodoContextValue | null>(null)

// Default local-only use case
const localTodoRepository = new LocalStorageTodoRepository()
const localManageTodosUseCase = new ManageTodosUseCase(localTodoRepository)

interface TodoProviderProps {
  children: ReactNode
}

export function TodoProvider({ children }: TodoProviderProps) {
  const { user } = useAuthContext()

  // Create synced use case when authenticated
  const manageTodosUseCase = useMemo(() => {
    if (user) {
      console.log('📦 使用雲端同步 TodoRepository')
      const syncRepository = new SupabaseSyncTodoRepository(user.id)
      return new ManageTodosUseCase(syncRepository)
    }
    console.log('📦 使用本地 TodoRepository')
    return localManageTodosUseCase
  }, [user])

  return (
    <TodoContext.Provider value={{ manageTodosUseCase }}>
      {children}
    </TodoContext.Provider>
  )
}

export function useTodoContext(): TodoContextValue {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider')
  }
  return context
}
