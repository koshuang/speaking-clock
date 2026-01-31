import type { AuthUser } from '../entities/Auth'

export interface AuthRepository {
  getCurrentUser(): Promise<AuthUser | null>
  signInWithEmail(email: string, password: string): Promise<AuthUser>
  signUpWithEmail(email: string, password: string): Promise<AuthUser>
  signInWithGoogle(): Promise<void>
  signOut(): Promise<void>
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void
}
