import { useEffect, useRef, useState } from 'react';
import styles from './Header.module.scss';

interface OpeningAnimationProps {
  onAnimationComplete?: () => void;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onAnimationComplete }) => {
  const [show, setShow] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    console.log('OpeningAnimation: 开场动画开始');
    
    // 初始进度
    setLoadingProgress(0);
    startTimeRef.current = Date.now();
    
    // 立即创建并开始加载视频
    videoRef.current = document.createElement('video');
    const video = videoRef.current;
    
    // 设置视频属性
    video.preload = 'auto';
    video.src = '/videos/hero-video.mp4';
    
    // 监听视频加载事件
    const handleCanPlayThrough = () => {
      console.log('OpeningAnimation: 视频可以完整播放');
    };
    
    const handleError = (e: Event) => {
      console.error('OpeningAnimation: 视频加载错误', e);
    };
    
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);
    
    // 立即开始加载视频
    video.load();
    
    // 更新进度的函数
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // 确保至少2秒的加载动画
      const minDuration = 2000; // 2秒
      const targetProgress = Math.min((elapsed / minDuration) * 100, 100);
      
      // 更新进度
      if (targetProgress > loadingProgress) {
        setLoadingProgress(targetProgress);
        console.log('OpeningAnimation: 进度更新', targetProgress);
      }
      
      // 继续更新进度直到完成
      if (targetProgress < 100) {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };
    
    // 立即开始更新进度
    animationRef.current = requestAnimationFrame(updateProgress);
    
    // 4秒后关闭动画，无论视频是否加载完成
    const timer = setTimeout(() => {
      console.log('OpeningAnimation: 动画时间到，准备关闭');
      cancelAnimationFrame(animationRef.current);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
      setShow(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationRef.current);
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        videoRef.current.removeEventListener('error', handleError);
      }
    };
  }, [onAnimationComplete]);

  if (!show) {
    return null;
  }

  return (
    <div className="opening-animation">
      <div className="animation-content">
        <h1 className="main-title">山河圖鑒</h1>
        <p className="subtitle">方寸屏間，萬里河山</p>
        <div className="loading-text">畫卷徐徐展開中...</div>
        
        {/* 进度条 */}
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
          <div className="progress-text">{Math.round(loadingProgress)}%</div>
        </div>
      </div>
    </div>
  );
};

export default OpeningAnimation;