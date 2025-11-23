import React, {useState, useEffect, useRef, type ChangeEvent} from 'react';
import {FiMusic, FiBookOpen, FiVolume2, FiVolumeX, FiX} from 'react-icons/fi';
import { IoPlay,IoPause   } from "react-icons/io5";
import styles from './StoryControls.module.scss';
import {ChatDialog} from './ChatDialog';
import type {SlideInfo} from '../data/slideInfo';
import { useStoryMusic } from '../context/StoryMusicContext';

interface StoryControlsProps {
  activeSlideInfo: SlideInfo | null;
}

export const StoryControls: React.FC<StoryControlsProps> = ({activeSlideInfo}) => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  
  // 新增：自动播放状态
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // --- 使用全局音乐状态 ---
  const { isPlaying, setIsPlaying, volume, setVolume } = useStoryMusic();

  // --- 计时器管理 ---
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 自动播放定时器
  const autoPlayIntervalRef = useRef<number | null>(null);

  const AUTO_HIDE_DELAY = 10000;
  const SCROLL_SETTLE_DELAY = 600;

  const startAutoHide = () => {
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    autoHideTimerRef.current = setTimeout(() => {
      setIsBookOpen(false);
    }, AUTO_HIDE_DELAY);
  };

  const stopAutoHide = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  };

  // --- 智能弹出逻辑 ---
  useEffect(() => {
    setIsBookOpen(false);
    stopAutoHide();
    if (debounceOpenTimerRef.current) {
      clearTimeout(debounceOpenTimerRef.current);
    }
    if (activeSlideInfo) {
      debounceOpenTimerRef.current = setTimeout(() => {
        setIsBookOpen(true);
        startAutoHide();
      }, SCROLL_SETTLE_DELAY);
    }
    return () => {
      stopAutoHide();
      if (debounceOpenTimerRef.current) clearTimeout(debounceOpenTimerRef.current);
    };
  }, [activeSlideInfo]);

  // --- 新增：自动播放逻辑 ---
  useEffect(() => {
    if (isAutoPlaying) {
      // 这里的 30ms 和 1px 控制滚动速率，可按需调整
      autoPlayIntervalRef.current = window.setInterval(() => {
        window.scrollBy({ top: 5, behavior: 'auto' });
      }, 6);
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  return (
    <>
      <div className={styles.controlsContainer}>
        
        {/* --- 按钮组 --- */}
        <div className={styles.buttonGroup}>
          {/* 新增：自动播放按钮 (放在最左侧) */}
          <button
            className={`${styles.iconButton} ${isAutoPlaying ? styles.active : ''}`}
            title="自动播放"
            onClick={() => setIsAutoPlaying(prev => !prev)}
          >
            {isAutoPlaying ? <IoPause/> : <IoPlay/>}
          </button>

          <button
            // 修改：拆分 active (面板打开) 和 playing (播放中) 状态
            // playing 状态将触发特定的旋转动画和红色背景
            className={`${styles.iconButton} ${isMusicOpen ? styles.active : ''} ${isPlaying ? styles.playing : ''}`}
            title="背景音乐"
            onClick={() => setIsMusicOpen(prev => !prev)}
          >
            <FiMusic/>
          </button>

          <button
            className={`${styles.iconButton} ${isBookOpen ? styles.active : ''}`}
            title="景点信息"
            onClick={() => {
              if (debounceOpenTimerRef.current) clearTimeout(debounceOpenTimerRef.current);
              setIsBookOpen(prev => {
                const nextState = !prev;
                nextState ? startAutoHide() : stopAutoHide();
                return nextState;
              });
            }}
            disabled={!activeSlideInfo}
          >
            <FiBookOpen/>
          </button>
        </div>

        {/* --- 音乐面板 --- */}
        {isMusicOpen && (
          <div className={`${styles.popup} ${styles.musicPopup} ${styles.popupEnter}`}>
            <button className={styles.iconButton} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <IoPause/> : <IoPlay/>}
            </button>
            {volume > 0 ? <FiVolume2/> : <FiVolumeX/>}
            <input
              type="range"
              min="0" max="1" step="0.01"
              value={volume}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value))}
              className={styles.volumeSlider}
            />
          </div>
        )}

        {/* --- 信息面板 --- */}
        {isBookOpen && activeSlideInfo && (
          <div
            className={`${styles.popup} ${styles.bookPopup} ${styles.popupEnter}`}
            onMouseEnter={stopAutoHide}
            onMouseLeave={startAutoHide}
          >
            <button
              className={styles.closeButton}
              onClick={() => {
                setIsBookOpen(false);
                stopAutoHide();
              }}
            >
              <FiX/>
            </button>
            <div key={activeSlideInfo.title} className={styles.contentFadeIn}>
              <h3>{activeSlideInfo.title}</h3>
              <p>{activeSlideInfo.description}</p>
            </div>
          </div>
        )}
      </div>

      <ChatDialog isOpen={isAiOpen} onClose={() => setIsAiOpen(false)}/>
    </>
  );
};