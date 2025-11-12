import { type FC, useRef } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideKangrinboqe.module.scss';
import { useLazyVideo } from '../useLazyVideo';


export const SlideKangrinboqe: FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoMainRef = useRef<HTMLVideoElement>(null);
    const videoDroneRef = useRef<HTMLVideoElement>(null);
    const videoFlagsRef = useRef<HTMLVideoElement>(null);

    useLazyVideo(videoMainRef);
    useLazyVideo(videoDroneRef);
    useLazyVideo(videoFlagsRef);
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
                            ref={videoMainRef}
                            muted   
                            playsInline
                            loop
                            data-src="/videos/kailash-main.mp4"
                        />
                    </div>
                    <div className={`${styles.videoWindow} ${styles.windowSmallTop}`}>
                        <video
                            ref={videoDroneRef}
                            muted   
                            playsInline
                            loop
                            data-src="/videos/kailash-drone.mp4"
                        />
                    </div>
                    <div className={`${styles.videoWindow} ${styles.windowSmallBottom}`}>
                        <video
                            ref={videoFlagsRef}
                            muted   
                            playsInline
                            loop
                            data-src="/videos/kailash-prayer-flags.mp4"
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