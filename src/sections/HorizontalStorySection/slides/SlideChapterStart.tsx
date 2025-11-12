import { type FC, useRef } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideChapterStart.module.scss';
import { useLazyVideo } from '../useLazyVideo';

export const SlideChapterStart: FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useLazyVideo(videoRef);
    return (
        <div className={`${parentStyles.slide} ${parentStyles.slideChapterStart}`}>
            {/* 巨型背景文字 */}
            <div className={parentStyles.backgroundText} data-animate="text-fade-in">
                Tibet
            </div>

            {/* 主要内容容器 */}
            <div className={parentStyles.mainContent}>
                {/* 胶囊视频 */}
                <div className={styles.videoLayoutWrapper} data-animate="text-fade-in">
                    <div className={styles.capsuleVideoContainer}>
                        <video
                            ref={videoRef}
                            muted   
                            playsInline
                            loop
                            data-src="/videos/tibet-loop.mp4"
                            className={styles.capsuleVideo}
                        />
                    </div>
                    <span className={`${styles.capsuleLabel} ${styles.labelTopLeft}`}>
                        世界第三极
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelTopRight}`}>
                        亚洲水塔
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelBottomLeft}`}>
                        极地之外最大冰盖
                    </span>
                    <span className={`${styles.capsuleLabel} ${styles.labelBottomRight}`}>
                        平均海拔 4500米
                    </span>
                </div>

                {/* 标题和介绍文字 */}
                <div className={parentStyles.chapterText} data-animate="text-fade-in">
                    <h2>青藏高原</h2>
                    <p>
                        拨开云雾，你来到了青藏高原，这里是雪山与冰川的故乡。
                        冰川融水汇聚成河，一路向东。
                    </p>
                </div>
            </div>
        </div>
    );
};