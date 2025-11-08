import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideZhangjiajie.module.scss'; // [!] 导入自己的 SCSS

export const SlideZhangjiajie: FC = () => {
    return (
        // [!] 修改类名
        <div className={`${parentStyles.slide} ${styles.slideZhangjiajie}`}>
            <video
                // [!] 替换视频
                src="/videos/zhangjiajie-bg.mp4"
                muted autoPlay loop playsInline
                className={styles.fullScreenVideo}
            />

            <div className={parentStyles.mainContent}>
                {/* [!] 替换文本 */}
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