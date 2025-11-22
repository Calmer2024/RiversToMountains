import React, {useState, useEffect, useRef, type ChangeEvent} from 'react';
import {FiCpu, FiMusic, FiBookOpen, FiPlay, FiPause, FiVolume2, FiVolumeX, FiX} from 'react-icons/fi';
import styles from './StoryControls.module.scss';
import {ChatDialog} from './ChatDialog';
import type {SlideInfo} from '../data/slideInfo';

interface StoryControlsProps {
  activeSlideInfo: SlideInfo | null;
}

export const StoryControls: React.FC<StoryControlsProps> = ({activeSlideInfo}) => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);

  // --- 音频状态 ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- ⏲️ 自动隐藏计时器 Ref ---
  // 使用 useRef 保存 timer ID，这样在组件的任何地方都能清除它
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 核心工具函数：倒计时控制 ---

  // 1. 开始倒计时 (10秒后自动关闭)
  const startHideTimer = () => {
    // 先清除可能存在的旧计时器，防止多重触发
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      setIsBookOpen(false);
    }, 10000); // 10000ms = 10秒
  };

  // 2. 停止倒计时 (当鼠标在上面看的时候)
  const stopHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  // --- Effect 1: 监听场景变化，自动弹出 ---
  useEffect(() => {
    if (activeSlideInfo) {
      // 切换场景 -> 强制打开面板
      setIsBookOpen(true);
      // 开始倒计时
      startHideTimer();
    }

    // 组件卸载或下次effect执行前，清理计时器
    return () => stopHideTimer();
  }, [activeSlideInfo]);

  // --- Effect 2: 音频播放同步 ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(error => {
        console.warn("音乐自动播放被拦截:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // --- Effect 3: 音量同步 ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <>
      <div className={styles.controlsContainer}>
        {/* 注意：因为 CSS 用了 flex-direction: column-reverse
            所以写在 DOM 下面的元素（按钮组），实际上显示在屏幕的最下方。
            写在上面的元素（Popups），显示在按钮组的上方。
        */}

        {/* --- 1. 底部按钮组 --- */}
        <div className={styles.buttonGroup}>

          {/* AI 按钮 (保留注释) */}
          {/*<button
             className={styles.iconButton}
             title="AI 助手"
             onClick={() => setIsAiOpen(true)}
           >
             <FiCpu />
           </button>*/}

          {/* 音乐按钮 */}
          <button
            className={`${styles.iconButton} ${isMusicOpen ? styles.active : ''}`}
            title="背景音乐"
            onClick={() => setIsMusicOpen(prev => !prev)}
          >
            <FiMusic/>
          </button>

          {/* 景点信息按钮 */}
          <button
            className={`${styles.iconButton} ${isBookOpen ? styles.active : ''}`}
            title="景点信息"
            onClick={() => {
              setIsBookOpen(prev => !prev)
              if (isBookOpen) {
                if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
              }
            }}
            disabled={!activeSlideInfo}
          >
            <FiBookOpen/>
          </button>
        </div>

        {/* --- 2. 弹出的音乐面板 (位于按钮上方) --- */}
        {isMusicOpen && (
          <div className={`${styles.popup} ${styles.musicPopup} ${styles.popupEnter}`}>
            <button
              className={styles.iconButton}
              onClick={() => setIsPlaying(p => !p)}
            >
              {isPlaying ? <FiPause/> : <FiPlay/>}
            </button>

            {volume > 0 ? <FiVolume2/> : <FiVolumeX/>}

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

        {/* --- 3. 弹出的信息面板 (位于按钮上方) --- */}
        {isBookOpen && activeSlideInfo && (
          <div
            className={`${styles.popup} ${styles.bookPopup} ${styles.popupEnter}`}
            // ✨ 关键交互逻辑 ✨
            // 鼠标移入：停止倒计时，保持常亮，方便用户阅读
            onMouseEnter={stopHideTimer}
            // 鼠标移出：重新开始 10秒 倒计时
            onMouseLeave={startHideTimer}
          >
            <button
              className={styles.closeButton}
              onClick={() => setIsBookOpen(false)}
            >
              <FiX/>
            </button>

            {/* ✨ 动画技巧：
              给内容容器加上 key={activeSlideInfo.title}。
              当 activeSlideInfo 变化时，React 会认为这是一个新的 div，
              从而重新触发 contentFadeIn 动画。实现文字切换时的“呼吸感”。
            */}
            <div key={activeSlideInfo.title} className={styles.contentFadeIn}>
              <h3>{activeSlideInfo.title}</h3>
              <p>{activeSlideInfo.description}</p>
            </div>
          </div>
        )}
      </div>

      <ChatDialog isOpen={isAiOpen} onClose={() => setIsAiOpen(false)}/>

      <audio
        ref={audioRef}
        src="/music/story-theme.mp3"
        loop
        preload="auto"
      />
    </>
  );
};