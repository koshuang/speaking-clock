/**
 * Domain use case for task duration options
 * Defines preset durations and validation rules
 */
export class DurationOptionsUseCase {
  private readonly presets = [5, 10, 15, 20, 30, 45, 60]
  private readonly minDuration = 1
  private readonly maxDuration = 999

  /**
   * Get preset duration options
   *
   * @returns Array of preset duration values in minutes
   */
  getPresets(): number[] {
    return [...this.presets]
  }

  /**
   * Check if a value is a preset duration
   *
   * @param value - Value to check
   * @returns true if value is a preset
   */
  isPreset(value: number): boolean {
    return this.presets.includes(value)
  }

  /**
   * Validate a duration value
   *
   * @param value - Value to validate
   * @returns true if value is valid
   */
  isValid(value: number): boolean {
    return Number.isInteger(value) && value >= this.minDuration && value <= this.maxDuration
  }

  /**
   * Get minimum allowed duration
   */
  getMinDuration(): number {
    return this.minDuration
  }

  /**
   * Get maximum allowed duration
   */
  getMaxDuration(): number {
    return this.maxDuration
  }

  /**
   * Normalize a duration value to be within valid range
   *
   * @param value - Value to normalize
   * @returns Normalized value within valid range
   */
  normalize(value: number): number {
    if (Number.isNaN(value) || value < this.minDuration) {
      return this.minDuration
    }
    if (!Number.isFinite(value) || value > this.maxDuration) {
      return this.maxDuration
    }
    return Math.round(value)
  }
}
