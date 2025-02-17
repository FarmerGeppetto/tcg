import { NextResponse } from 'next/server';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const soundsDir = join(process.cwd(), 'public', 'sounds');
    console.log('Sounds directory:', soundsDir);

    // List all files in the directory
    const files = readdirSync(soundsDir);
    console.log('Files found:', files);

    // Try to read one file
    const testFile = files[0];
    if (testFile) {
      const filePath = join(soundsDir, testFile);
      const buffer = readFileSync(filePath);
      console.log(`Successfully read ${testFile}, size:`, buffer.length);
    }

    return NextResponse.json({ 
      files,
      directory: soundsDir,
      token: process.env.BLOB_READ_WRITE_TOKEN ? 'Present' : 'Missing'
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 