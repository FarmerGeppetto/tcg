import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Use the new route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sounds = {
      attack: '442769__qubodup__sword-hit.mp3',
      special: '547600__mateusz_chenc__sword-attack.mp3',
      defend: '523760__matrixxx__attack-blocked.mp3',
      heal: '523654__matrixxx__powerup-10.mp3',
      fight: '541822__audeption__three-two-one-fight-deep-voice.mp3'
    };

    const urls: Record<string, string> = {};

    for (const [key, filename] of Object.entries(sounds)) {
      const filePath = join(process.cwd(), 'public', 'sounds', filename);
      const buffer = readFileSync(filePath);
      
      const { url } = await put(filename, buffer, {
        access: 'public',
        contentType: 'audio/mpeg'
      });

      urls[key] = url;
      console.log(`Uploaded ${key}: ${url}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 