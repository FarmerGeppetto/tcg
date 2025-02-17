class SoundManager {
  private static sounds: { [key: string]: HTMLAudioElement } = {}
  private static initialized = false

  private static initialize() {
    if (typeof window === 'undefined' || this.initialized) return

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://azukibattle.com'
      : ''

    this.sounds = {
      attack: new Audio(`${baseUrl}/sounds/442769__qubodup__sword-hit.mp3`),
      special: new Audio(`${baseUrl}/sounds/547600__mateusz_chenc__sword-attack.mp3`),
      defend: new Audio(`${baseUrl}/sounds/523760__matrixxx__attack-blocked.mp3`),
      heal: new Audio(`${baseUrl}/sounds/523654__matrixxx__powerup-10.mp3`),
      fight: new Audio(`${baseUrl}/sounds/541822__audeption__three-two-one-fight-deep-voice.mp3`)
    }
    
    this.initialized = true
  }

  static play(sound: keyof typeof SoundManager.sounds) {
    if (typeof window === 'undefined') return // Don't run on server

    if (!this.initialized) {
      this.initialize()
    }

    const audio = this.sounds[sound]
    if (audio) {
      audio.currentTime = 0
      audio.volume = 0.3
      audio.play().catch(e => console.error('Error playing sound:', e))
    }
  }
}

export default SoundManager 