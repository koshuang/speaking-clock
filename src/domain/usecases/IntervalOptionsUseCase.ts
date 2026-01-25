/**
 * Domain use case for announcement interval options
 * Defines preset intervals and validation rules
 */
export class IntervalOptionsUseCase {
  private readonly presets = [1, 5, 10, 15, 30, 60]
  private readonly minInterval = 1
  private readonly maxInterval = 60

  /**
   * Get preset interval options
   *
   * @returns Array of preset interval values in minutes
   */
  getPresets(): number[] {
    return [...this.presets]
  }

  /**
   * Check if a value is a preset interval
   *
   * @param value - Value to check
   * @returns true if value is a preset
   */
  isPreset(value: number): boolean {
    return this.presets.includes(value)
  }

  /**
   * Validate an interval value
   *
   * @param value - Value to validate
   * @returns true if value is valid
   */
  isValid(value: number): boolean {
    return Number.isInteger(value) && value >= this.minInterval && value <= this.maxInterval
  }

  /**
   * Get minimum allowed interval
   */
  getMinInterval(): number {
    return this.minInterval
  }

  /**
   * Get maximum allowed interval
   */
  getMaxInterval(): number {
    return this.maxInterval
  }

  /**
   * Normalize an interval value to be within valid range
   *
   * @param value - Value to normalize
   * @returns Normalized value within valid range
   */
  normalize(value: number): number {
    if (Number.isNaN(value) || value < this.minInterval) {
      return this.minInterval
    }
    if (!Number.isFinite(value) || value > this.maxInterval) {
      return this.maxInterval
    }
    return Math.round(value)
  }
}
