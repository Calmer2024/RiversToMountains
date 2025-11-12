import { type FC, useRef } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideMuztaghAta.module.scss';
import { useLazyVideo } from '../useLazyVideo';

export const SlideMuztaghAta: FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useLazyVideo(videoRef);
    return (
        <div className={`${parentStyles.slide} ${styles.slideMuztaghAta}`}>
            <video
                ref={videoRef}
                muted   
                playsInline
                loop
                data-src="/videos/muztagh-ata-bg.mp4"
                className={styles.fullScreenVideo}
            />

            {/* 复用父组件样式, 无需 data-animate 因为视频是即时播放的 */}
            <div className={parentStyles.mainContent}>
                {/* 复用并覆盖 .textContent 样式 */}
                <div className={`${parentStyles.textContent} ${styles.textContent}`} data-animate="text-fade-in">
                    <h2>慕士塔格峰</h2>
                    <p>
                        你来到了慕士塔格峰，这是帕米尔高原上的巨擎，冷峻，纯粹，守护着古老的丝路。
                    </p>
                </div>
            </div>
        </div>
    );
};