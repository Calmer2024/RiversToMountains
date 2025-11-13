import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './OpeningAnimation.module.scss';

// 文本行的数据结构
interface IntroLine {
  chinese: string;
  english: string;
}

interface OpeningAnimationProps {
  assetsToLoad: string[];
  logoSrc: string;
  introductionLines: IntroLine[];
  onAnimationComplete: () => void;
}

/** 预加载单个资源 */
const loadAsset = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    let element: HTMLImageElement | HTMLVideoElement | HTMLLinkElement;
    if (url.endsWith('.mp4') || url.endsWith('.webm')) {
      element = document.createElement('video');
      element.src = url;
      element.preload = 'auto';
      element.addEventListener('canplaythrough', () => resolve(), { once: true });
      element.addEventListener('error', (e) => { console.warn(e); resolve(); });
      element.load();
    } else if (/\.(jpg|png|gif|webp|svg)$/i.test(url)) {
      element = new Image();
      element.src = url;
      element.onload = () => resolve();
      element.onerror = (e) => { console.warn(e); resolve(); };
    } else {
      resolve();
    }
  });
};


const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ 
  assetsToLoad, 
  logoSrc,
  introductionLines,
  onAnimationComplete 
}) => {
  // 状态
  const [logoVisible, setLogoVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState<IntroLine>(introductionLines[0]);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Ref (用于 useEffect 闭包)
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;
  
  const EXIT_FADE_DURATION = 700; // 0.7s 退出

  // 使用 useEffect 来运行整个动画和加载序列
  useEffect(() => {
    // 状态标志，用于 useEffect 闭包
    const assetsLoaded = { current: false };
    const animationFinished = { current: false };
    let exiting = false; // 本地标志，防止多次触发退出

    // 定义退出函数
    const attemptExit = () => {
      // 必须同时满足：1. 资源加载完毕 2. 动画序列播放完毕
      if (assetsLoaded.current && animationFinished.current && !exiting) {
        exiting = true; // 锁定
        setIsExiting(true); // 触发 CSS 退出动画
        
        // 在 CSS 动画结束后，调用父组件的回调
        setTimeout(() => {
          onAnimationCompleteRef.current?.();
        }, EXIT_FADE_DURATION);
      }
    };

    // --- 1. 启动资源加载 (在后台) ---
    Promise.all([...assetsToLoad, logoSrc].map(loadAsset))
      .then(() => {
        console.log('OpeningAnimation: 所有关键资源加载完毕。');
        assetsLoaded.current = true;
        attemptExit();
      })
      .catch((error) => {
        console.error('OpeningAnimation: 资源加载时发生错误:', error);
        assetsLoaded.current = true; // 即使失败也继续
        attemptExit();
      });

    // --- 2. 启动动画序列 (作为最小时间) ---
    const timers: number[] = [];
    const runAnimationSequence = () => {
      // 定义动画时间 (毫秒)
      const logoInDelay = 200;
      const logoInDuration = 1000;
      const textStartDelay = logoInDelay + logoInDuration; // 文本在 Logo 之后开始

      const textInDuration = 800;  // 对应 $text-in-duration
      const textHoldDuration = 2000; // 文本显示 2 秒
      const textOutDuration = 500; // 对应 $text-out-duration
      const textPause = 200;     // 句间停顿

      let currentDelay = logoInDelay;

      // 1. Logo 动画
      timers.push(window.setTimeout(() => {
        setLogoVisible(true);
      }, currentDelay));

      currentDelay = textStartDelay;

      // 2. 文本循环
      introductionLines.forEach((line) => {
        // (IN) 安排入场
        timers.push(window.setTimeout(() => {
          setCurrentLine(line); // 设置内容
          setIsTextVisible(true); // 触发入场动画
        }, currentDelay));
        
        currentDelay += textInDuration + textHoldDuration;

        // (OUT) 安排出场
        timers.push(window.setTimeout(() => {
          setIsTextVisible(false); // 触发离场动画
        }, currentDelay));
        
        currentDelay += textOutDuration + textPause; // 等待离场 + 停顿
      });

      // 3. 序列结束
      // 在所有动画（包括最后一句的出场）结束后，设置标志
      timers.push(window.setTimeout(() => {
        console.log('OpeningAnimation: 动画序列播放完毕。');
        animationFinished.current = true;
        attemptExit();
      }, currentDelay));
    };

    runAnimationSequence();

    // 清理函数
    return () => {
      timers.forEach(clearTimeout);
    };
    
  }, [assetsToLoad, logoSrc, introductionLines]); // 依赖项，确保只运行一次


  return (
    <div className={`${styles.container} ${isExiting ? styles.exiting : ''}`}>
      <div className={styles.content}>
        
        {/* Logo */}
        <img 
          src={logoSrc} 
          alt="Brand Logo" 
          className={`${styles.logo} ${logoVisible ? styles.visible : ''}`} 
        />

        {/* 文本容器 */}
        <div 
          className={`${styles.textContainer} ${isTextVisible ? styles.visible : ''}`}
        >
          <div key={currentLine.chinese}>
            <p className={styles.textLine}>{currentLine.chinese}</p>
            {currentLine.english && (
              <p className={styles.englishText}>{currentLine.english}</p>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OpeningAnimation;