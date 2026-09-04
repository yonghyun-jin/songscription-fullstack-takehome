'use client';

import { useState, useRef } from 'react';
import { trpc } from '@/lib/trpc';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 32l8-8 8 8M16 24V40" />
    <rect x="4" y="8" width="40" height="32" rx="4" />
    <path d="M28 20h12M28 28h8" />
  </svg>
);

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createSong = trpc.songs.create.useMutation({
    onSuccess: () => {
      onSuccess?.();
      handleClose();
    },
    onError: (err) => {
      setError(err.message);
      setIsUploading(false);
    },
  });

  const handleClose = () => {
    setFile(null);
    setTitle('');
    setArtist('');
    setDifficulty('beginner');
    setError(null);
    setIsUploading(false);
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill title from filename
      const nameWithoutExt = selectedFile.name.replace(/\.(mid|midi)$/i, '');
      setTitle(nameWithoutExt.replace(/-/g, ' ').replace(/_/g, ' '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Upload file first
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { filePath, fileName } = await uploadRes.json();

      // Create song record
      await createSong.mutateAsync({
        title: title || fileName,
        artist: artist || undefined,
        filePath,
        fileName,
        difficulty,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-xl border border-zinc-800">
        <h2 className="text-xl font-bold text-white mb-4">Add transcription</h2>

        <form onSubmit={handleSubmit}>
          {/* File input */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer
                       hover:border-zinc-500 transition-colors mb-4"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mid,.midi"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div>
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.6-5.6 1.4 1.4L9 16.2z"/>
                  </svg>
                </div>
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-sm text-zinc-500">Click to change</p>
              </div>
            ) : (
              <div>
                <div className="text-zinc-600 mb-2 flex justify-center">
                  <UploadIcon />
                </div>
                <p className="text-zinc-400">Click to select a MIDI file</p>
                <p className="text-sm text-zinc-600">.mid or .midi</p>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song title"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Artist */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Artist (optional)</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Difficulty</label>
            <div className="flex gap-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-2 rounded-lg capitalize transition-colors text-sm font-medium
                    ${difficulty === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 border border-zinc-700 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium
                         hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
