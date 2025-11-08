import { useLayoutEffect, useRef, type FC } from 'react';
import { gsap } from 'gsap';
import { useScroll } from '../ScrollContext'; // [新] 导入 Context Hook
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideProgressBar.module.scss';

export const SlideProgressBar: FC = () => {
    // [新] 从 Context 获取父组件的 horizontalTween
    const { horizontalTween } = useScroll();

    // [新] Refs 现在是局部的
    const slideRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        // [新] 等待父组件的 horizontalTween 准备就绪
        if (!horizontalTween) {
            return;
        }

        const slide = slideRef.current;
        const fill = progressFillRef.current;
        const text = progressTextRef.current;

        if (!slide || !fill || !text) {
            console.warn("GSAP (ProgressBar): 缺少元素。");
            return;
        }

        let ctx = gsap.context(() => {
            const progressProxy = { percent: 0 };

            gsap.timeline({
                scrollTrigger: {
                    trigger: slide,
                    containerAnimation: horizontalTween, // [!] 挂载！
                    start: "left left", // 使用您在代码中设置的触发点
                    end: "right right",
                    scrub: 1.5,
                }
            })
                .to(fill, {
                    scaleX: 1,
                    ease: "none"
                }, 0)
                .to(progressProxy, {
                    percent: 100,
                    ease: "none",
                    roundProps: "percent",
                    onUpdate: () => {
                        text.textContent = `${progressProxy.percent}%`;
                    }
                }, 0);

        }, slide); // [新] 将 GSAP 上下文限定在此幻灯片

        return () => ctx.revert();
    }, [horizontalTween]); // [新] 依赖 horizontalTween

    return (
        <div
            className={`${parentStyles.slide} ${styles.slideProgressBar}`}
            ref={slideRef}
        >
            <div className={styles.loadingContainer}>
                <img
                    src="/images/loading-top.jpg"
                    alt="加载插画"
                    className={styles.loadingImage}
                />
                <div className={styles.loadingText}>
                    辞别这片圣地，愿将冈仁波齐的祝福与静穆，带往尘世的每一步: <span ref={progressTextRef}>0%</span>
                </div>
                <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill} ref={progressFillRef}></div>
                </div>
                <p className={styles.loadingCaption}>
                    OUR JOURNEY COMMENCES AT THE SUMMIT OF THE WORLD. THIS IS THE SOURCE OF THE GREAT RIVERS AND MOUNTAINS, WHERE SNOW-CAPPED PEAKS STAND IN SILENT GRANDEUR, GLACIERS GLITTER WITH ETERNAL LIGHT, AND LAKES LIE AS STILL AS MIRRORS, REVEALING THE PURE, MONUMENTAL SPLENDOR OF THE DAWN OF CREATION.
                </p>
            </div>
        </div>
    );
};