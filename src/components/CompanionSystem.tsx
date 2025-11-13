import React, {useState, useEffect, useRef} from 'react';
import './CompanionSystem.scss';
// 引入图标
import {
  FaPlay, FaPause, FaRedo, FaVolumeUp, FaVolumeMute,
  FaBookOpen, FaTimes, FaAngleLeft, FaEye, FaEyeSlash
} from 'react-icons/fa';

// ... (Theme 和 BackgroundImage 接口定义不变) ...
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

// ----------------------------------------------------
// 假的文章数据
// ----------------------------------------------------
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

// ----------------------------------------------------
// 陪伴系统主组件
// ----------------------------------------------------
interface CompanionSystemProps {
  onStateChange?: (isCompanionActive: boolean) => void
}

const CompanionSystem: React.FC<CompanionSystemProps> = ({ onStateChange }) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [whiteNoisePlaying, setWhiteNoisePlaying] = useState(false);

  // ✨ 新增状态：阅读模式 和 屏保模式
  const [isReading, setIsReading] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(articles[0]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  // ... (themes 和 backgroundImages 数据不变) ...
  const themes: Theme[] = [
    {
      id: 'mountain',
      name: '崇山',
      videoSrc: '/videos/companion/mountain.mp4',
      whiteNoiseSrc: '/audio/white-noise/mountain.mp3',
      posterImage: '/images/companion/bg-1.jpg'
    },
    {
      id: 'lake',
      name: '湖泊',
      videoSrc: '/videos/companion/lake.mp4',
      whiteNoiseSrc: '/audio/white-noise/lake.mp3',
      posterImage: '/images/companion/bg-4.jpg'
    },
    {
      id: 'forest',
      name: '林间',
      videoSrc: '/videos/companion/forest.mp4',
      whiteNoiseSrc: '/audio/white-noise/forest.mp3',
      posterImage: '/images/companion/bg-2.jpg'
    },
    {
      id: 'grassland',
      name: '草地',
      videoSrc: '/videos/companion/grassland.mp4',
      whiteNoiseSrc: '/audio/white-noise/grassland.mp3',
      posterImage: '/images/companion/bg-21.jpg'
    }
  ];
  const backgroundImages: BackgroundImage[] = Array.from({length: 20}, (_, i) => ({
    id: i + 1,
    src: `/images/companion/bg-${i + 1}.jpg`,
    alt: `风景背景图 ${i + 1}`
  }));

  const currentTheme = themes.find(theme => theme.id === selectedTheme);
  const pendingThemeData = themes.find(theme => theme.id === pendingTheme);

  // ... (番茄钟 useEffect 不变) ...
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // 提醒可以更优雅，但暂时保留
      alert('番茄钟时间到！');
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  // ... (背景图轮播 useEffect 不变) ...
  useEffect(() => {
    if (!selectedTheme && !pendingTheme) {
      const imageInterval = window.setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length);
      }, 10000);
      return () => clearInterval(imageInterval);
    }
  }, [selectedTheme, pendingTheme, backgroundImages.length]);

  // ... (视频加载控制 useEffect 不变) ...
  useEffect(() => {
    if (pendingTheme && pendingThemeData) {
      const video = document.createElement('video');
      video.src = pendingThemeData.videoSrc;
      video.preload = 'auto';
      const handleLoadedData = () => {
        setSelectedTheme(pendingTheme);
        setPendingTheme(null);
      };
      const handleError = () => {
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

  // ... (视频控制 useEffect 不变) ...
  useEffect(() => {
    if (videoRef.current && selectedTheme && currentTheme) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(console.error);
    }
  }, [selectedTheme, currentTheme]);

  // ... (白噪声控制 useEffect 不变) ...
  useEffect(() => {
    if (audioRef.current && currentTheme) {
      audioRef.current.src = currentTheme.whiteNoiseSrc;
      if (whiteNoisePlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [whiteNoisePlaying, currentTheme]);


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
  const toggleWhiteNoise = () => setWhiteNoisePlaying(!whiteNoisePlaying);
  const selectTheme = (themeId: string) => {
    setPendingTheme(themeId);
    setWhiteNoisePlaying(false);
    onStateChange?.(true);

  };
  const backToThemeSelection = () => {
    setSelectedTheme(null);
    setPendingTheme(null);
    setTimerActive(false);
    setWhiteNoisePlaying(false);
    setIsReading(false); // 重置阅读状态
    setIsUiHidden(false); // 重置UI隐藏状态
    if (videoRef.current) videoRef.current.pause();
    if (audioRef.current) audioRef.current.pause();
    onStateChange?.(false);

  };

  return (
    <>
      <audio ref={audioRef} loop preload="metadata"/>

      <div className="companion-fullscreen">
        {/* 主题选择界面 */}
        {(!selectedTheme || pendingTheme) && (
          <div className="theme-selection-fullscreen">
            {/* 黑暗遮罩层，让背景变暗，凸显文字 */}
            <div className="theme-background-overlay"/>
            <div className="theme-background-fullscreen">
              <img
                src={backgroundImages[currentImageIndex].src}
                alt={backgroundImages[currentImageIndex].alt}
              />
            </div>
            <div className="theme-content-fullscreen">
              {pendingTheme ? (
                <>
                  <h2>{pendingThemeData?.name}</h2>
                  <div className="loading-indicator">
                    <div className="loading-spinner"></div>
                    <p>加载山河中...</p>
                  </div>
                </>
              ) : (
                <>
                  <h2>选择一处宁静</h2>
                  <div className="theme-buttons-fullscreen">
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        className="theme-button"
                        // ✨ 用海报做背景
                        style={{backgroundImage: `url(${theme.posterImage})`}}
                        onClick={() => selectTheme(theme.id)}
                      >
                        <span>{theme.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="image-info-fullscreen">
                    <span>{backgroundImages[currentImageIndex].alt}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 主题内容界面 */}
        {selectedTheme && currentTheme && !pendingTheme && (
          <div className="theme-content-wrapper">
            <video
              ref={videoRef}
              className="theme-video-fullscreen"
              src={currentTheme.videoSrc}
              poster={currentTheme.posterImage}
              loop
              autoPlay
              playsInline
              muted // 视频始终静音
            />

            {/* 视频上的暗色渐变，确保UI在亮色视频上也清晰 */}
            <div className="video-overlay-gradient"/>

            {/* ✨ 整体UI容器 (方便“屏保模式”一键隐藏) */}
            <div className={`companion-ui-container ${isUiHidden ? 'hidden' : ''}`}>

              {/* 左上角返回按钮 */}
              <button
                className="control-button top-left"
                onClick={backToThemeSelection}
                title="返回主题选择"
              >
                <FaAngleLeft/>
              </button>

              {/* 右上角控制按钮 */}
              <div className="top-right-controls">
                <button
                  className="control-button"
                  onClick={() => setIsReading(!isReading)}
                  title="阅读"
                >
                  {isReading ? <FaTimes/> : <FaBookOpen/>}
                </button>
                <button
                  className="control-button"
                  onClick={() => setIsUiHidden(true)}
                  title="沉浸模式 (屏保)"
                >
                  <FaEyeSlash/>
                </button>
              </div>

              {/* 番茄钟 (居中) */}
              <div className="pomodoro-panel-minimal">
                <div className="timer-display">
                  {formatTime(timeLeft)}
                </div>
                <div className="timer-controls-minimal">
                  {!timerActive ? (
                    <button onClick={startTimer} className="control-button start" title="开始">
                      <FaPlay/>
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="control-button pause" title="暂停">
                      <FaPause/>
                    </button>
                  )}
                  <button onClick={resetTimer} className="control-button reset" title="重置">
                    <FaRedo/>
                  </button>
                </div>
              </div>

              {/* 底部控制栏 */}
              <div className="bottom-controls">
                <div className="time-presets-minimal">
                  <button onClick={() => setPresetTime(25)}>25分</button>
                  <button onClick={() => setPresetTime(15)}>15分</button>
                  <button onClick={() => setPresetTime(5)}>5分</button>
                </div>
                <div className="white-noise-section-minimal">
                  <button
                    onClick={toggleWhiteNoise}
                    className={`control-button ${whiteNoisePlaying ? 'active' : ''}`}
                    title="白噪音"
                  >
                    {whiteNoisePlaying ? <FaVolumeUp/> : <FaVolumeMute/>}
                  </button>
                </div>
                <div className="theme-info-minimal">
                  <span>{currentTheme.name}</span>
                </div>
              </div>
            </div>

            {/* ✨ "显示UI" 按钮 (仅在UI隐藏时显示) */}
            {isUiHidden && (
              <button
                className="show-ui-button"
                onClick={() => setIsUiHidden(false)}
                title="显示界面"
              >
                <FaEye/>
              </button>
            )}

            {/* ✨ 阅读面板 (暗黑玻璃书房) */}
            <div className={`article-panel ${isReading ? 'open' : ''}`}>
              <div className="article-header">
                <div className="article-tabs">
                  {articles.map(a => (
                    <button
                      key={a.id}
                      className={currentArticle.id === a.id ? 'active' : ''}
                      onClick={() => setCurrentArticle(a)}
                    >
                      {a.title}
                    </button>
                  ))}
                </div>
                <button
                  className="control-button close-article"
                  onClick={() => setIsReading(false)}
                >
                  <FaTimes/>
                </button>
              </div>
              <div className="article-content">
                <h3>{currentArticle.title}</h3>
                <h4>{currentArticle.author}</h4>
                {currentArticle.content.split('。').map((sentence, i) =>
                  sentence.trim() && <p key={i}>{sentence.trim()}。</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default CompanionSystem;