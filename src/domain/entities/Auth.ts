export interface AuthUser {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  provider: 'email' | 'google'
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
}
