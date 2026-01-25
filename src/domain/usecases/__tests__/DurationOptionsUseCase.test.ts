import { describe, it, expect } from 'vitest'
import { DurationOptionsUseCase } from '../DurationOptionsUseCase'

describe('DurationOptionsUseCase', () => {
  const useCase = new DurationOptionsUseCase()

  describe('getPresets', () => {
    it('should return preset durations', () => {
      const presets = useCase.getPresets()
      expect(presets).toEqual([5, 10, 15, 20, 30, 45, 60])
    })

    it('should return a new array each time', () => {
      const presets1 = useCase.getPresets()
      const presets2 = useCase.getPresets()
      expect(presets1).not.toBe(presets2)
    })
  })

  describe('isPreset', () => {
    it('should return true for preset values', () => {
      expect(useCase.isPreset(5)).toBe(true)
      expect(useCase.isPreset(30)).toBe(true)
      expect(useCase.isPreset(60)).toBe(true)
    })

    it('should return false for non-preset values', () => {
      expect(useCase.isPreset(3)).toBe(false)
      expect(useCase.isPreset(25)).toBe(false)
      expect(useCase.isPreset(90)).toBe(false)
    })
  })

  describe('isValid', () => {
    it('should return true for valid durations', () => {
      expect(useCase.isValid(1)).toBe(true)
      expect(useCase.isValid(100)).toBe(true)
      expect(useCase.isValid(999)).toBe(true)
    })

    it('should return false for values below minimum', () => {
      expect(useCase.isValid(0)).toBe(false)
      expect(useCase.isValid(-1)).toBe(false)
    })

    it('should return false for values above maximum', () => {
      expect(useCase.isValid(1000)).toBe(false)
      expect(useCase.isValid(9999)).toBe(false)
    })

    it('should return false for non-integers', () => {
      expect(useCase.isValid(5.5)).toBe(false)
      expect(useCase.isValid(10.1)).toBe(false)
    })
  })

  describe('getMinDuration', () => {
    it('should return 1', () => {
      expect(useCase.getMinDuration()).toBe(1)
    })
  })

  describe('getMaxDuration', () => {
    it('should return 999', () => {
      expect(useCase.getMaxDuration()).toBe(999)
    })
  })

  describe('normalize', () => {
    it('should return value if within range', () => {
      expect(useCase.normalize(100)).toBe(100)
    })

    it('should return minimum if below range', () => {
      expect(useCase.normalize(0)).toBe(1)
      expect(useCase.normalize(-5)).toBe(1)
    })

    it('should return maximum if above range', () => {
      expect(useCase.normalize(1000)).toBe(999)
    })

    it('should round decimal values', () => {
      expect(useCase.normalize(5.4)).toBe(5)
      expect(useCase.normalize(5.6)).toBe(6)
    })

    it('should handle NaN and Infinity', () => {
      expect(useCase.normalize(NaN)).toBe(1)
      expect(useCase.normalize(Infinity)).toBe(999)
    })
  })
})
