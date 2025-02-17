import { put } from '@vercel/blob';

async function uploadSounds() {
  const sounds = [
    '442769__qubodup__sword-hit.mp3',
    '547600__mateusz_chenc__sword-attack.mp3',
    '523760__matrixxx__attack-blocked.mp3',
    '523654__matrixxx__powerup-10.mp3',
    '541822__audeption__three-two-one-fight-deep-voice.mp3'
  ];

  for (const sound of sounds) {
    const file = await fetch(`/sounds/${sound}`).then(r => r.blob());
    const { url } = await put(sound, file, { access: 'public' });
    console.log(`Uploaded ${sound}: ${url}`);
  }
} 