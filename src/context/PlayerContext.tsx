import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
} from 'react';
import type { PlayerState, PlayerAction, Track } from '../types/music';
import { initialTracks } from '../data/playlist';

const initialState: PlayerState = {
  tracks: initialTracks,
  currentIndex: 0,
  isPlaying: false,
  isMuted: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  isLoading: false,
  repeatMode: 'none',
  isShuffle: false,
};

function getNextIndex(state: PlayerState): number {
  if (state.isShuffle) {
    const candidates = state.tracks
      .map((_, i) => i)
      .filter((i) => i !== state.currentIndex);
    if (candidates.length === 0) return state.currentIndex;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  return (state.currentIndex + 1) % state.tracks.length;
}

function getPrevIndex(state: PlayerState): number {
  if (state.isShuffle) {
    const candidates = state.tracks
      .map((_, i) => i)
      .filter((i) => i !== state.currentIndex);
    if (candidates.length === 0) return state.currentIndex;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  return (state.currentIndex - 1 + state.tracks.length) % state.tracks.length;
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'NEXT': {
      const nextIndex = getNextIndex(state);
      return {
        ...state,
        currentIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        isLoading: true,
      };
    }
    case 'PREV': {
      const prevIndex = getPrevIndex(state);
      return {
        ...state,
        currentIndex: prevIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        isLoading: true,
      };
    }
    case 'SET_TRACK':
      return {
        ...state,
        currentIndex: action.payload,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        isLoading: true,
      };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: false };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'SEEK':
      return { ...state, currentTime: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_TRACKS':
      return { ...state, tracks: [...state.tracks, ...action.payload] };
    case 'SET_REPEAT':
      return { ...state, repeatMode: action.payload };
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffle: !state.isShuffle };
    default:
      return state;
  }
}

interface PlayerContextValue {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
  seekRef: React.MutableRefObject<((time: number) => void) | null>;
  currentTrack: Track | undefined;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const seekRef = useRef<((time: number) => void) | null>(null);

  const currentTrack = state.tracks[state.currentIndex];

  const value = {
    state,
    dispatch,
    seekRef,
    currentTrack,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

// Convenience hook for dispatching common actions
export function usePlayerActions() {
  const { dispatch, seekRef, state } = usePlayer();

  const play = useCallback(() => dispatch({ type: 'PLAY' }), [dispatch]);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [dispatch]);
  const next = useCallback(() => dispatch({ type: 'NEXT' }), [dispatch]);
  const prev = useCallback(() => dispatch({ type: 'PREV' }), [dispatch]);
  const setTrack = useCallback(
    (index: number) => dispatch({ type: 'SET_TRACK', payload: index }),
    [dispatch]
  );
  const setVolume = useCallback(
    (vol: number) => dispatch({ type: 'SET_VOLUME', payload: vol }),
    [dispatch]
  );
  const toggleMute = useCallback(() => dispatch({ type: 'TOGGLE_MUTE' }), [dispatch]);
  const seek = useCallback(
    (time: number) => {
      if (seekRef.current) seekRef.current(time);
      dispatch({ type: 'SEEK', payload: time });
    },
    [dispatch, seekRef]
  );
  const toggleRepeat = useCallback(() => {
    const modes: PlayerState['repeatMode'][] = ['none', 'all', 'one'];
    const next = modes[(modes.indexOf(state.repeatMode) + 1) % modes.length];
    dispatch({ type: 'SET_REPEAT', payload: next });
  }, [dispatch, state.repeatMode]);
  const toggleShuffle = useCallback(
    () => dispatch({ type: 'TOGGLE_SHUFFLE' }),
    [dispatch]
  );

  return { play, pause, next, prev, setTrack, setVolume, toggleMute, seek, toggleRepeat, toggleShuffle };
}
