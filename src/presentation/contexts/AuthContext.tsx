import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { AuthState } from '../../domain/entities/Auth'
import type { AuthRepository } from '../../domain/ports/AuthRepository'
import { SupabaseAuthRepository } from '../../infrastructure/supabase/SupabaseAuthRepository'
import { isSupabaseConfigured } from '../../infrastructure/supabase/client'
import {
  SupabaseSyncSettingsRepository,
  SupabaseSyncTodoRepository,
  SupabaseSyncStarRewardsRepository,
} from '../../infrastructure/supabase'

interface AuthContextValue extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const authRepository: AuthRepository = new SupabaseAuthRepository()

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    if (!isConfigured) {
      setState({ user: null, isLoading: false, error: null })
      return
    }

    // Get initial user
    authRepository.getCurrentUser().then((user) => {
      setState({ user, isLoading: false, error: null })
    }).catch(() => {
      setState({ user: null, isLoading: false, error: null })
    })

    // Listen for auth changes
    const unsubscribe = authRepository.onAuthStateChange((user) => {
      setState((prev) => ({ ...prev, user, isLoading: false }))
      if (user) {
        console.log('✅ 已登入:', {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          provider: user.provider,
          avatarUrl: user.avatarUrl,
        })
        // Trigger data sync - repositories will sync localStorage to/from cloud
        console.log('🔄 開始同步資料到雲端...')
        new SupabaseSyncSettingsRepository(user.id)
        new SupabaseSyncTodoRepository(user.id)
        new SupabaseSyncStarRewardsRepository(user.id)
        console.log('✅ 資料同步已啟動')
      } else {
        console.log('👋 已登出')
      }
    })

    return unsubscribe
  }, [isConfigured])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const user = await authRepository.signInWithEmail(email, password)
      setState({ user, isLoading: false, error: null })
    } catch (err) {
      const error = err instanceof Error ? err.message : '登入失敗'
      setState((prev) => ({ ...prev, isLoading: false, error }))
      throw err
    }
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const user = await authRepository.signUpWithEmail(email, password)
      setState({ user, isLoading: false, error: null })
    } catch (err) {
      const error = err instanceof Error ? err.message : '註冊失敗'
      setState((prev) => ({ ...prev, isLoading: false, error }))
      throw err
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      await authRepository.signInWithGoogle()
      // OAuth redirects, so we don't update state here
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Google 登入失敗'
      setState((prev) => ({ ...prev, isLoading: false, error }))
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      await authRepository.signOut()
      setState({ user: null, isLoading: false, error: null })
    } catch (err) {
      const error = err instanceof Error ? err.message : '登出失敗'
      setState((prev) => ({ ...prev, isLoading: false, error }))
      throw err
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        isConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
