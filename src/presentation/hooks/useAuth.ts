import { useAuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const {
    user,
    isLoading,
    error,
    isConfigured,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  } = useAuthContext()

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isConfigured,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  }
}
