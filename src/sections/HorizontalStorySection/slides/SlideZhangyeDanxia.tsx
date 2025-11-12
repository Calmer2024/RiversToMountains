import { type FC, useRef } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideZhangyeDanxia.module.scss'; 
import { useLazyVideo } from '../useLazyVideo';

export const SlideZhangyeDanxia: FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useLazyVideo(videoRef);
    return (
        <div className={`${parentStyles.slide} ${styles.slideZhangyeDanxia}`}>
            <video
                ref={videoRef}
                muted   
                playsInline
                loop
                data-src="/videos/zhangye-danxia-bg.mp4"
                className={styles.fullScreenVideo}
            />

            <div className={parentStyles.mainContent}>
                {/* [!] 替换文本 */}
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