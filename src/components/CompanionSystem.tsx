import React, {useState, useEffect, useRef} from 'react';
import './CompanionSystem.scss';
// 引入图标 (确保你的项目中安装了 react-icons)
import {
  FaPlay, FaPause, FaRedo, FaVolumeUp, FaVolumeMute,
  FaBookOpen, FaTimes, FaAngleLeft, FaEye, FaEyeSlash,
  FaClock, FaImage
} from 'react-icons/fa';

// --- 类型定义 ---
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

// --- 假数据 ---
const articles = [
  {
    id: '1',
    title: '山居秋暝',
    author: '王维',
    content: '空山新雨后，天气晚来秋。明月松间照，清泉石上流。竹喧归浣女，莲动下渔舟。随意春芳歇，王孙自可留。'
  },
  {
    id: '2',
    title: '赤壁赋',
    author: '苏轼',
    content: '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。'
  },
  {
    id: '3',
    title: '归园田居',
    author: '陶渊明',
    content: '种豆南山下，草盛豆苗稀。晨兴理荒秽，带月荷锄归。道狭草木长，夕露沾我衣。衣沾不足惜，但使愿无违。'
  },
];

interface CompanionSystemProps {
  onStateChange?: (isCompanionActive: boolean) => void
}

const CompanionSystem: React.FC<CompanionSystemProps> = ({ onStateChange }) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);

  // 番茄钟状态
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // 媒体状态
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [whiteNoisePlaying, setWhiteNoisePlaying] = useState(false);

  // 界面状态
  const [isReading, setIsReading] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false); // 沉浸模式/屏保
  const [currentArticle, setCurrentArticle] = useState(articles[0]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  // --- 配置数据 ---
  const themes: Theme[] = [
    {
      id: 'mountain',
      name: '崇山',
      videoSrc: '/videos/companion/mountain.mp4',
      whiteNoiseSrc: '/audio/white-noise/mountain.mp3',
      posterImage: '/images/companion/bg-1.jpg'
    },
    {
      id: 'sky',
      name: '天空',
      videoSrc: '/videos/companion/sky.mp4',
      whiteNoiseSrc: '/audio/white-noise/lake.mp3',
      posterImage: '/images/companion/bg-5.jpg'
    },
    {
      id: 'forest',
      name: '林间',
      videoSrc: '/videos/companion/forest.mp4',
      whiteNoiseSrc: '/audio/white-noise/forest.mp3',
      posterImage: '/images/companion/bg-6.jpg'
    },
    {
      id: 'grassland',
      name: '草地',
      videoSrc: '/videos/companion/grassland.mp4',
      whiteNoiseSrc: '/audio/white-noise/grassland.mp3',
      posterImage: '/images/companion/bg-1.jpg'
    }
  ];

  const backgroundImages: BackgroundImage[] = Array.from({length: 7}, (_, i) => ({
    id: i + 1,
    src: `/images/companion/bg-${i + 1}.jpg`,
    alt: `风景 · ${i + 1}`
  }));

  const currentTheme = themes.find(theme => theme.id === selectedTheme);
  const pendingThemeData = themes.find(theme => theme.id === pendingTheme);

  // --- Effects ---

  // 1. 番茄钟逻辑
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // 播放一个提示音或者柔和的提醒会更好，这里暂时保留逻辑
      console.log('Time is up');
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  // 2. 背景图轮播 (在选择界面)
  useEffect(() => {
    if (!selectedTheme && !pendingTheme) {
      const imageInterval = window.setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length);
      }, 8000); // 稍微慢一点，8秒
      return () => clearInterval(imageInterval);
    }
  }, [selectedTheme, pendingTheme, backgroundImages.length]);

  // 3. 视频预加载逻辑
  useEffect(() => {
    if (pendingTheme && pendingThemeData) {
      const video = document.createElement('video');
      video.src = pendingThemeData.videoSrc;
      video.preload = 'auto';

      const handleLoadedData = () => {
        // 给人一点缓冲时间的假象，避免闪烁
        setTimeout(() => {
          setSelectedTheme(pendingTheme);
          setPendingTheme(null);
        }, 800);
      };

      const handleError = () => {
        console.error("Video load failed");
        setPendingTheme(null);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [pendingTheme, pendingThemeData]);

  // 4. 视频播放控制
  useEffect(() => {
    if (videoRef.current && selectedTheme && currentTheme) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
    }
  }, [selectedTheme, currentTheme]);

  // 5. 白噪音控制
  useEffect(() => {
    if (audioRef.current && currentTheme) {
      // 如果切主题了，换源
      if (audioRef.current.src !== window.location.origin + currentTheme.whiteNoiseSrc) {
        audioRef.current.src = currentTheme.whiteNoiseSrc;
      }

      if (whiteNoisePlaying) {
        audioRef.current.play().catch(console.error);
        // 淡入效果可以后续加
      } else {
        audioRef.current.pause();
      }
    }
  }, [whiteNoisePlaying, currentTheme]);


  // --- 交互函数 ---
  const startTimer = () => setTimerActive(true);
  const pauseTimer = () => setTimerActive(false);
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

  const selectTheme = (themeId: string) => {
    setPendingTheme(themeId);
    setWhiteNoisePlaying(false); // 默认先关声音，让用户自己开，或者保持之前状态
    onStateChange?.(true);
  };

  const backToThemeSelection = () => {
    setSelectedTheme(null);
    setPendingTheme(null);
    setTimerActive(false);
    setWhiteNoisePlaying(false);
    setIsReading(false);
    setIsUiHidden(false);
    onStateChange?.(false);
  };

  return (
    <div className="companion-app">
      <audio ref={audioRef} loop preload="metadata"/>

      {/* ================= 主题选择层 (Theme Selection) ================= */}
      {(!selectedTheme || pendingTheme) && (
        <div className={`selection-layer ${pendingTheme ? 'loading-mode' : ''}`}>
          {/* 背景轮播 */}
          <div className="bg-slideshow">
            {backgroundImages.map((img, idx) => (
              <div
                key={img.id}
                className={`bg-slide ${idx === currentImageIndex ? 'active' : ''}`}
                style={{backgroundImage: `url(${img.src})`}}
              />
            ))}
            <div className="bg-overlay" />
          </div>

          <div className="selection-content">
            {pendingTheme ? (
              <div className="loading-container">
                <div className="spinner-ring"></div>
                <p className="loading-text">正在潜入{pendingThemeData?.name}...</p>
              </div>
            ) : (
              <>
                <h1 className="main-title">此刻，你想去哪里？</h1>
                <div className="cards-grid">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      className="theme-card"
                      onClick={() => selectTheme(theme.id)}
                    >
                      <div
                        className="card-bg"
                        style={{backgroundImage: `url(${theme.posterImage})`}}
                      />
                      <div className="card-content">
                        <span className="card-name">{theme.name}</span>
                        <span className="card-action">Enter</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= 沉浸体验层 (Immersive View) ================= */}
      {selectedTheme && currentTheme && !pendingTheme && (
        <div className="immersive-layer">
          {/* 视频背景 */}
          <video
            ref={videoRef}
            className="immersive-video"
            src={currentTheme.videoSrc}
            poster={currentTheme.posterImage}
            loop
            autoPlay
            playsInline
            muted
          />
          <div className="video-overlay" />

          {/* 核心 UI 容器 */}
          <div className={`ui-container ${isUiHidden ? 'hidden' : ''}`}>

            {/* 顶部栏 */}
            <header className="top-bar">
              <button className="icon-btn back-btn" onClick={backToThemeSelection} title="离开">
                <FaAngleLeft /> <span>返回</span>
              </button>

              <div className="theme-badge">
                <FaImage className="icon" /> {currentTheme.name}
              </div>

              <button className="icon-btn hide-ui-btn" onClick={() => setIsUiHidden(true)} title="沉浸模式">
                <FaEyeSlash />
              </button>
            </header>

            {/* 中央番茄钟 */}
            <main className="timer-section">
              <div className="timer-ring">
                <div className="time-text">{formatTime(timeLeft)}</div>
                <div className="timer-status">{timerActive ? '专注中...' : '准备就绪'}</div>
              </div>

              <div className="timer-actions">
                {!timerActive ? (
                  <button className="action-btn start" onClick={startTimer}><FaPlay /></button>
                ) : (
                  <button className="action-btn pause" onClick={pauseTimer}><FaPause /></button>
                )}
                <button className="action-btn reset" onClick={resetTimer}><FaRedo /></button>
              </div>
            </main>

            {/* 底部 Dock 栏 */}
            <footer className="bottom-dock">
              {/* 左侧：时间预设 */}
              <div className="dock-group presets">
                <button className={timerMinutes === 5 ? 'active' : ''} onClick={() => setPresetTime(5)}>05</button>
                <button className={timerMinutes === 25 ? 'active' : ''} onClick={() => setPresetTime(25)}>25</button>
                <button className={timerMinutes === 45 ? 'active' : ''} onClick={() => setPresetTime(45)}>45</button>
              </div>

              <div className="divider"></div>

              {/* 右侧：功能开关 */}
              <div className="dock-group controls">
                <button
                  className={`dock-btn ${whiteNoisePlaying ? 'active' : ''}`}
                  onClick={() => setWhiteNoisePlaying(!whiteNoisePlaying)}
                  title="白噪音"
                >
                  {whiteNoisePlaying ? <FaVolumeUp /> : <FaVolumeMute />}
                </button>

                <button
                  className={`dock-btn ${isReading ? 'active' : ''}`}
                  onClick={() => setIsReading(!isReading)}
                  title="阅读模式"
                >
                  <FaBookOpen />
                </button>
              </div>
            </footer>
          </div>

          {/* 唤醒按钮 (仅在 UI 隐藏时显示) */}
          <div className={`wake-area ${!isUiHidden ? 'inactive' : ''}`} onClick={() => setIsUiHidden(false)}>
            <div className="wake-hint">点击屏幕唤醒界面</div>
          </div>

          {/* 阅读侧边栏 (Slide Over) */}
          <aside className={`reading-panel ${isReading ? 'open' : ''}`}>
            <div className="panel-header">
              <h3>伴读诗文</h3>
              <button className="close-panel-btn" onClick={() => setIsReading(false)}><FaTimes /></button>
            </div>

            <nav className="article-tabs">
              {articles.map(a => (
                <button
                  key={a.id}
                  className={currentArticle.id === a.id ? 'active' : ''}
                  onClick={() => setCurrentArticle(a)}
                >
                  {a.title}
                </button>
              ))}
            </nav>

            <article className="article-body">
              <div className="scroll-content">
                <h2 className="art-title">{currentArticle.title}</h2>
                <div className="art-author">{currentArticle.author}</div>
                <div className="art-divider"></div>
                <div className="art-text">
                  {currentArticle.content.split('。').map((sentence, i) =>
                    sentence.trim() && <p key={i}>{sentence.trim()}。</p>
                  )}
                </div>
              </div>
            </article>
          </aside>

        </div>
      )}
    </div>
  );
};

export default CompanionSystem;