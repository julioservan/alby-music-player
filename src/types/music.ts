export type RepeatMode = 'none' | 'one' | 'all';

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  labelColor: string;
  labelSecondary: string;
  duration?: number;
}

export interface PlayerState {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;
}

export type PlayerAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_TRACK'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SEEK'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TRACKS'; payload: Track[] }
  | { type: 'SET_REPEAT'; payload: RepeatMode }
  | { type: 'TOGGLE_SHUFFLE' };
