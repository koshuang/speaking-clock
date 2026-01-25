import { describe, it, expect } from 'vitest'
import { IntervalOptionsUseCase } from '../IntervalOptionsUseCase'

describe('IntervalOptionsUseCase', () => {
  const useCase = new IntervalOptionsUseCase()

  describe('getPresets', () => {
    it('should return preset intervals', () => {
      const presets = useCase.getPresets()
      expect(presets).toEqual([1, 5, 10, 15, 30, 60])
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
      expect(useCase.isPreset(15)).toBe(true)
      expect(useCase.isPreset(60)).toBe(true)
    })

    it('should return false for non-preset values', () => {
      expect(useCase.isPreset(3)).toBe(false)
      expect(useCase.isPreset(7)).toBe(false)
      expect(useCase.isPreset(45)).toBe(false)
    })
  })

  describe('isValid', () => {
    it('should return true for valid intervals', () => {
      expect(useCase.isValid(1)).toBe(true)
      expect(useCase.isValid(30)).toBe(true)
      expect(useCase.isValid(60)).toBe(true)
    })

    it('should return false for values below minimum', () => {
      expect(useCase.isValid(0)).toBe(false)
      expect(useCase.isValid(-1)).toBe(false)
    })

    it('should return false for values above maximum', () => {
      expect(useCase.isValid(61)).toBe(false)
      expect(useCase.isValid(100)).toBe(false)
    })

    it('should return false for non-integers', () => {
      expect(useCase.isValid(5.5)).toBe(false)
      expect(useCase.isValid(10.1)).toBe(false)
    })
  })

  describe('getMinInterval', () => {
    it('should return 1', () => {
      expect(useCase.getMinInterval()).toBe(1)
    })
  })

  describe('getMaxInterval', () => {
    it('should return 60', () => {
      expect(useCase.getMaxInterval()).toBe(60)
    })
  })

  describe('normalize', () => {
    it('should return value if within range', () => {
      expect(useCase.normalize(30)).toBe(30)
    })

    it('should return minimum if below range', () => {
      expect(useCase.normalize(0)).toBe(1)
      expect(useCase.normalize(-5)).toBe(1)
    })

    it('should return maximum if above range', () => {
      expect(useCase.normalize(100)).toBe(60)
    })

    it('should round decimal values', () => {
      expect(useCase.normalize(5.4)).toBe(5)
      expect(useCase.normalize(5.6)).toBe(6)
    })

    it('should handle NaN and Infinity', () => {
      expect(useCase.normalize(NaN)).toBe(1)
      expect(useCase.normalize(Infinity)).toBe(60)
    })
  })
})
