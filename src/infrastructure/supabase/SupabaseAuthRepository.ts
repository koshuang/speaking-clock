import type { AuthUser } from '../../domain/entities/Auth'
import type { AuthRepository } from '../../domain/ports/AuthRepository'
import { supabase } from './client'
import type { User, AuthChangeEvent } from '@supabase/supabase-js'

const mapSupabaseUser = (user: User): AuthUser => {
  const provider = user.app_metadata.provider === 'google' ? 'google' : 'email'
  return {
    id: user.id,
    email: user.email ?? '',
    displayName: user.user_metadata.full_name ?? user.user_metadata.name ?? user.email?.split('@')[0],
    avatarUrl: user.user_metadata.avatar_url ?? user.user_metadata.picture,
    provider,
  }
}

export class SupabaseAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!supabase) return null

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return mapSupabaseUser(user)
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('登入失敗')
    }

    return mapSupabaseUser(data.user)
  }

  async signUpWithEmail(email: string, password: string): Promise<AuthUser> {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('註冊失敗')
    }

    return mapSupabaseUser(data.user)
  }

  async signInWithGoogle(): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async signOut(): Promise<void> {
    if (!supabase) return

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (!supabase) {
      return () => {}
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session) => {
        const user = session?.user ? mapSupabaseUser(session.user) : null
        callback(user)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }
}
