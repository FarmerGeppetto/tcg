class SoundManager {
  private static sounds: { [key: string]: HTMLAudioElement } = {}
  private static initialized = false

  private static initialize() {
    if (typeof window === 'undefined' || this.initialized) return

    // Add console logs to debug
    console.log('Initializing sound manager...')

    // Using temporary direct URLs - replace these with your actual hosted sound files
    this.sounds = {
      attack: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
      special: new Audio('https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.mp3'),
      defend: new Audio('https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3'),
      heal: new Audio('https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3'),
      fight: new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3')
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