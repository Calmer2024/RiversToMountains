import { type FC} from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideChapterStart.module.scss';

export const SlideLushan: FC = () => {
    return (
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
                            muted   
                            autoPlay 
                            playsInline
                            loop
                            src="/videos/lushan-loop.mp4" 
                            className={styles.capsuleVideo}
                        />
                    </div>
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
                </div>

                {/* 标题和介绍文字 - 复用父组件的 .chapterText */}
                <div className={parentStyles.chapterText} data-animate="text-fade-in">
                    <h2>庐山</h2>
                    <p>
                        诗意与云雾的故乡。“不识庐山真面目，只缘身在此山中。”
                    </p>
                </div>
            </div>
        </div>
    );
};