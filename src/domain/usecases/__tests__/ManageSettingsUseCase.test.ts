import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ManageSettingsUseCase } from '../ManageSettingsUseCase'
import type { SettingsRepository } from '../../ports/SettingsRepository'
import type { ClockSettings } from '../../entities/ClockSettings'

describe('ManageSettingsUseCase', () => {
  let mockRepository: SettingsRepository
  let useCase: ManageSettingsUseCase

  const defaultSettings: ClockSettings = {
    interval: 30,
    enabled: false,
  }

  beforeEach(() => {
    mockRepository = {
      load: vi.fn().mockReturnValue(defaultSettings),
      save: vi.fn(),
    }
    useCase = new ManageSettingsUseCase(mockRepository)
  })

  describe('load', () => {
    it('應該從 repository 載入設定', () => {
      const result = useCase.load()

      expect(mockRepository.load).toHaveBeenCalled()
      expect(result).toEqual(defaultSettings)
    })

    it('應該回傳 repository 回傳的設定', () => {
      const customSettings: ClockSettings = { interval: 15, enabled: true }
      vi.mocked(mockRepository.load).mockReturnValue(customSettings)

      const result = useCase.load()

      expect(result).toEqual(customSettings)
    })
  })

  describe('save', () => {
    it('應該將設定儲存到 repository', () => {
      const settings: ClockSettings = { interval: 10, enabled: true }
      useCase.save(settings)

      expect(mockRepository.save).toHaveBeenCalledWith(settings)
    })
  })

  describe('updateInterval', () => {
    it('應該更新間隔並儲存', () => {
      const currentSettings: ClockSettings = { interval: 30, enabled: false }
      const result = useCase.updateInterval(currentSettings, 15)

      expect(result).toEqual({ interval: 15, enabled: false })
      expect(mockRepository.save).toHaveBeenCalledWith({ interval: 15, enabled: false })
    })

    it('應該保留其他設定不變', () => {
      const currentSettings: ClockSettings = { interval: 30, enabled: true }
      const result = useCase.updateInterval(currentSettings, 60)

      expect(result.enabled).toBe(true)
      expect(result.interval).toBe(60)
    })

    it('應該回傳新的設定物件（不修改原物件）', () => {
      const currentSettings: ClockSettings = { interval: 30, enabled: false }
      const result = useCase.updateInterval(currentSettings, 15)

      expect(result).not.toBe(currentSettings)
      expect(currentSettings.interval).toBe(30)
    })
  })

  describe('toggleEnabled', () => {
    it('應該將 enabled 從 false 切換為 true', () => {
      const currentSettings: ClockSettings = { interval: 30, enabled: false }
      const result = useCase.toggleEnabled(currentSettings)

      expect(result).toEqual({ interval: 30, enabled: true })
      expect(mockRepository.save).toHaveBeenCalledWith({ interval: 30, enabled: true })
    })

    it('應該將 enabled 從 true 切換為 false', () => {
      const currentSettings: ClockSettings = { interval: 30, enabled: true }
      const result = useCase.toggleEnabled(currentSettings)

      expect(result).toEqual({ interval: 30, enabled: false })
      expect(mockRepository.save).toHaveBeenCalledWith({ interval: 30, enabled: false })
    })

    it('應該保留 interval 設定不變', () => {
      const currentSettings: ClockSettings = { interval: 15, enabled: false }
      const result = useCase.toggleEnabled(currentSettings)

      expect(result.interval).toBe(15)
    })

    it('應該回傳新的設定物件（不修改原物件）', () => {
      const currentSettings: ClockSettings = { interval: 30, enabled: false }
      const result = useCase.toggleEnabled(currentSettings)

      expect(result).not.toBe(currentSettings)
      expect(currentSettings.enabled).toBe(false)
    })
  })

  describe('updateVoiceId', () => {
    it('應該更新語音 ID 並儲存', () => {
      const currentSettings: ClockSettings = { interval: 30, enabled: false }
      const result = useCase.updateVoiceId(currentSettings, 'voice-123')

      expect(result).toEqual({ interval: 30, enabled: false, voiceId: 'voice-123' })
      expect(mockRepository.save).toHaveBeenCalledWith({
        interval: 30,
        enabled: false,
        voiceId: 'voice-123',
      })
    })

    it('應該保留其他設定不變', () => {
      const currentSettings: ClockSettings = { interval: 15, enabled: true, voiceId: 'old-voice' }
      const result = useCase.updateVoiceId(currentSettings, 'new-voice')

      expect(result.interval).toBe(15)
      expect(result.enabled).toBe(true)
      expect(result.voiceId).toBe('new-voice')
    })

    it('應該回傳新的設定物件（不修改原物件）', () => {
      const currentSettings: ClockSettings = { interval: 30, enabled: false }
      const result = useCase.updateVoiceId(currentSettings, 'voice-123')

      expect(result).not.toBe(currentSettings)
      expect(currentSettings.voiceId).toBeUndefined()
    })
  })
})
