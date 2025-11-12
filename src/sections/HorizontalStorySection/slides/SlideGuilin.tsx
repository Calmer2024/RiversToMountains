import { type FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideGuilin.module.scss'; 

export const SlideGuilin: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideGuilin}`}>
            <video
                muted   
                autoPlay 
                playsInline
                loop
                src="/videos/guilin-bg.mp4" 
                className={styles.fullScreenVideo}
            />

            <div className={parentStyles.mainContent}>
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