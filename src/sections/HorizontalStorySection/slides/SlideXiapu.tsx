import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideXiapu.module.scss';

export const SlideXiapu: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideXiapu}`}>
            <video
                muted   
                autoPlay 
                playsInline
                loop
                src="/videos/xiapu-bg.mp4" 
                className={styles.fullScreenVideo}
            />

            <div className={parentStyles.mainContent}>
                <div className={`${parentStyles.textContent} ${styles.textContent}`} data-animate="text-fade-in">
                    <h2>霞浦</h2>
                    <p>
                        旅程的终点。滩涂上的光影，渔舟唱晚。山河入海，归于平静。
                    </p>
                </div>
            </div>
        </div>
    );
};