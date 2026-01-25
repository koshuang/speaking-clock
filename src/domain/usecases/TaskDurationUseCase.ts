import type { ActiveTaskState } from '../entities/Todo'

export interface TaskCheckpoint {
  id: string
  timeRemaining: number
  type: 'start' | 'progress' | 'warning' | 'complete'
}

export class TaskDurationUseCase {
  /**
   * Calculate reminder checkpoints based on task duration
   * - ≤10 min: start, 2min warning, complete
   * - 11-30 min: start, 50% progress, 5min warning, complete
   * - >30 min: start, 50% progress, 10min warning, 5min warning, complete
   */
  calculateCheckpoints(durationMinutes: number): TaskCheckpoint[] {
    const checkpoints: TaskCheckpoint[] = [
      {
        id: 'start',
        timeRemaining: durationMinutes,
        type: 'start',
      },
      {
        id: 'complete',
        timeRemaining: 0,
        type: 'complete',
      },
    ]

    if (durationMinutes <= 10) {
      // Short tasks: 2min warning
      checkpoints.splice(1, 0, {
        id: '2min',
        timeRemaining: 2,
        type: 'warning',
      })
    } else if (durationMinutes <= 30) {
      // Medium tasks: 50% progress, 5min warning
      checkpoints.splice(1, 0, {
        id: '50%',
        timeRemaining: durationMinutes / 2,
        type: 'progress',
      })
      checkpoints.splice(2, 0, {
        id: '5min',
        timeRemaining: 5,
        type: 'warning',
      })
    } else {
      // Long tasks: 50% progress, 10min warning, 5min warning
      checkpoints.splice(1, 0, {
        id: '50%',
        timeRemaining: durationMinutes / 2,
        type: 'progress',
      })
      checkpoints.splice(2, 0, {
        id: '10min',
        timeRemaining: 10,
        type: 'warning',
      })
      checkpoints.splice(3, 0, {
        id: '5min',
        timeRemaining: 5,
        type: 'warning',
      })
    }

    return checkpoints
  }

  /**
   * Get elapsed time in milliseconds accounting for pauses
   */
  getElapsedTime(state: ActiveTaskState): number {
    if (state.status === 'paused') {
      return state.accumulatedTime
    }
    const now = Date.now()
    return state.accumulatedTime + (now - state.startedAt)
  }

  /**
   * Get remaining time in milliseconds
   */
  getRemainingTime(state: ActiveTaskState, durationMinutes: number): number {
    const elapsedMs = this.getElapsedTime(state)
    const totalMs = durationMinutes * 60 * 1000
    return Math.max(0, totalMs - elapsedMs)
  }

  /**
   * Get progress as percentage (0-100)
   */
  getProgress(state: ActiveTaskState, durationMinutes: number): number {
    const elapsedMs = this.getElapsedTime(state)
    const totalMs = durationMinutes * 60 * 1000
    return Math.min(100, (elapsedMs / totalMs) * 100)
  }

  /**
   * Get the next checkpoint to announce based on lastAnnouncedCheckpoint
   */
  getNextCheckpoint(
    state: ActiveTaskState,
    durationMinutes: number
  ): TaskCheckpoint | null {
    const checkpoints = this.calculateCheckpoints(durationMinutes)
    const remainingMinutes = this.getRemainingTime(state, durationMinutes) / 1000 / 60

    // Find the index of last announced checkpoint
    const lastIndex = state.lastAnnouncedCheckpoint
      ? checkpoints.findIndex((cp) => cp.id === state.lastAnnouncedCheckpoint)
      : -1

    // Find the next checkpoint that is due (after last announced)
    for (let i = lastIndex + 1; i < checkpoints.length; i++) {
      const checkpoint = checkpoints[i]
      if (remainingMinutes <= checkpoint.timeRemaining) {
        return checkpoint
      }
    }

    return null
  }

  /**
   * Check if a checkpoint should be announced now
   */
  shouldAnnounceCheckpoint(
    checkpoint: TaskCheckpoint,
    state: ActiveTaskState,
    durationMinutes: number
  ): boolean {
    // Don't announce if task is paused
    if (state.status === 'paused') {
      return false
    }

    const checkpoints = this.calculateCheckpoints(durationMinutes)
    const checkpointIndex = checkpoints.findIndex((cp) => cp.id === checkpoint.id)

    // Don't announce if already passed this checkpoint
    if (state.lastAnnouncedCheckpoint) {
      const lastIndex = checkpoints.findIndex(
        (cp) => cp.id === state.lastAnnouncedCheckpoint
      )
      if (checkpointIndex <= lastIndex) {
        return false
      }
    }

    const remainingMinutes = this.getRemainingTime(state, durationMinutes) / 1000 / 60

    // Announce if we've reached or passed this checkpoint
    return remainingMinutes <= checkpoint.timeRemaining
  }

  /**
   * Check if task is complete (time is up)
   */
  isTaskComplete(state: ActiveTaskState, durationMinutes: number): boolean {
    return this.getRemainingTime(state, durationMinutes) <= 0
  }
}
