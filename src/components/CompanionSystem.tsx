// src/components/CompanionSystem.tsx
import React, { useState, useEffect, useRef } from 'react';
import './CompanionSystem.scss';

interface BackgroundImage {
  id: number;
  src: string;
  alt: string;
}

const CompanionSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [whiteNoisePlaying, setWhiteNoisePlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  // 背景图片数据 - 请替换为你的实际图片路径
  const backgroundImages: BackgroundImage[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: `/images/companion/bg-${i + 1}.jpg`,
    alt: `风景背景图 ${i + 1}`
  }));

  // 番茄钟计时器
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // 可以添加完成提示音
      alert('番茄钟时间到！');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive, timeLeft]);

  // 背景图片轮播
  useEffect(() => {
    if (isOpen) {
      const imageInterval = window.setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length);
      }, 10000); // 每10秒切换一张图片

      return () => clearInterval(imageInterval);
    }
  }, [isOpen, backgroundImages.length]);

  // 白噪声控制
  useEffect(() => {
    if (audioRef.current) {
      if (whiteNoisePlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [whiteNoisePlaying]);

  const startTimer = () => {
    // 修复：不再重置时间，而是继续上次的计时
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerMinutes * 60);
  };

  // 修复：当选择预设时间时，同时更新 timerMinutes 和 timeLeft
  const setPresetTime = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimeLeft(minutes * 60);
    setTimerActive(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleWhiteNoise = () => {
    setWhiteNoisePlaying(!whiteNoisePlaying);
  };

  return (
    <>
      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src="/audio/white-noise.mp3"
        loop
        preload="metadata"
      />

      {/* 触发按钮 */}
      <button 
        className="companion-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '关闭陪伴' : '开启陪伴'}
      </button>

      {/* 陪伴系统面板 */}
      {isOpen && (
        <div className="companion-panel">
          <div className="companion-background">
            <img 
              src={backgroundImages[currentImageIndex].src} 
              alt={backgroundImages[currentImageIndex].alt}
            />
          </div>
          
          <div className="companion-content">
            {/* 番茄钟 */}
            <div className="pomodoro-section">
              <h3>番茄钟</h3>
              <div className="timer-display">
                {formatTime(timeLeft)}
              </div>
              <div className="timer-controls">
                {!timerActive ? (
                  <button onClick={startTimer} className="control-btn start">
                    开始
                  </button>
                ) : (
                  <button onClick={pauseTimer} className="control-btn pause">
                    暂停
                  </button>
                )}
                <button onClick={resetTimer} className="control-btn reset">
                  重置
                </button>
              </div>
              <div className="time-presets">
                <button onClick={() => setPresetTime(25)}>25分钟</button>
                <button onClick={() => setPresetTime(15)}>15分钟</button>
                <button onClick={() => setPresetTime(5)}>5分钟</button>
              </div>
            </div>

            {/* 白噪声控制 */}
            <div className="white-noise-section">
              <h3>白噪声</h3>
              <button 
                onClick={toggleWhiteNoise}
                className={`noise-btn ${whiteNoisePlaying ? 'active' : ''}`}
              >
                {whiteNoisePlaying ? '关闭白噪声' : '开启白噪声'}
              </button>
            </div>

            {/* 背景图片信息 */}
            <div className="image-info">
              <span>{backgroundImages[currentImageIndex].alt}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanionSystem;