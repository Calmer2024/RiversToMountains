import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { FiMusic, FiBookOpen, FiVolume2, FiVolumeX, FiX } from 'react-icons/fi';
import { IoPlay, IoPause, IoBrush } from "react-icons/io5"; // 引入毛笔图标
import styles from './StoryControls.module.scss';
import { ChatDialog } from './ChatDialog';
import type { SlideInfo } from '../data/slideInfo';
import { useStoryMusic } from '../context/StoryMusicContext';

// --- GSAP 引入 ---
import { gsap } from 'gsap';

interface StoryControlsProps {
  activeSlideInfo: SlideInfo | null;
}

export const StoryControls: React.FC<StoryControlsProps> = ({ activeSlideInfo }) => {
  // 状态管理
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  
  // ✨ 新创意功能：水墨模式状态
  const [isInkMode, setIsInkMode] = useState(false);

  // 全局音乐状态
  const { isPlaying, setIsPlaying, volume, setVolume } = useStoryMusic();

  // 计时器引用
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const AUTO_HIDE_DELAY = 10000;
  const SCROLL_SETTLE_DELAY = 600;

  // --- 辅助函数：自动隐藏逻辑 ---
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
    // 切换幻灯片时，重置计时器
    setIsBookOpen(false);
    stopAutoHide();
    
    if (debounceOpenTimerRef.current) {
      clearTimeout(debounceOpenTimerRef.current);
    }

    // 只有在【非水墨模式】且【AI关闭】时，才自动弹出介绍
    // 这样“水墨模式”下可以保持纯净的赏画体验
    if (activeSlideInfo && !isInkMode && !isAiOpen) {
      debounceOpenTimerRef.current = setTimeout(() => {
        setIsBookOpen(true);
        startAutoHide();
      }, SCROLL_SETTLE_DELAY);
    }

    return () => {
      stopAutoHide();
      if (debounceOpenTimerRef.current) clearTimeout(debounceOpenTimerRef.current);
    };
  }, [activeSlideInfo, isInkMode, isAiOpen]);

  // --- GSAP 水墨滤镜切换 ---
  useEffect(() => {
    const target = document.documentElement; // 作用于整个页面
    
    // 创建一个代理对象，用于存储当前的滤镜数值
    // 初始状态：全彩 (无滤镜)
    const filterValues = {
      grayscale: isInkMode ? 0 : 100, // 注意：这里是从当前状态开始
      contrast: isInkMode ? 100 : 130,
      sepia: isInkMode ? 0 : 25,
      brightness: isInkMode ? 100 : 90,
      blur: 0, 
      scale: 1
    };

    // 杀死旧动画，防止快速点击时冲突
    gsap.killTweensOf(target);
    gsap.killTweensOf(filterValues);

    if (isInkMode) {
      // === 进入【水墨模式】 ===
      // 动作拆解：
      // 1. 视线稍微模糊 (模拟墨水化开)
      // 2. 颜色抽离 (Grayscale)
      // 3. 对比度拉高 (模拟墨痕的力度)
      // 4. 画面微缩放 (呼吸感)

      // 创建时间轴
      const tl = gsap.timeline({
        onUpdate: () => {
          // 每一帧更新 CSS
          target.style.filter = `
            grayscale(${filterValues.grayscale}%) 
            contrast(${filterValues.contrast}%) 
            sepia(${filterValues.sepia}%) 
            brightness(${filterValues.brightness}%) 
            blur(${filterValues.blur}px)
          `;
        }
      });

      // 设置初始值 (从全彩开始)
      filterValues.grayscale = 0;
      filterValues.contrast = 100;
      filterValues.sepia = 0;
      filterValues.brightness = 100;
      filterValues.blur = 0;
      filterValues.scale = 1;

      tl.to(filterValues, {
        // 第一阶段：起笔 (稍微模糊，颜色开始变淡)
        duration: 0.8,
        grayscale: 60,
        blur: 3, // 瞬间的模糊，像眼睛失焦
        ease: "power2.out"
      })
      .to(filterValues, {
        // 第二阶段：入画 (变得清晰，但已经是黑白高对比，微微泛黄)
        duration: 1.2,
        grayscale: 100,
        contrast: 135, // 高对比，墨色更浓
        sepia: 20,     // 宣纸旧色
        brightness: 92,// 稍微压暗，更有氛围
        blur: 0,       // 重新变清晰
        scale: 1.02,   // 微微放大
        ease: "power3.inOut" // 缓动更优雅
      }, "-=0.4"); // 提前一点开始第二阶段，让动作衔接更自然

      // 联动：关闭书本
      setIsBookOpen(false);

    } else {
      // === 回归【全彩模式】 ===
      // 动作拆解：
      // 1. 像雨过天晴，光线先亮一下 
      // 2. 颜色如潮水般涌回
      
      const tl = gsap.timeline({
        onUpdate: () => {
          target.style.filter = `
            grayscale(${filterValues.grayscale}%) 
            contrast(${filterValues.contrast}%) 
            sepia(${filterValues.sepia}%) 
            brightness(${filterValues.brightness}%) 
            blur(${filterValues.blur}px)
          `;
        },
        onComplete: () => {
          // 动画结束后，彻底清除 filter 属性，避免性能消耗
          target.style.filter = "";
          target.style.transform = "";
        }
      });

      // 设置初始值 (从水墨状态开始)
      filterValues.grayscale = 100;
      filterValues.contrast = 135;
      filterValues.sepia = 20;
      filterValues.brightness = 92;
      filterValues.blur = 0;
      filterValues.scale = 1.02;

      tl.to(filterValues, {
        // 第一阶段：破晓 (模糊一下，并且变亮，像光透进来)
        duration: 0.6,
        blur: 4,
        brightness: 110, // 稍微过曝一点点，模拟强光
        contrast: 100,
        ease: "power2.in"
      })
      .to(filterValues, {
        // 第二阶段：现世 (清晰，色彩还原)
        duration: 1.0,
        grayscale: 0,
        sepia: 0,
        brightness: 100,
        blur: 0,
        scale: 1.005,
        ease: "power4.out" // 像水流一样顺滑地结束
      });
    }

    return () => {
      // 组件卸载清理
      gsap.killTweensOf(target);
      gsap.set(target, { clearProps: "filter,transform" });
    };
  }, [isInkMode]);


  return (
    <>
      <div className={styles.controlsContainer}>
        
        {/* --- 按钮组 --- */}
        <div className={styles.buttonGroup}>
          
          {/* ✨ 创意替换：水墨之境开关 */}
          <button
            className={`${styles.iconButton} ${styles.inkButton} ${isInkMode ? styles.active : ''}`}
            title={isInkMode ? "还原全彩" : "入画 (水墨模式)"}
            onClick={() => setIsInkMode(prev => !prev)}
          >
            <IoBrush />
          </button>

          <button
            className={`${styles.iconButton} ${isMusicOpen ? styles.active : ''} ${isPlaying ? styles.playing : ''}`}
            title="背景音乐"
            onClick={() => setIsMusicOpen(prev => !prev)}
          >
            <FiMusic />
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
            <FiBookOpen />
          </button>
        </div>

        {/* --- 音乐面板 --- */}
        {isMusicOpen && (
          <div className={`${styles.popup} ${styles.musicPopup} ${styles.popupEnter}`}>
            <button className={styles.iconButton} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <IoPause /> : <IoPlay />}
            </button>
            {volume > 0 ? <FiVolume2 /> : <FiVolumeX />}
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
              <FiX />
            </button>
            <div key={activeSlideInfo.title} className={styles.contentFadeIn}>
              <h3>{activeSlideInfo.title}</h3>
              <p>{activeSlideInfo.description}</p>
            </div>
          </div>
        )}
      </div>

      <ChatDialog isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
};