import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SpeakTimeUseCase } from '../SpeakTimeUseCase'
import type { SpeechSynthesizer } from '../../ports/SpeechSynthesizer'

describe('SpeakTimeUseCase', () => {
  let mockSpeechSynthesizer: SpeechSynthesizer
  let useCase: SpeakTimeUseCase

  beforeEach(() => {
    mockSpeechSynthesizer = {
      getVoices: vi.fn().mockReturnValue([
        { id: 'voice1', name: 'Voice 1', lang: 'zh-TW' },
        { id: 'voice2', name: 'Voice 2', lang: 'en-US' },
      ]),
      speak: vi.fn(),
      cancel: vi.fn(),
    }
    useCase = new SpeakTimeUseCase(mockSpeechSynthesizer)
  })

  describe('execute', () => {
    it('應該呼叫 speechSynthesizer.speak 並傳入格式化後的時間', () => {
      const testDate = new Date(2024, 0, 1, 10, 30)
      useCase.execute(testDate)

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        '現在時間 上午 10 點 30 分',
        undefined
      )
    })

    it('如果沒有傳入日期，應該使用當前時間', () => {
      useCase.execute()

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledTimes(1)
      const callArgs = vi.mocked(mockSpeechSynthesizer.speak).mock.calls[0]
      expect(callArgs[0]).toMatch(/^現在時間/)
    })

    it('設定語音後，應該使用指定的語音 ID', () => {
      useCase.setVoice('voice1')
      const testDate = new Date(2024, 0, 1, 15, 0)
      useCase.execute(testDate)

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        '現在時間 下午 3 點整',
        'voice1'
      )
    })
  })

  describe('setVoice', () => {
    it('應該設定語音 ID', () => {
      useCase.setVoice('voice2')
      useCase.execute(new Date(2024, 0, 1, 9, 0))

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        expect.any(String),
        'voice2'
      )
    })

    it('可以更換語音 ID', () => {
      useCase.setVoice('voice1')
      useCase.setVoice('voice2')
      useCase.execute(new Date(2024, 0, 1, 9, 0))

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        expect.any(String),
        'voice2'
      )
    })
  })

  describe('getVoices', () => {
    it('應該回傳 speechSynthesizer 的語音列表', () => {
      const voices = useCase.getVoices()

      expect(voices).toEqual([
        { id: 'voice1', name: 'Voice 1', lang: 'zh-TW' },
        { id: 'voice2', name: 'Voice 2', lang: 'en-US' },
      ])
      expect(mockSpeechSynthesizer.getVoices).toHaveBeenCalled()
    })
  })
})
