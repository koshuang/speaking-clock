import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from './client'

export type SyncTable = 'user_todos' | 'user_star_rewards' | 'user_ultimate_goals' | 'user_settings'

export interface RealtimeChangeEvent<T = unknown> {
  table: SyncTable
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  newData: T | null
  oldData: T | null
}

type ChangeCallback = (event: RealtimeChangeEvent) => void

/**
 * Realtime Sync Service - Supabase 即時同步服務
 *
 * 監聽資料庫變更，當其他裝置修改資料時即時通知
 */
export class RealtimeSyncService {
  private channel: RealtimeChannel | null = null
  private userId: string | null = null
  private callbacks: Map<SyncTable, Set<ChangeCallback>> = new Map()
  private isSubscribed = false

  /**
   * 開始監聽指定用戶的資料變更
   */
  subscribe(userId: string): void {
    if (!supabase) {
      console.warn('Supabase not configured, realtime sync disabled')
      return
    }

    if (this.isSubscribed && this.userId === userId) {
      return // Already subscribed for this user
    }

    // Unsubscribe from previous user if any
    this.unsubscribe()

    this.userId = userId

    // Create a channel for this user's data
    this.channel = supabase
      .channel(`user_data_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_todos',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => this.handleChange('user_todos', payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_star_rewards',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => this.handleChange('user_star_rewards', payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_ultimate_goals',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => this.handleChange('user_ultimate_goals', payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_settings',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => this.handleChange('user_settings', payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.isSubscribed = true
          console.log('Realtime sync connected')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Realtime sync error')
          this.isSubscribed = false
        }
      })
  }

  /**
   * 停止監聽
   */
  unsubscribe(): void {
    if (this.channel) {
      this.channel.unsubscribe()
      this.channel = null
    }
    this.isSubscribed = false
    this.userId = null
  }

  /**
   * 註冊資料變更回調
   */
  onDataChange(table: SyncTable, callback: ChangeCallback): () => void {
    if (!this.callbacks.has(table)) {
      this.callbacks.set(table, new Set())
    }
    this.callbacks.get(table)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.callbacks.get(table)?.delete(callback)
    }
  }

  /**
   * 處理資料變更事件
   */
  private handleChange(table: SyncTable, payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE'
    new: Record<string, unknown>
    old: Record<string, unknown>
  }): void {
    const event: RealtimeChangeEvent = {
      table,
      eventType: payload.eventType,
      newData: payload.new,
      oldData: payload.old,
    }

    // Notify all callbacks for this table
    const callbacks = this.callbacks.get(table)
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(event)
        } catch (error) {
          console.error('Error in realtime callback:', error)
        }
      })
    }
  }

  /**
   * 檢查是否已連線
   */
  get connected(): boolean {
    return this.isSubscribed
  }
}

// Singleton instance
export const realtimeSyncService = new RealtimeSyncService()
