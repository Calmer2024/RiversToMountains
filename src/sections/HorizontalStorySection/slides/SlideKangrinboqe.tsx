import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideKangrinboqe.module.scss';

export const SlideKangrinboqe: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideKangrinboqe}`}>
            {/* 复用父组件的 .backgroundText */}
            <div className={parentStyles.backgroundText} data-animate="text-fade-in">
                Kangrinboqe
            </div>

            {/* 复用父组件的 .mainContent */}
            <div className={parentStyles.mainContent}>
                <div className={styles.videoWindowGrid} data-animate="text-fade-in">
                    <div className={`${styles.videoWindow} ${styles.windowLarge}`}>
                        <video
                            src="/videos/kailash-main.mp4"
                            muted autoPlay loop playsInline
                        />
                    </div>
                    <div className={`${styles.videoWindow} ${styles.windowSmallTop}`}>
                        <video
                            src="/videos/kailash-drone.mp4"
                            muted autoPlay loop playsInline
                        />
                    </div>
                    <div className={`${styles.videoWindow} ${styles.windowSmallBottom}`}>
                        <video
                            src="/videos/kailash-prayer-flags.mp4"
                            muted autoPlay loop playsInline
                        />
                    </div>
                </div>

                {/* 复用父组件的 .textContent */}
                <div className={parentStyles.textContent} data-animate="text-fade-in">
                    <h2>冈仁波齐</h2>
                    <p>冈仁波齐。信仰的中心，世界的轴。我们的旅程，从最高处的仰望开始。</p>
                </div>
            </div>
        </div>
    );
};