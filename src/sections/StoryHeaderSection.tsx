import React, { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import styles from './StoryHeaderSection.module.scss';

// [!code focus:start]
// --- SVG 图标 ---
const IconMusic = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
);

const IconPlay = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const IconPause = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

const IconVolume = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
);
// [!code focus:end]


export const StoryHeaderSection: FC = () => {
    // --- 现有 Ref 和 State ---
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleGroupRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // --- 音乐播放器 Ref 和 State ---
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [isManuallyPaused, setIsManuallyPaused] = useState(true);

    // --- [新增] 播放器展开状态 ---
    const [isExpanded, setIsExpanded] = useState(false);

    // --- 现有 IntersectionObserver ---
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const newVisibility = entry.isIntersecting;
                setIsVisible(newVisibility);

                // 控制音乐播放 (新逻辑)
                if (newVisibility) {
                    // --- 用户在区域内 ---
                    // 播放, 除非他们手动暂停了
                    if (!isManuallyPaused) {
                        setIsPlaying(true);
                    }
                } else {
                    // --- 用户已离开区域 ---
                    // 我们需要判断他们是向上还是向下离开的

                    // entry.boundingClientRect.top < 0 意味着
                    // 元素的顶部已经移动到了视口的顶部 *之上*
                    // = 用户向下滚动，离开了此区域
                    if (entry.boundingClientRect.top < 0) {
                        // 用户向下了，音乐继续播放
                        // 我们什么都不做，'isPlaying' 状态保持
                    } else {
                        // 否则，元素就是从视口底部离开的
                        // = 用户向上滚动，离开了此区域
                        setIsPlaying(false);
                        setIsExpanded(false); // 自动折叠播放器
                    }
                }
            },
            {
                threshold: 0.0,
            }
        );

        observer.observe(section);

        return () => {
            if (section) {
                observer.unobserve(section);
            }
        };
    }, [isManuallyPaused]);

    // --- 同步 React 状态到 <audio> 元素 (保持不变) ---
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(error => {
                console.warn("音乐播放失败:", error);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

    // --- 播放器控制函数 ---

    // [!code focus:start]
    // 1. [新增] 切换展开/折叠
    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    // 2. 切换播放/暂停 (逻辑不变)
    const togglePlayPause = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setIsManuallyPaused(true);
        } else {
            setIsPlaying(true);
            setIsManuallyPaused(false);
        }
    };
    // [!code focus:end]

    // 3. 调整音量 (逻辑不变)
    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    // --- 现有标题动画 ---
    const titleGroupClassName = `${styles.titleGroup} ${isVisible ? styles.isVisible : ''
        }`;

    return (
        <section className={styles.headerSection} ref={sectionRef}>

            {/* --- [修改] 音乐播放器 UI --- */}
            <div className={styles.musicPlayer}>

                {/* 1. 音乐图标 (主按钮) */}
                <button
                    onClick={toggleExpand}
                    className={`${styles.toggleExpandButton} ${isPlaying ? styles.isPlaying : ''}`}
                    aria-label="控制音乐播放器"
                >
                    <IconMusic />
                </button>

                {/* 2. 可折叠的控制器 */}
                <div
                    className={`${styles.controlsContainer} ${isExpanded ? styles.isExpanded : ''}`}
                >
                    <button onClick={togglePlayPause} className={styles.playPauseButton} aria-label={isPlaying ? "暂停" : "播放"}>
                        {isPlaying ? <IconPause /> : <IconPlay />}
                    </button>
                    <div className={styles.volumeControl}>
                        <IconVolume />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className={styles.volumeSlider}
                            aria-label="音量"
                        />
                    </div>
                </div>

            </div>

            {/* --- <audio> 元素 (保持不变) --- */}
            <audio
                ref={audioRef}
                src="/music/story-theme.mp3"
                loop
                preload="auto"
            />

            {/* --- 视频背景 (保持不变) --- */}
            <video
                className={styles.introBackgroundVideo}
                muted
                playsInline
                preload="auto"
                loop
                autoPlay
            >
                <source src="/videos/story.mp4" type="video/mp4" />
            </video>

            {/* --- 标题组 (保持不变) --- */}
            <div className={titleGroupClassName} data-animate="intro-group-1" ref={titleGroupRef}>
                {/* ... (h2, p, img 保持不变) ... */}
                <div className={styles.mainTitleWrapper}>
                    <h2>山河之旅</h2>
                    <img
                        src="/images/山河之旅.png"
                        alt="山河之旅"
                        className={styles.titleIcon}
                    />
                </div>
                <p>这是一幅流动的画卷。请向下滚动，开启一场西东之旅，见证大地的奇迹</p>
            </div>
        </section>
    );
};

export default StoryHeaderSection;