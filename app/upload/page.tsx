'use client';

import { useState, useRef } from 'react';
import type { PutBlobResult } from '@vercel/blob';

export default function UploadPage() {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 min-h-screen bg-white text-black">
      <h1 className="text-2xl mb-4 font-bold">Upload Sound Files</h1>

      <form onSubmit={async (e) => {
        e.preventDefault();
        setError('');
        
        if (!inputRef.current?.files?.length) return;

        try {
          const file = inputRef.current.files[0];
          const response = await fetch(`/api/upload-sound?filename=${file.name}`, {
            method: 'POST',
            body: file,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
          }

          const newBlob = await response.json() as PutBlobResult;
          setUrls(prev => ({ ...prev, [file.name]: newBlob.url }));
          inputRef.current.value = ''; // Clear input after success
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Upload failed');
        }
      }}>
        <div className="flex flex-col gap-4">
          <input 
            ref={inputRef}
            type="file" 
            accept="audio/mpeg"
            required 
            className="border p-2 rounded"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-fit"
          >
            Upload
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {Object.entries(urls).map(([name, url]) => (
        <div key={name} className="mt-4 p-4 bg-gray-50 rounded">
          <div className="font-medium">{name}</div>
          <a href={url} className="text-blue-500 hover:underline break-all">
            {url}
          </a>
        </div>
      ))}
    </div>
  );
} 