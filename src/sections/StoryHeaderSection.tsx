import React, { 
  useState, 
  useEffect, 
  useRef, 
  type FC 
} from 'react';
import styles from './StoryHeaderSection.module.scss';
import { useStoryMusic } from '../context/StoryMusicContext';

// --- 图标组件 ---
const IconMusic = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
);

const IconMusicOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2z" />
  </svg>
);

export const StoryHeaderSection: FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleGroupRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    const { isPlaying, togglePlay, setIsPlaying } = useStoryMusic();
    
    // --- 记录用户是否点击过 ---
    // 默认为 false，只有点击后才变为 true
    const [hasInteracted, setHasInteracted] = useState(false);

    const handleMusicClick = () => {
        togglePlay();
        // 用户点击了，气泡永久消失
        setHasInteracted(true);
    };

    // --- IntersectionObserver 逻辑 ---
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const newVisibility = entry.isIntersecting;
                setIsVisible(newVisibility);

                if (!newVisibility && entry.boundingClientRect.top >= 0) {
                     // 向上离开，停止播放
                     setIsPlaying(false);
                }
            },
            { threshold: 0.0 }
        );

        observer.observe(section);
        return () => {
            if (section) observer.unobserve(section);
        };
    }, [setIsPlaying]);

    const titleGroupClassName = `${styles.titleGroup} ${isVisible ? styles.isVisible : ''}`;

    return (
        <section className={styles.headerSection} ref={sectionRef}>
            <video
                className={styles.introBackgroundVideo}
                muted playsInline preload="auto" loop autoPlay
            >
                <source src="/videos/story.mp4" type="video/mp4" />
            </video>

            <div className={styles.musicControlWrapper}>
                {/* 逻辑修改：只要没点击过 (hasInteracted 为 false)，气泡就一直存在 */}
                {!hasInteracted && (
                    <div className={styles.speechBubble}>
                        开启背景音乐体验更佳
                        <div className={styles.arrow} />
                    </div>
                )}
                
                {/* 按钮样式：styles.playing 会触发旋转动画 */}
                <button 
                    className={`${styles.musicToggleBtn} ${isPlaying ? styles.playing : ''}`}
                    onClick={handleMusicClick}
                    aria-label="切换背景音乐"
                >
                    {isPlaying ? <IconMusic /> : <IconMusicOff />}
                </button>
            </div>

            <div className={titleGroupClassName} data-animate="intro-group-1" ref={titleGroupRef}>
                <div className={styles.mainTitleWrapper}>
                    <h2>山河之旅</h2>
                    <img src="/images/山河之旅.png" alt="山河之旅" className={styles.titleIcon} />
                </div>
                <p>这是一幅流动的画卷。请向下滚动，开启一场西东之旅，见证大地的奇迹</p>
            </div>
        </section>
    );
};

export default StoryHeaderSection;