export class SoundEffectPlayer {
  private audioContext: AudioContext | null = null

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  async playCompletionSound(): Promise<void> {
    const ctx = this.getAudioContext()

    // Resume if suspended (needed for user gesture requirement)
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    // Play a pleasant ascending 3-note arpeggio (C5-E5-G5)
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 frequencies
    const duration = 0.15
    const gap = 0.1

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.value = freq
      osc.type = 'sine'

      const startTime = ctx.currentTime + i * (duration + gap)
      gain.gain.setValueAtTime(0.3, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      osc.start(startTime)
      osc.stop(startTime + duration)
    })
  }

  async playStartSound(): Promise<void> {
    const ctx = this.getAudioContext()

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    // Single cheerful tone
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = 440 // A4
    osc.type = 'sine'

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  }
}
