import type { Voice } from '../entities/Voice'

/**
 * Domain use case for voice selection logic
 * Handles sorting, filtering, and selecting default voices
 */
export class VoiceSelectorUseCase {
  /**
   * Sort voices with Chinese voices first, then alphabetically by name
   *
   * @param voices - Array of voices to sort
   * @returns Sorted array of voices
   */
  sortVoices(voices: Voice[]): Voice[] {
    return [...voices].sort((a, b) => {
      const aIsChinese = this.isChineseVoice(a)
      const bIsChinese = this.isChineseVoice(b)
      if (aIsChinese && !bIsChinese) return -1
      if (!aIsChinese && bIsChinese) return 1
      return a.name.localeCompare(b.name)
    })
  }

  /**
   * Check if a voice is Chinese (zh or cmn)
   *
   * @param voice - Voice to check
   * @returns true if the voice is Chinese
   */
  isChineseVoice(voice: Voice): boolean {
    return voice.lang.includes('zh') || voice.lang.includes('cmn')
  }

  /**
   * Check if a voice is Taiwan Chinese (zh-TW)
   *
   * @param voice - Voice to check
   * @returns true if the voice is Taiwan Chinese
   */
  isTaiwanVoice(voice: Voice): boolean {
    return voice.lang === 'zh-TW' || voice.lang === 'zh_TW'
  }

  /**
   * Find the best default voice from available voices
   * Priority: Taiwan Chinese > Any Chinese > First available
   *
   * @param voices - Array of available voices
   * @returns The best default voice, or undefined if no voices available
   */
  findDefaultVoice(voices: Voice[]): Voice | undefined {
    if (voices.length === 0) return undefined

    const taiwanVoice = voices.find((v) => this.isTaiwanVoice(v))
    if (taiwanVoice) return taiwanVoice

    const chineseVoice = voices.find((v) => this.isChineseVoice(v))
    if (chineseVoice) return chineseVoice

    return voices[0]
  }

  /**
   * Find a voice by ID from available voices
   *
   * @param voices - Array of available voices
   * @param voiceId - Voice ID to find
   * @returns The voice if found, undefined otherwise
   */
  findVoiceById(voices: Voice[], voiceId: string): Voice | undefined {
    return voices.find((v) => v.id === voiceId)
  }

  /**
   * Get the voice to use, falling back to default if saved voice is not available
   *
   * @param voices - Array of available voices
   * @param savedVoiceId - Previously saved voice ID (optional)
   * @returns The voice to use
   */
  getVoiceToUse(voices: Voice[], savedVoiceId?: string | null): Voice | undefined {
    if (voices.length === 0) return undefined

    // If there's a saved voice ID, try to find it
    if (savedVoiceId) {
      const savedVoice = this.findVoiceById(voices, savedVoiceId)
      if (savedVoice) return savedVoice
    }

    // Fall back to default voice
    return this.findDefaultVoice(voices)
  }
}
