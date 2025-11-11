// src/components/CompanionSystem.tsx
import React, { useState, useEffect, useRef } from 'react';
import './CompanionSystem.scss';

interface Theme {
  id: string;
  name: string;
  videoSrc: string;
  whiteNoiseSrc: string;
  posterImage?: string;
}

interface BackgroundImage {
  id: number;
  src: string;
  alt: string;
}

const CompanionSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [whiteNoisePlaying, setWhiteNoisePlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  // 主题定义
  const themes: Theme[] = [
    {
      id: 'mountain',
      name: '崇山',
      videoSrc: '/videos/companion/mountain.mp4',
      whiteNoiseSrc: '/audio/white-noise/mountain.mp3',
      posterImage: '/images/companion/mountain-poster.jpg'
    },
    {
      id: 'lake',
      name: '湖泊',
      videoSrc: '/videos/companion/lake.mp4',
      whiteNoiseSrc: '/audio/white-noise/lake.mp3',
      posterImage: '/images/companion/lake-poster.jpg'
    },
    {
      id: 'forest',
      name: '林间',
      videoSrc: '/videos/companion/forest.mp4',
      whiteNoiseSrc: '/audio/white-noise/forest.mp3',
      posterImage: '/images/companion/forest-poster.jpg'
    },
    {
      id: 'grassland',
      name: '草地',
      videoSrc: '/videos/companion/grassland.mp4',
      whiteNoiseSrc: '/audio/white-noise/grassland.mp3',
      posterImage: '/images/companion/grassland-poster.jpg'
    }
  ];

  // 背景图片数据 - 用于主题选择界面的轮播
  const backgroundImages: BackgroundImage[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: `/images/companion/bg-${i + 1}.jpg`,
    alt: `风景背景图 ${i + 1}`
  }));

  // 获取当前选中的主题
  const currentTheme = themes.find(theme => theme.id === selectedTheme);
  const pendingThemeData = themes.find(theme => theme.id === pendingTheme);

  // 番茄钟计时器
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      alert('番茄钟时间到！');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive, timeLeft]);

  // 主题选择界面的背景图片轮播
  useEffect(() => {
    if (isOpen && !selectedTheme && !pendingTheme) {
      const imageInterval = window.setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length);
      }, 10000); // 每10秒切换一张图片

      return () => clearInterval(imageInterval);
    }
  }, [isOpen, selectedTheme, pendingTheme, backgroundImages.length]);

  // 视频加载控制
  useEffect(() => {
    if (pendingTheme && pendingThemeData) {
      // 创建视频元素预加载
      const video = document.createElement('video');
      video.src = pendingThemeData.videoSrc;
      video.preload = 'auto';
      
      const handleLoadedData = () => {
        setSelectedTheme(pendingTheme);
        setPendingTheme(null);
      };
      
      const handleError = () => {
        console.error('视频加载失败:', pendingThemeData.videoSrc);
        setPendingTheme(null);
      };
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleLoadedData);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [pendingTheme, pendingThemeData]);

  // 视频控制 - 默认静音
  useEffect(() => {
    if (videoRef.current && selectedTheme && currentTheme) {
      // 设置视频静音
      videoRef.current.muted = true;
      videoRef.current.play().catch(console.error);
    }
  }, [selectedTheme, currentTheme]);

  // 白噪声控制
  useEffect(() => {
    if (audioRef.current && currentTheme) {
      // 设置白噪声源
      audioRef.current.src = currentTheme.whiteNoiseSrc;
      
      if (whiteNoisePlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [whiteNoisePlaying, currentTheme]);

  const startTimer = () => {
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerMinutes * 60);
  };

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

  const selectTheme = (themeId: string) => {
    setPendingTheme(themeId);
    setWhiteNoisePlaying(false);
  };

  const backToThemeSelection = () => {
    setSelectedTheme(null);
    setPendingTheme(null);
    setTimerActive(false);
    setWhiteNoisePlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const closeCompanion = () => {
    setIsOpen(false);
    setSelectedTheme(null);
    setPendingTheme(null);
    setTimerActive(false);
    setWhiteNoisePlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <>
      {/* 隐藏的音频元素 - 用于白噪声 */}
      <audio
        ref={audioRef}
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

      {/* 全屏陪伴系统 */}
      {isOpen && (
        <div className="companion-fullscreen">
          {/* 主题选择界面 - 当没有选中主题或正在加载主题时显示 */}
          {(!selectedTheme || pendingTheme) && (
            <div className="theme-selection-fullscreen">
              <div className="theme-background-fullscreen">
                <img 
                  src={backgroundImages[currentImageIndex].src} 
                  alt={backgroundImages[currentImageIndex].alt}
                />
              </div>
              <div className="theme-content-fullscreen">
                {pendingTheme ? (
                  <>
                    <h2>正在加载 {pendingThemeData?.name} 主题...</h2>
                    <div className="loading-indicator">
                      <div className="loading-spinner"></div>
                      <p>请稍候，正在准备沉浸式体验</p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>选择陪伴主题</h2>
                    <div className="theme-buttons-fullscreen">
                      {themes.map(theme => (
                        <button
                          key={theme.id}
                          className="theme-button"
                          onClick={() => selectTheme(theme.id)}
                        >
                          {theme.name}
                        </button>
                      ))}
                    </div>
                    <div className="image-info-fullscreen">
                      <span>{backgroundImages[currentImageIndex].alt}</span>
                    </div>
                  </>
                )}
                <button 
                  className="close-companion-btn"
                  onClick={closeCompanion}
                >
                  关闭陪伴系统
                </button>
              </div>
            </div>
          )}

          {/* 主题内容界面 - 只有当主题完全加载好后才显示 */}
          {selectedTheme && currentTheme && !pendingTheme && (
            <div className="theme-content-fullscreen">
              {/* 视频背景 - 全屏播放，默认静音 */}
              <video
                ref={videoRef}
                className="theme-video-fullscreen"
                src={currentTheme.videoSrc}
                poster={currentTheme.posterImage}
                loop
                autoPlay
                playsInline
                muted // 视频默认静音
              />
              
              {/* 返回按钮 - 固定在左上角 */}
              <button 
                className="back-button-top-left"
                onClick={backToThemeSelection}
              >
                ← 返回主题选择
              </button>
              
              {/* 番茄钟功能面板 */}
              <div className="pomodoro-panel-transparent">
                <div className="pomodoro-section-transparent">
                  <h3>番茄钟</h3>
                  <div className="timer-display">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="timer-controls-transparent">
                    {!timerActive ? (
                      <button onClick={startTimer} className="control-btn-transparent start">
                        开始
                      </button>
                    ) : (
                      <button onClick={pauseTimer} className="control-btn-transparent pause">
                        暂停
                      </button>
                    )}
                    <button onClick={resetTimer} className="control-btn-transparent reset">
                      重置
                    </button>
                  </div>
                  <div className="time-presets-transparent">
                    <button onClick={() => setPresetTime(25)}>25分钟</button>
                    <button onClick={() => setPresetTime(15)}>15分钟</button>
                    <button onClick={() => setPresetTime(5)}>5分钟</button>
                  </div>
                  
                  {/* 白噪声控制 */}
                  <div className="white-noise-section-transparent">
                    <button 
                      onClick={toggleWhiteNoise}
                      className={`white-noise-btn ${whiteNoisePlaying ? 'active' : ''}`}
                    >
                      {whiteNoisePlaying ? '关闭白噪声' : '开启白噪声'}
                    </button>
                  </div>
                </div>

                <div className="theme-info-transparent">
                  <span>当前主题: {currentTheme.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CompanionSystem;