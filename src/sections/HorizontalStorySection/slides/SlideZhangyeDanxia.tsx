import { type FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideZhangyeDanxia.module.scss'; 

export const SlideZhangyeDanxia: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideZhangyeDanxia}`}>
            <video
                muted   
                autoPlay 
                playsInline
                loop
                src="/videos/zhangye-danxia-bg.mp4" 
                className={styles.fullScreenVideo}
            />

            <div className={parentStyles.mainContent}>
                <div className={`${parentStyles.textContent} ${styles.textContent}`} data-animate="text-fade-in">
                    <h2>张掖丹霞</h2>
                    <p>
                        亿万年的风沙，将山体染成画布。这是地球最初的色彩。
                    </p>
                </div>
            </div>
        </div>
    );
};