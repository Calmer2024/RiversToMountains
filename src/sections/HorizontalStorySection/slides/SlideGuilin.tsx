import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideGuilin.module.scss'; // [!] 导入自己的 SCSS

export const SlideGuilin: FC = () => {
    return (
        // [!] 修改类名
        <div className={`${parentStyles.slide} ${styles.slideGuilin}`}>
            <video
                // [!] 替换视频
                src="/videos/guilin-bg.mp4"
                muted autoPlay loop playsInline
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