// components/VideoLoader.tsx
import { useEffect, useRef } from 'react';

interface VideoLoaderProps {
  videoSrc: string;
  onProgress: (progress: number) => void;
  onComplete: () => void;
}

const VideoLoader: React.FC<VideoLoaderProps> = ({ videoSrc, onProgress, onComplete }) => {
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    console.log('VideoLoader: 开始加载视频', videoSrc);
    
    // 立即设置初始进度
    onProgress(0);
    progressRef.current = 0;
    startTimeRef.current = Date.now();
    
    // 立即创建并开始加载视频
    videoRef.current = document.createElement('video');
    const video = videoRef.current;
    
    // 设置视频属性
    video.preload = 'auto';
    video.src = videoSrc;
    
    // 监听视频加载事件
    const handleCanPlayThrough = () => {
      console.log('VideoLoader: 视频可以完整播放');
    };
    
    const handleError = (e: Event) => {
      console.error('VideoLoader: 视频加载错误', e);
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
      
      // 确保进度条平滑移动
      if (targetProgress > progressRef.current) {
        progressRef.current = targetProgress;
        onProgress(targetProgress);
        console.log('VideoLoader: 进度更新', targetProgress);
      }
      
      // 继续更新进度直到完成
      if (progressRef.current < 100) {
        animationRef.current = requestAnimationFrame(updateProgress);
      } else {
        console.log('VideoLoader: 进度完成');
        // 清理视频事件监听器
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('error', handleError);
        onComplete();
      }
    };
    
    // 立即开始更新进度
    animationRef.current = requestAnimationFrame(updateProgress);
    
    // 安全机制：4秒后强制完成
    const timeout = setTimeout(() => {
      console.warn('VideoLoader: 超时，强制完成');
      cancelAnimationFrame(animationRef.current);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
      onProgress(100);
      onComplete();
    }, 4000);
    
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationRef.current);
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        videoRef.current.removeEventListener('error', handleError);
      }
    };
  }, [videoSrc, onProgress, onComplete]);

  return null;
};

export default VideoLoader;