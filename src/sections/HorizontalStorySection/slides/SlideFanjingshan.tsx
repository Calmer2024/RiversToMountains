import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
// [!] 智能复用: 导入“青藏高原”的 SCSS 来复用胶囊视频样式
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
                            // [!] 替换视频
                            src="/videos/fanjingshan-loop.mp4"
                            muted
                            autoPlay
                            loop
                            playsInline
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

                {/* 标题和介绍文字 - 复用父组件的 .chapterText */}
                <div className={parentStyles.chapterText} data-animate="text-fade-in">
                    {/* [!] 替换标题 */}
                    <h2>梵净山</h2>
                    {/* [!] 替换文本 */}
                    <p>
                        遗世独立的“蘑菇石”与红云金顶。这是超脱凡尘的、孤独的纪念碑。
                    </p>
                </div>
            </div>
        </div>
    );
};