import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
// [!] 智能复用: 导入“青藏高原”的 SCSS 来复用胶囊视频样式
import styles from './SlideChapterStart.module.scss';

export const SlideLushan: FC = () => {
    return (
        // 复用父组件的 .slide 和 .slideChapterStart 布局
        <div className={`${parentStyles.slide} ${parentStyles.slideChapterStart}`}>

            {/* 巨型背景文字 */}
            <div className={parentStyles.backgroundText} data-animate="text-fade-in">
                Lushan
            </div>

            {/* 主要内容容器 */}
            <div className={parentStyles.mainContent}>

                {/* 胶囊视频 - 复用 SlideChapterStart.module.scss */}
                <div className={styles.videoLayoutWrapper} data-animate="text-fade-in">
                    <div className={styles.capsuleVideoContainer}>
                        <video
                            // [!] 替换视频
                            src="/videos/lushan-loop.mp4"
                            muted
                            autoPlay
                            loop
                            playsInline
                            className={styles.capsuleVideo}
                        />
                    </div>
                    {/* [!code focus:start] */}
                    {/* [!] 替换四个角标 */}
                    <span className={`${styles.capsuleLabel} ${styles.labelTopLeft}`}>
                        匡庐奇秀甲天下
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelTopRight}`}>
                        人文圣山
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelBottomLeft}`}>
                        烟霞锁翠
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelBottomRight}`}>
                        诗山云海
                    </span>
                    {/* [!code focus:end] */}
                </div>

                {/* 标题和介绍文字 - 复用父组件的 .chapterText */}
                <div className={parentStyles.chapterText} data-animate="text-fade-in">
                    {/* [!] 替换标题 */}
                    <h2>庐山</h2>
                    {/* [!] 替换文本 */}
                    <p>
                        诗意与云雾的故乡。“不识庐山真面目，只缘身在此山中。”
                    </p>
                </div>
            </div>
        </div>
    );
};