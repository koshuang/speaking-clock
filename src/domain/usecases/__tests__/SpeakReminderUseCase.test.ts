import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SpeakReminderUseCase } from '../SpeakReminderUseCase'
import type { SpeechSynthesizer } from '../../ports/SpeechSynthesizer'
import type { Todo } from '../../entities/Todo'

describe('SpeakReminderUseCase', () => {
  let mockSpeechSynthesizer: SpeechSynthesizer
  let useCase: SpeakReminderUseCase

  beforeEach(() => {
    mockSpeechSynthesizer = {
      getVoices: vi.fn().mockReturnValue([
        { id: 'voice1', name: 'Voice 1', lang: 'zh-TW' },
        { id: 'voice2', name: 'Voice 2', lang: 'en-US' },
      ]),
      speak: vi.fn(),
      cancel: vi.fn(),
    }
    useCase = new SpeakReminderUseCase(mockSpeechSynthesizer)
  })

  describe('execute', () => {
    it('應該播報「提醒您：[待辦事項]」', () => {
      const todo: Todo = {
        id: '1',
        text: '買牛奶',
        completed: false,
        order: 0,
        createdAt: 1000,
      }

      useCase.execute(todo)

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        '提醒您：買牛奶',
        undefined,
        undefined
      )
    })

    it('應該在播報完成後呼叫 onEnd callback', () => {
      const todo: Todo = {
        id: '1',
        text: '測試待辦',
        completed: false,
        order: 0,
        createdAt: 1000,
      }
      const onEnd = vi.fn()

      useCase.execute(todo, onEnd)

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        '提醒您：測試待辦',
        undefined,
        onEnd
      )
    })

    it('設定語音後，應該使用指定的語音 ID', () => {
      const todo: Todo = {
        id: '1',
        text: '待辦事項',
        completed: false,
        order: 0,
        createdAt: 1000,
      }

      useCase.setVoice('voice1')
      useCase.execute(todo)

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        '提醒您：待辦事項',
        'voice1',
        undefined
      )
    })
  })

  describe('setVoice', () => {
    it('應該設定語音 ID', () => {
      useCase.setVoice('voice2')

      const todo: Todo = {
        id: '1',
        text: '測試',
        completed: false,
        order: 0,
        createdAt: 1000,
      }
      useCase.execute(todo)

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        expect.any(String),
        'voice2',
        undefined
      )
    })

    it('可以更換語音 ID', () => {
      useCase.setVoice('voice1')
      useCase.setVoice('voice2')

      const todo: Todo = {
        id: '1',
        text: '測試',
        completed: false,
        order: 0,
        createdAt: 1000,
      }
      useCase.execute(todo)

      expect(mockSpeechSynthesizer.speak).toHaveBeenCalledWith(
        expect.any(String),
        'voice2',
        undefined
      )
    })
  })
})
