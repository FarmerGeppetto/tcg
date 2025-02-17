class SoundManager {
  private static sounds: { [key: string]: HTMLAudioElement } = {}
  private static initialized = false

  private static initialize() {
    if (typeof window === 'undefined' || this.initialized) return

    const SOUND_URLS = {
      attack: 'https://jewmugsbblpba6ja.public.blob.vercel-storage.com/442769__qubodup__sword-hit-FY52eLbkmMDRKm46AtnptTf2BuTIkC.mp3',
      special: 'https://jewmugsbblpba6ja.public.blob.vercel-storage.com/547600__mateusz_chenc__sword-attack-2CRX6zZZyzhmsOFLmJMWizfgNYFNT8.mp3',
      defend: 'https://jewmugsbblpba6ja.public.blob.vercel-storage.com/523760__matrixxx__attack-blocked-pC055SFTOfpx1mL4FJwgS4eUjwRGvE.mp3',
      heal: 'https://jewmugsbblpba6ja.public.blob.vercel-storage.com/523654__matrixxx__powerup-10-kLeqHqVrI4fIOCSMKBYpT6dCww27MF.mp3',
      fight: 'https://jewmugsbblpba6ja.public.blob.vercel-storage.com/541822__audeption__three-two-one-fight-deep-voice-TiGNYAzyqu905ijqsiVbOWOZUssGgH.mp3'
    }

    this.sounds = {
      attack: new Audio(SOUND_URLS.attack),
      special: new Audio(SOUND_URLS.special),
      defend: new Audio(SOUND_URLS.defend),
      heal: new Audio(SOUND_URLS.heal),
      fight: new Audio(SOUND_URLS.fight)
    }

    // Add error listeners to each sound
    Object.entries(this.sounds).forEach(([name, audio]) => {
      audio.addEventListener('error', (e) => {
        console.error(`Error loading ${name}:`, e)
      })
    })
    
    this.initialized = true
  }

  static play(sound: keyof typeof SoundManager.sounds) {
    if (typeof window === 'undefined') return

    if (!this.initialized) {
      this.initialize()
    }

    const audio = this.sounds[sound]
    if (audio) {
      console.log(`Attempting to play ${sound}...`)
      audio.currentTime = 0
      audio.volume = 0.3
      audio.play()
        .then(() => console.log(`${sound} played successfully`))
        .catch(e => console.error(`Error playing ${sound}:`, e))
    }
  }
}

export default SoundManager 