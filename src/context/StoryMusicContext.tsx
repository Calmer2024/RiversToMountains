import React, { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';

interface StoryMusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const StoryMusicContext = createContext<StoryMusicContextType | undefined>(undefined);

export const StoryMusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 初始状态设为 false，等待用户交互（浏览器自动播放策略限制）
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio('/audio/story-theme.mp3');
    audioRef.current.loop = true;
    audioRef.current.preload = 'auto';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 监听播放状态变化
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("自动播放被阻止，需要用户交互:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // 监听音量变化
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(prev => !prev);

  return (
    <StoryMusicContext.Provider value={{ isPlaying, togglePlay, setIsPlaying, volume, setVolume }}>
      {children}
    </StoryMusicContext.Provider>
  );
};

export const useStoryMusic = () => {
  const context = useContext(StoryMusicContext);
  if (!context) {
    throw new Error('useStoryMusic must be used within a StoryMusicProvider');
  }
  return context;
};