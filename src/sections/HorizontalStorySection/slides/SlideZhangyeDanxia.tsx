import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideZhangyeDanxia.module.scss'; // [!] 导入自己的 SCSS

export const SlideZhangyeDanxia: FC = () => {
    return (
        // [!] 修改类名
        <div className={`${parentStyles.slide} ${styles.slideZhangyeDanxia}`}>
            <video
                // [!] 替换视频
                src="/videos/zhangye-danxia-bg.mp4"
                muted autoPlay loop playsInline
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