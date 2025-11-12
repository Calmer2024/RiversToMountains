import { type FC, useRef } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideGuilin.module.scss'; 
import { useLazyVideo } from '../useLazyVideo';

export const SlideGuilin: FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useLazyVideo(videoRef);
    return (
        <div className={`${parentStyles.slide} ${styles.slideGuilin}`}>
            <video
                ref={videoRef}
                muted   
                playsInline
                loop
                data-src="/videos/guilin-bg.mp4"
                className={styles.fullScreenVideo}
            />

            <div className={parentStyles.mainContent}>
                {/* [!] 替换文本 */}
                <div className={`${parentStyles.textContent} ${styles.textContent}`} data-animate="text-fade-in">
                    <h2>桂林</h2>
                    <p>
                        漓江。“山如碧玉簪”。中国山水的经典意象，画卷的主体，在此徐徐展开。
                    </p>
                </div>
            </div>
        </div>
    );
};