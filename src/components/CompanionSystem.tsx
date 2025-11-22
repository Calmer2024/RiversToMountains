import React, {useState, useEffect, useRef} from 'react';
import './CompanionSystem.scss';
import {
  FaPlay, FaPause, FaRedo, FaVolumeUp, FaVolumeMute,
  FaBookOpen, FaTimes, FaAngleLeft, FaEyeSlash,
  FaCheck, FaClock, FaChevronRight
} from 'react-icons/fa';

// --- 数据定义 ---
const ZEN_QUOTES = [
  "行到水穷处，坐看云起时。",
  "清风明月本无价，近水远山皆有情。",
  "掬水月在手，弄花香满衣。",
  "心无挂碍，无挂碍故，无有恐怖。",
  "醉后不知天在水，满船清梦压星河。",
  "且放白鹿青崖间，须行即骑访名山。",
  "人生到处知何似，应似飞鸿踏雪泥。"
];

const articles = [
  { id: '1', title: '山居秋暝', author: '王维', content: '空山新雨后，天气晚来秋。明月松间照，清泉石上流。竹喧归浣女，莲动下渔舟。随意春芳歇，王孙自可留。' },
  { id: '2', title: '赤壁赋', author: '苏轼', content: '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。' },
  { id: '3', title: '归园田居', author: '陶渊明', content: '种豆南山下，草盛豆苗稀。晨兴理荒秽，带月荷锄归。道狭草木长，夕露沾我衣。衣沾不足惜，但使愿无违。' },
];

interface Theme {
  id: string;
  name: string;
  desc: string;
  level: string; // 关卡名
  chapter: string; // 章节号
  videoSrc: string;
  whiteNoiseSrc: string;
  posterImage: string;
}

const themes: Theme[] = [
  { id: 'mountain', name: '崇山', desc: '听松涛阵阵，观云卷云舒', level: '第一回', chapter: '01', videoSrc: '/videos/companion/mountain.mp4', whiteNoiseSrc: '/audio/white-noise/mountain.mp3', posterImage: '/images/companion/bg-1.jpg' },
  { id: 'sky', name: '苍穹', desc: '星河欲转千帆舞', level: '第二回', chapter: '02', videoSrc: '/videos/companion/sky.mp4', whiteNoiseSrc: '/audio/white-noise/lake.mp3', posterImage: '/images/companion/bg-2.jpg' },
  { id: 'forest', name: '深林', desc: '林深见鹿，清幽静谧', level: '第三回', chapter: '03', videoSrc: '/videos/companion/forest.mp4', whiteNoiseSrc: '/audio/white-noise/forest.mp3', posterImage: '/images/companion/bg-3.jpg' },
  { id: 'grassland', name: '原野', desc: '风吹草低见牛羊', level: '第四回', chapter: '04', videoSrc: '/videos/companion/grassland.mp4', whiteNoiseSrc: '/audio/white-noise/grassland.mp3', posterImage: '/images/companion/bg-4.jpg' }
];

interface CompanionSystemProps {
  onStateChange?: (isCompanionActive: boolean) => void
}

const CompanionSystem: React.FC<CompanionSystemProps> = ({ onStateChange }) => {
  // --- 状态管理 ---
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  // 番茄钟
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  
  // 自定义时间交互状态
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const [customInputVal, setCustomInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [showCompletionAnim, setShowCompletionAnim] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(ZEN_QUOTES[0]);

  // 媒体 & 界面
  const [whiteNoisePlaying, setWhiteNoisePlaying] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(articles[0]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  const currentThemeData = themes.find(theme => theme.id === selectedTheme);
  const pendingThemeData = themes.find(theme => theme.id === pendingTheme);

  // --- 逻辑 Hook ---
  
  // 1. 番茄钟
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleTimerComplete();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeLeft]);

  const handleTimerComplete = () => {
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setShowCompletionAnim(true);
    setTimeout(() => setShowCompletionAnim(false), 4000);
  };

  // 2. 自动聚焦输入框
  useEffect(() => {
    if (isCustomInputOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustomInputOpen]);

  // 3. 媒体加载与播放
  useEffect(() => {
    if (pendingTheme && pendingThemeData) {
      const video = document.createElement('video');
      video.src = pendingThemeData.videoSrc;
      video.preload = 'auto';
      const handleLoadedData = () => {
        setTimeout(() => {
          setSelectedTheme(pendingTheme);
          setPendingTheme(null);
          refreshQuote();
        }, 1200);
      };
      const handleError = () => setPendingTheme(null);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [pendingTheme, pendingThemeData]);

  useEffect(() => {
    if (videoRef.current && selectedTheme) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [selectedTheme]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentThemeData && whiteNoisePlaying) {
      // 防止重复设置 src 导致音频重置
      // 这里简单拼接判断，可能需要更严谨的路径比较
      if (!audio.src.includes(currentThemeData.whiteNoiseSrc)) {
        audio.src = currentThemeData.whiteNoiseSrc;
      }
      audio.play().catch(() => { /* 忽略自动播放限制报错 */ });
    } else {
      // 其他所有情况（包括离开界面），都强制暂停
      audio.pause();
    }
  }, [whiteNoisePlaying, currentThemeData]);


  // --- 交互函数 ---
  const refreshQuote = () => setCurrentQuote(ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)]);
  
  const startTimer = () => { setTimerActive(true); refreshQuote(); };
  const pauseTimer = () => setTimerActive(false);
  const resetTimer = () => { setTimerActive(false); setTimeLeft(timerMinutes * 60); refreshQuote(); };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresetTime = (min: number) => {
    setTimerMinutes(min);
    setTimeLeft(min * 60);
    setTimerActive(false);
    setIsCustomInputOpen(false);
  };

  const submitCustomTime = () => {
    const val = parseInt(customInputVal);
    if (!isNaN(val) && val > 0 && val <= 180) {
      handlePresetTime(val);
    }
    setCustomInputVal('');
    setIsCustomInputOpen(false);
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submitCustomTime();
    if (e.key === 'Escape') setIsCustomInputOpen(false);
  };

  const backToSelection = () => {
    setSelectedTheme(null);
    setTimerActive(false);
    setWhiteNoisePlaying(false);
    setIsReading(false);
    setIsUiHidden(false);
    onStateChange?.(false);
  };

  const selectTheme = (themeId: string) => {
    setPendingTheme(themeId);
    setWhiteNoisePlaying(false);
    onStateChange?.(true);
  };

  return (
    <div className="companion-app">
      <audio ref={audioRef} loop preload="auto"/>

      {/* ================= 1. 关卡选择界面 ================= */}
      {(!selectedTheme || pendingTheme) && (
        <div className={`selection-layer ${pendingTheme ? 'loading-mode' : ''}`}>
          
          {/* 装饰背景层 */}
          <div className="deco-layer">
            <div className="ink-mountain-silhouette"></div>
            <div className="falling-leaves">
               {[...Array(12)].map((_, i) => (
                 <div key={i} className={`leaf leaf-${i + 1}`}></div>
               ))}
            </div>
            <div className="flying-birds"></div>
            <div className="corner-frame top-left"></div>
            <div className="corner-frame bottom-right"></div>
          </div>

          <div className="selection-content">
            {pendingTheme ? (
              /* 加载动画 */
              <div className="loading-container">
                 <div className="ink-spinner">
                   <div className="drop"></div>
                   <div className="ripple"></div>
                 </div>
                 <div className="loading-text-vertical">
                   <span>正</span><span>在</span><span>入</span><span>画</span>
                 </div>
                 <p className="loading-sub">{pendingThemeData?.name}</p>
              </div>
            ) : (
              <>
                <div className="header-area">
                    <div className="chapter-mark">世外静域</div>
                    <h1 className="main-title">清风欲引君何去</h1>
                    <div className="deco-line"></div>
                  </div>  
                <div className="level-scroll-view">
                  

                  <div className="scroll-track">
                    {themes.map((theme, idx) => (
                      <div
                        key={theme.id}
                        className={`level-card ${hoveredTheme === theme.id ? 'expanded' : ''}`}
                        onMouseEnter={() => setHoveredTheme(theme.id)}
                        onMouseLeave={() => setHoveredTheme(null)}
                        onClick={() => selectTheme(theme.id)}
                      >
                        <div className="level-bg" style={{backgroundImage: `url(${theme.posterImage})`}}></div>
                        <div className="level-mask"></div>
                        
                        <div className="chapter-index">{(idx + 1).toString().padStart(2, '0')}</div>

                        <div className="level-info">
                          <div className="vertical-text-group">
                            <div className="level-badge">{theme.level}</div>
                            <h3 className="level-name">{theme.name}</h3>
                          </div>
                          <div className="desc-group">
                            <p className="level-desc">{theme.desc}</p>
                            <div className="enter-btn"><FaChevronRight /> 入画</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= 2. 沉浸体验层 ================= */}
      {selectedTheme && currentThemeData && !pendingTheme && (
        <div className="immersive-layer">
          <video
            ref={videoRef}
            className="immersive-video"
            src={currentThemeData.videoSrc}
            loop autoPlay playsInline muted
          />
          <div className="video-overlay" />

          {/* 盖章动画 */}
          {showCompletionAnim && (
             <div className="completion-overlay">
                <div className="stamp-animation">
                   <div className="stamp-circle"></div>
                   <div className="stamp-text">专注<br/>达成</div>
                </div>
             </div>
          )}

          {/* 唤醒层 */}
          <div 
            className={`wake-area ${isUiHidden ? 'active' : ''}`} 
            onClick={() => setIsUiHidden(false)}
          >
              {/* 唤醒提示放在中下方 */}
             {isUiHidden && <div className="wake-hint">点击任意处唤醒</div>}
          </div>

          {/* UI 容器 */}
          <div className={`ui-container ${isUiHidden ? 'hidden' : ''}`}>
            
            {/* 顶部 */}
            <header className="top-bar">
              <button className="icon-btn" onClick={backToSelection}><FaAngleLeft /> 归去</button>
              <div className="theme-badge">
                 {currentThemeData.name}
              </div>
              <button className="icon-btn hide-btn" onClick={(e) => { e.stopPropagation(); setIsUiHidden(true); }}>
                <FaEyeSlash /> 沉浸
              </button>
            </header>

            {/* 中央番茄钟 */}
            <main className="timer-section">
              <div className="timer-glass-card">
                <div className="zen-circle">
                  <svg className="progress-ring" width="260" height="260">
                    <circle className="bg" r="120" cx="130" cy="130" fill="none" strokeWidth="3"/>
                    <circle
                      className="progress"
                      r="120" cx="130" cy="130"
                      fill="none"
                      strokeWidth="3"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 120}`,
                        strokeDashoffset: (2 * Math.PI * 120) * (1 - timeLeft / (timerMinutes * 60))
                      }}
                    />
                  </svg>
                  
                  <div className="timer-content">
                    {/* 字体优化 */}
                    <div className="time-display">
                        {formatTime(timeLeft).replace(':', ' : ')}
                    </div>
                    <div className="timer-label">{timerActive ? ' · 专注 · ' : ' · 准备 · '}</div>
                  </div>
                </div>

                <div className="quote-display">{currentQuote}</div>
                
                <div className="control-bar">
                  {!timerActive ?
                      <button className="ctrl-btn start" onClick={startTimer}><FaPlay style={{marginLeft: '4px'}} /></button> :
                      <button className="ctrl-btn pause" onClick={pauseTimer}><FaPause /></button>
                  }
                  {/* 让重置按钮稍微大一点，视觉平衡 */}
                  <button className="ctrl-btn reset" onClick={resetTimer}><FaRedo /></button>
                </div>
              </div>
            </main>

            {/* 底部 Dock */}
            <footer className="bottom-dock">
              <div className="glass-panel">
                <div className="presets">
                  {[5, 15, 25, 45].map(min => (
                    <button 
                      key={min} 
                      className={timerMinutes === min ? 'active' : ''} 
                      onClick={() => handlePresetTime(min)}
                    >
                      {min}
                    </button>
                  ))}
                  
                  <div className={`custom-time-drawer ${isCustomInputOpen ? 'open' : ''}`}>
                    {!isCustomInputOpen ? (
                      <button className="custom-trigger" onClick={() => setIsCustomInputOpen(true)}>
                          <FaClock /> 自定义
                      </button>
                    ) : (
                      <div className="input-group">
                        <input 
                          ref={inputRef}
                          type="number" 
                          placeholder="分"
                          value={customInputVal}
                          onChange={e => setCustomInputVal(e.target.value)}
                          onKeyDown={handleCustomKeyDown}
                          onBlur={() => !customInputVal && setIsCustomInputOpen(false)}
                        />
                        <button className="confirm-btn" onClick={submitCustomTime}><FaCheck /></button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="separator"></div>
                
                <div className="toggles">
                  <button onClick={() => setWhiteNoisePlaying(!whiteNoisePlaying)}>
                    {whiteNoisePlaying ? <FaVolumeUp /> : <FaVolumeMute />}
                  </button>
                  <button onClick={() => setIsReading(!isReading)}><FaBookOpen /></button>
                </div>
              </div>
            </footer>
          </div>

          {/* 阅读侧边栏 */}
          <aside className={`reading-scroll ${isReading ? 'unrolled' : ''}`}>
             <div className="scroll-bar top"></div>
             <div className="scroll-paper">
               <div className="paper-texture"></div>
               <div className="panel-header">
                 <div className="stamp-seal">伴读</div>
                 <button className="close-btn" onClick={() => setIsReading(false)}><FaTimes /></button>
               </div>

               <nav className="article-tabs">
                 {articles.map(a => (
                   <button key={a.id} className={currentArticle.id === a.id ? 'active' : ''} onClick={() => setCurrentArticle(a)}>
                     {a.title}
                   </button>
                 ))}
               </nav>
               
               <article className="article-body">
                 <h2 className="art-title">{currentArticle.title}</h2>
                 <p className="art-author">{currentArticle.author}</p>
                 <div className="art-content">
                   {currentArticle.content.split('。').map((s, i) => 
                     s && <p key={i} style={{animationDelay: `${i * 0.3}s`}}>{s}。</p>
                   )}
                 </div>
               </article>
             </div>
             <div className="scroll-bar bottom"></div>
          </aside>

        </div>
      )}
    </div>
  );
};

export default CompanionSystem;