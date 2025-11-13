import { type FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideMuztaghAta.module.scss';

export const SlideMuztaghAta: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideMuztaghAta}`}>
            <video
                muted   
                autoPlay 
                playsInline
                loop
                src="/videos/muztagh-ata-bg.mp4" 
                className={styles.fullScreenVideo}
            />
            {/* 复用父组件样式, 无需 data-animate 因为视频是即时播放的 */}
            <div className={parentStyles.mainContent}>
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