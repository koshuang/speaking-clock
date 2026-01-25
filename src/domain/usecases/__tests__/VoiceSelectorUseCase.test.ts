import { describe, it, expect } from 'vitest'
import { VoiceSelectorUseCase } from '../VoiceSelectorUseCase'
import type { Voice } from '../../entities/Voice'

describe('VoiceSelectorUseCase', () => {
  const useCase = new VoiceSelectorUseCase()

  const createVoice = (id: string, name: string, lang: string): Voice => ({
    id,
    name,
    lang,
  })

  describe('isChineseVoice', () => {
    it('should return true for zh-TW', () => {
      const voice = createVoice('1', 'Chinese TW', 'zh-TW')
      expect(useCase.isChineseVoice(voice)).toBe(true)
    })

    it('should return true for zh-CN', () => {
      const voice = createVoice('1', 'Chinese CN', 'zh-CN')
      expect(useCase.isChineseVoice(voice)).toBe(true)
    })

    it('should return true for cmn', () => {
      const voice = createVoice('1', 'Mandarin', 'cmn-Hant-TW')
      expect(useCase.isChineseVoice(voice)).toBe(true)
    })

    it('should return false for en-US', () => {
      const voice = createVoice('1', 'English', 'en-US')
      expect(useCase.isChineseVoice(voice)).toBe(false)
    })
  })

  describe('isTaiwanVoice', () => {
    it('should return true for zh-TW', () => {
      const voice = createVoice('1', 'Chinese TW', 'zh-TW')
      expect(useCase.isTaiwanVoice(voice)).toBe(true)
    })

    it('should return true for zh_TW (underscore)', () => {
      const voice = createVoice('1', 'Chinese TW', 'zh_TW')
      expect(useCase.isTaiwanVoice(voice)).toBe(true)
    })

    it('should return false for zh-CN', () => {
      const voice = createVoice('1', 'Chinese CN', 'zh-CN')
      expect(useCase.isTaiwanVoice(voice)).toBe(false)
    })
  })

  describe('sortVoices', () => {
    it('should sort Chinese voices first', () => {
      const voices = [
        createVoice('1', 'English', 'en-US'),
        createVoice('2', 'Chinese', 'zh-TW'),
        createVoice('3', 'French', 'fr-FR'),
      ]
      const sorted = useCase.sortVoices(voices)
      expect(sorted[0].lang).toBe('zh-TW')
    })

    it('should sort alphabetically within same category', () => {
      const voices = [
        createVoice('1', 'Charlie', 'en-US'),
        createVoice('2', 'Alice', 'en-US'),
        createVoice('3', 'Bob', 'en-US'),
      ]
      const sorted = useCase.sortVoices(voices)
      expect(sorted.map((v) => v.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('should not modify original array', () => {
      const voices = [
        createVoice('1', 'B', 'en-US'),
        createVoice('2', 'A', 'en-US'),
      ]
      useCase.sortVoices(voices)
      expect(voices[0].name).toBe('B')
    })
  })

  describe('findDefaultVoice', () => {
    it('should prefer Taiwan Chinese voice', () => {
      const voices = [
        createVoice('1', 'English', 'en-US'),
        createVoice('2', 'Chinese CN', 'zh-CN'),
        createVoice('3', 'Chinese TW', 'zh-TW'),
      ]
      const result = useCase.findDefaultVoice(voices)
      expect(result?.lang).toBe('zh-TW')
    })

    it('should fall back to any Chinese voice if no Taiwan voice', () => {
      const voices = [
        createVoice('1', 'English', 'en-US'),
        createVoice('2', 'Chinese CN', 'zh-CN'),
        createVoice('3', 'French', 'fr-FR'),
      ]
      const result = useCase.findDefaultVoice(voices)
      expect(result?.lang).toBe('zh-CN')
    })

    it('should fall back to first voice if no Chinese voice', () => {
      const voices = [
        createVoice('1', 'English', 'en-US'),
        createVoice('2', 'French', 'fr-FR'),
      ]
      const result = useCase.findDefaultVoice(voices)
      expect(result?.id).toBe('1')
    })

    it('should return undefined for empty array', () => {
      const result = useCase.findDefaultVoice([])
      expect(result).toBeUndefined()
    })
  })

  describe('findVoiceById', () => {
    it('should find voice by ID', () => {
      const voices = [
        createVoice('voice-1', 'English', 'en-US'),
        createVoice('voice-2', 'Chinese', 'zh-TW'),
      ]
      const result = useCase.findVoiceById(voices, 'voice-2')
      expect(result?.name).toBe('Chinese')
    })

    it('should return undefined if not found', () => {
      const voices = [createVoice('voice-1', 'English', 'en-US')]
      const result = useCase.findVoiceById(voices, 'voice-999')
      expect(result).toBeUndefined()
    })
  })

  describe('getVoiceToUse', () => {
    it('should return saved voice if available', () => {
      const voices = [
        createVoice('voice-1', 'English', 'en-US'),
        createVoice('voice-2', 'Chinese', 'zh-TW'),
      ]
      const result = useCase.getVoiceToUse(voices, 'voice-1')
      expect(result?.id).toBe('voice-1')
    })

    it('should return default voice if saved voice not available', () => {
      const voices = [
        createVoice('voice-1', 'English', 'en-US'),
        createVoice('voice-2', 'Chinese', 'zh-TW'),
      ]
      const result = useCase.getVoiceToUse(voices, 'voice-999')
      expect(result?.lang).toBe('zh-TW')
    })

    it('should return default voice if no saved voice ID', () => {
      const voices = [
        createVoice('voice-1', 'English', 'en-US'),
        createVoice('voice-2', 'Chinese', 'zh-TW'),
      ]
      const result = useCase.getVoiceToUse(voices, null)
      expect(result?.lang).toBe('zh-TW')
    })

    it('should return undefined for empty array', () => {
      const result = useCase.getVoiceToUse([], 'voice-1')
      expect(result).toBeUndefined()
    })
  })
})
