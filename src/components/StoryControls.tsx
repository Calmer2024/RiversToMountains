import React, { useState, useEffect, useRef, type ChangeEvent } from 'react'; // ✨ 1. 导入
import { FiCpu, FiMusic, FiBookOpen, FiPlay, FiPause, FiVolume2, FiVolumeX, FiX } from 'react-icons/fi';
import styles from './StoryControls.module.scss';
import { ChatDialog } from './ChatDialog';
import type { SlideInfo } from '../data/slideInfo'; 

interface StoryControlsProps {
  activeSlideInfo: SlideInfo | null;
}

export const StoryControls: React.FC<StoryControlsProps> = ({ activeSlideInfo }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);

  // --- 音频逻辑 ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  // 创建一个 Ref 来指向 audio 元素
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 添加 Effect 来同步 "播放/暂停" 状态
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return; // 如果 audio 元素还不存在，则不执行

    if (isPlaying) {
      // 尝试播放
      audio.play().catch(error => {
        // (如果用户没有与页面交互，自动播放可能会失败)
        console.warn("音乐自动播放失败:", error);
        setIsPlaying(false); // 更新状态为暂停
      });
    } else {
      // 暂停
      audio.pause();
    }
  }, [isPlaying]); // 这个 Effect 只在 isPlaying 状态改变时运行

  // 添加 Effect 来同步 "音量" 状态
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume; // 将 React 的 state 赋值给 audio 元素的 volume
    }
  }, [volume]); // 这个 Effect 只在 volume 状态改变时运行
  

  return (
    <>
      <div className={styles.controlsContainer}>
        <div className={styles.buttonGroup}>
          
          {/* 1. AI 按钮 */}
          <button 
            className={styles.iconButton} 
            title="AI 助手"
            onClick={() => setIsAiOpen(true)}
          >
            <FiCpu />
          </button>

          {/* 2. 音乐按钮 */}
          <button 
            className={`${styles.iconButton} ${isMusicOpen ? styles.active : ''}`}
            title="背景音乐"
            onClick={() => setIsMusicOpen(prev => !prev)}
          >
            <FiMusic />
          </button>

          {/* 3. 信息按钮 */}
          <button 
            className={`${styles.iconButton} ${isBookOpen ? styles.active : ''}`}
            title="景点信息"
            onClick={() => setIsBookOpen(prev => !prev)}
            disabled={!activeSlideInfo}
          >
            <FiBookOpen />
          </button>
        </div>

        {/* --- 弹出的面板 --- */}

        {/* 音乐面板 */}
        {isMusicOpen && (
          <div className={`${styles.popup} ${styles.musicPopup}`}>
            {/* 按钮现在可以真正控制播放了 */}
            <button 
              className={styles.iconButton} 
              onClick={() => setIsPlaying(p => !p)}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            
            {volume > 0 ? <FiVolume2 /> : <FiVolumeX />}
            
            {/* 音量条现在可以真正控制音量了 */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value))}
              className={styles.volumeSlider}
            />
          </div>
        )}

        {isBookOpen && activeSlideInfo && (
          <div className={`${styles.popup} ${styles.bookPopup}`}>
            <button 
              className={styles.closeButton}
              onClick={() => setIsBookOpen(false)}
            >
              <FiX />
            </button>
            <h3>{activeSlideInfo.title}</h3>
            <p>{activeSlideInfo.description}</p>
          </div>
        )}
      </div>

      <ChatDialog isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      <audio
        ref={audioRef}
        src="/music/story-theme.mp3"  
        loop
        preload="auto"
      />
    </>
  );
};