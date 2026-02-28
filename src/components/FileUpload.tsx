import React, { useCallback, useRef, useState } from 'react';
import './FileUpload.css';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';

const LABEL_COLORS = [
  { color: '#8e44ad', secondary: '#9b59b6' },
  { color: '#16a085', secondary: '#1abc9c' },
  { color: '#2c3e50', secondary: '#34495e' },
  { color: '#d35400', secondary: '#e67e22' },
  { color: '#27ae60', secondary: '#2ecc71' },
  { color: '#2471a3', secondary: '#3498db' },
];

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function FileUpload() {
  const { dispatch, state } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const audioFiles = Array.from(files).filter((f) =>
        f.type.startsWith('audio/')
      );

      const newTracks: Track[] = audioFiles.map((file, i) => {
        const colorIdx = (state.tracks.length + i) % LABEL_COLORS.length;
        const { color, secondary } = LABEL_COLORS[colorIdx];
        const url = URL.createObjectURL(file);
        // Extract title from filename (remove extension)
        const title = file.name.replace(/\.[^.]+$/, '');
        return {
          id: generateId(),
          title,
          artist: 'Local File',
          src: url,
          labelColor: color,
          labelSecondary: secondary,
        };
      });

      if (newTracks.length > 0) {
        dispatch({ type: 'ADD_TRACKS', payload: newTracks });
      }
    },
    [dispatch, state.tracks.length]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input so same file can be re-added
      e.target.value = '';
    },
    [handleFiles]
  );

  return (
    <div
      className={`file-upload ${isDragging ? 'is-dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload audio files"
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        className="file-upload__input"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="file-upload__icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
        </svg>
      </div>
      <div className="file-upload__label">
        {isDragging ? 'Drop to add' : 'Add local files'}
      </div>
      <div className="file-upload__hint">MP3, FLAC, WAV, OGG…</div>
    </div>
  );
}
