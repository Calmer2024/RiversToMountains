import { type FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideChapterStart.module.scss';


export const SlideFanjingshan: FC = () => {
    return (
        // 复用父组件的 .slide 和 .slideChapterStart 布局
        <div className={`${parentStyles.slide} ${parentStyles.slideChapterStart}`}>

            {/* 巨型背景文字 */}
            <div className={parentStyles.backgroundText} data-animate="text-fade-in">
                Fanjingshan
            </div>

            {/* 主要内容容器 */}
            <div className={parentStyles.mainContent}>

                {/* 胶囊视频 - 复用 SlideChapterStart.module.scss */}
                <div className={styles.videoLayoutWrapper} data-animate="text-fade-in">
                    <div className={styles.capsuleVideoContainer}>
                        <video
                            muted   
                            autoPlay 
                            playsInline
                            loop
                            src="/videos/fanjingshan-loop.mp4" 
                            className={styles.capsuleVideo}
                        />
                    </div>
                    <span className={`${styles.capsuleLabel} ${styles.labelTopLeft}`}>
                        天空之城
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelTopRight}`}>
                        灵山净界
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelBottomLeft}`}>
                        生态孤岛
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelBottomRight}`}>
                        云上禅阶
                    </span>
                </div>

                <div className={parentStyles.chapterText} data-animate="text-fade-in">
                    <h2>梵净山</h2>
                    <p>
                        遗世独立的“蘑菇石”与红云金顶。这是超脱凡尘的、孤独的纪念碑。
                    </p>
                </div>
            </div>
        </div>
    );
};