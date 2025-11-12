import { type FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideZhangjiajie.module.scss'; 

export const SlideZhangjiajie: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideZhangjiajie}`}>
            <video
                muted   
                autoPlay 
                playsInline
                loop
                src="/videos/zhangjiajie-bg.mp4" 
                className={styles.fullScreenVideo}
            />

            <div className={parentStyles.mainContent}>
                <div className={`${parentStyles.textContent} ${styles.textContent}`} data-animate="text-fade-in">
                    <h2>张家界</h2>
                    <p>
                        水墨画的故乡，现实中的“潘多拉”。云雾是它的面纱，奇峰是它的风骨。
                    </p>
                </div>
            </div>
        </div>
    );
};