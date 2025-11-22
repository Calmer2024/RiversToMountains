import React, {useState, useEffect, useRef, type ChangeEvent} from 'react';
import {FiMusic, FiBookOpen, FiPlay, FiPause, FiVolume2, FiVolumeX, FiX} from 'react-icons/fi';
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

  // --- 核心 Ref：计时器管理 ---
  // 1. 自动隐藏倒计时 (阅读超时自动关闭)
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 2. 弹出防抖倒计时 (等待滚动结束)
  const debounceOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- 常量配置 ---
  const AUTO_HIDE_DELAY = 10000; // 10秒无操作自动隐藏
  const SCROLL_SETTLE_DELAY = 600; // 600ms 防抖：等待滚动完全停止、画面居中

  // --- 工具函数 ---

  // 启动/重置自动隐藏计时器
  const startAutoHide = () => {
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    autoHideTimerRef.current = setTimeout(() => {
      setIsBookOpen(false);
    }, AUTO_HIDE_DELAY); 
  };

  // 停止自动隐藏 (当用户鼠标悬停阅读时)
  const stopAutoHide = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  };

  // --- Effect 1: 智能弹出逻辑 (核心优化) ---
  useEffect(() => {
    // 1. 只要幻灯片发生变化 (activeSlideInfo 变了)，第一件事就是【立即收起】
    // 这样保证在滑动过程中，界面是干净的
    setIsBookOpen(false);
    stopAutoHide(); // 清理旧的隐藏计时器

    // 2. 清理上一次的“准备打开”计时器
    // 如果用户滑得很快 (A -> B -> C)，B 的计时器会被这里清除，B 的面板永远不会打开
    if (debounceOpenTimerRef.current) {
      clearTimeout(debounceOpenTimerRef.current);
    }

    // 3. 如果当前有有效的幻灯片，启动“防抖”计时器
    if (activeSlideInfo) {
      debounceOpenTimerRef.current = setTimeout(() => {
        // 只有当用户停在这个幻灯片超过 600ms (即“居中定格”了)，才执行打开
        setIsBookOpen(true);
        startAutoHide(); // 打开的同时，启动阅读倒计时
      }, SCROLL_SETTLE_DELAY);
    }

    // 组件卸载清理
    return () => {
      stopAutoHide();
      if (debounceOpenTimerRef.current) clearTimeout(debounceOpenTimerRef.current);
    };
  }, [activeSlideInfo]); // 依赖项：每次 activeSlideInfo 变化都会触发

  // --- Effect 2 & 3: 音频逻辑 (保持不变) ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play().catch(e => console.warn(e)) : audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return (
    <>
      <div className={styles.controlsContainer}>
        
        {/* --- 按钮组 --- */}
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.iconButton} ${isMusicOpen ? styles.active : ''}`}
            title="背景音乐"
            onClick={() => setIsMusicOpen(prev => !prev)}
          >
            <FiMusic/>
          </button>

          <button
            className={`${styles.iconButton} ${isBookOpen ? styles.active : ''}`}
            title="景点信息"
            onClick={() => {
              // 手动交互逻辑：
              // 如果是手动点击，我们希望立即响应，不需要防抖延迟
              if (debounceOpenTimerRef.current) clearTimeout(debounceOpenTimerRef.current);
              
              setIsBookOpen(prev => {
                const nextState = !prev;
                // 手动打开 -> 启动倒计时；手动关闭 -> 停止倒计时
                nextState ? startAutoHide() : stopAutoHide();
                return nextState;
              });
            }}
            // 如果没有幻灯片信息，禁用按钮
            disabled={!activeSlideInfo}
          >
            <FiBookOpen/>
          </button>
        </div>

        {/* --- 音乐面板 --- */}
        {isMusicOpen && (
          <div className={`${styles.popup} ${styles.musicPopup} ${styles.popupEnter}`}>
            <button className={styles.iconButton} onClick={() => setIsPlaying(p => !p)}>
              {isPlaying ? <FiPause/> : <FiPlay/>}
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

        {/* --- 信息面板 (自动弹出/隐藏) --- */}
        {isBookOpen && activeSlideInfo && (
          <div
            className={`${styles.popup} ${styles.bookPopup} ${styles.popupEnter}`}
            // 鼠标移入：暂停倒计时 (用户正在读)
            onMouseEnter={stopAutoHide}
            // 鼠标移出：恢复倒计时
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

            {/* Key 属性很关键：确保切换内容时触发 CSS 的淡入动画 */}
            <div key={activeSlideInfo.title} className={styles.contentFadeIn}>
              <h3>{activeSlideInfo.title}</h3>
              <p>{activeSlideInfo.description}</p>
            </div>
          </div>
        )}
      </div>

      <ChatDialog isOpen={isAiOpen} onClose={() => setIsAiOpen(false)}/>
      <audio ref={audioRef} src="/music/story-theme.mp3" loop preload="auto"/>
    </>
  );
};