import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 });
  }

  try {
    if (!request.body) {
      throw new Error('No file data received');
    }

    const blob = await put(filename, request.body as ReadableStream, {
      access: 'public',
      contentType: 'audio/mpeg'
    });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};