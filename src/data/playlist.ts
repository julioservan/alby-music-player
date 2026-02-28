import type { Track } from '../types/music';

export const initialTracks: Track[] = [
  {
    id: 'acoustic-breeze',
    title: 'Acoustic Breeze',
    artist: 'Bensound',
    src: '/audio/acoustic-breeze.mp3',
    labelColor: '#c0392b',
    labelSecondary: '#e74c3c',
  },
  {
    id: 'jazz-comedy',
    title: 'Jazz Comedy',
    artist: 'Bensound',
    src: '/audio/jazz-comedy.mp3',
    labelColor: '#2471a3',
    labelSecondary: '#3498db',
  },
  {
    id: 'sunny',
    title: 'Sunny',
    artist: 'Bensound',
    src: '/audio/sunny.mp3',
    labelColor: '#1e8449',
    labelSecondary: '#27ae60',
  },
  {
    id: 'ukulele',
    title: 'Ukulele',
    artist: 'Bensound',
    src: '/audio/ukulele.mp3',
    labelColor: '#b7950b',
    labelSecondary: '#f39c12',
  },
];
