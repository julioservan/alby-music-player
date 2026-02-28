import { useEffect, useRef, useCallback } from 'react';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';

export function useAudioPlayer() {
  const { state, dispatch, seekRef } = usePlayer();
  const { next } = usePlayerActions();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isSeekingRef = useRef(false);
  const lastTrackIndexRef = useRef<number>(-1);

  // Initialize AudioContext on first user gesture (autoplay policy)
  const ensureAudioContext = useCallback(() => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }

    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(state.isMuted ? 0 : state.volume, ctx.currentTime);

    audioCtxRef.current = ctx;
    gainNodeRef.current = gain;

    // Wire existing audio element
    if (audioRef.current && !sourceNodeRef.current) {
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(gain);
      sourceNodeRef.current = source;
    }
  }, [state.isMuted, state.volume]);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  // Expose seek function via ref so context can call it
  useEffect(() => {
    seekRef.current = (time: number) => {
      if (audioRef.current) {
        isSeekingRef.current = true;
        audioRef.current.currentTime = time;
        setTimeout(() => {
          isSeekingRef.current = false;
        }, 100);
      }
    };
  }, [seekRef]);

  // Load new track when currentIndex changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const track = state.tracks[state.currentIndex];
    if (!track) return;

    // Skip if same track is already loaded
    if (lastTrackIndexRef.current === state.currentIndex && audio.src !== '') {
      return;
    }
    lastTrackIndexRef.current = state.currentIndex;

    audio.src = track.src;
    audio.load();
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    dispatch({ type: 'SET_DURATION', payload: 0 });
  }, [state.currentIndex, state.tracks, dispatch]);

  // Event listeners for audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isSeekingRef.current) {
        dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
      }
    };

    const onLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    const onEnded = () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (state.repeatMode === 'all' || state.currentIndex < state.tracks.length - 1) {
        next();
      } else {
        dispatch({ type: 'PAUSE' });
        dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
      }
    };

    const onError = () => {
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    const onCanPlay = () => {
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [dispatch, next, state.repeatMode, state.currentIndex, state.tracks.length]);

  // Play / Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      ensureAudioContext();
      audio.play().catch((err) => {
        console.warn('Playback error:', err);
        dispatch({ type: 'PAUSE' });
      });
    } else {
      audio.pause();
    }
  }, [state.isPlaying, dispatch, ensureAudioContext]);

  // Volume with smooth ramp (avoids clicks/pops)
  useEffect(() => {
    const gain = gainNodeRef.current;
    const ctx = audioCtxRef.current;
    if (!gain || !ctx) return;

    const targetGain = state.isMuted ? 0 : state.volume;
    gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05);
  }, [state.volume, state.isMuted]);

  // Sync volume on audio element as fallback (when AudioContext not yet init)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioCtxRef.current) {
      audio.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);
}
