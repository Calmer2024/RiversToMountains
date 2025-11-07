import { useLayoutEffect, useRef, type FC } from 'react';
import { gsap } from 'gsap';
import { useScroll } from '../ScrollContext'; // [新] 导入 Context Hook
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideSaltLake.module.scss';

export const SlideSaltLake: FC = () => {
    // [新] 从 Context 获取父组件的 horizontalTween
    const { horizontalTween } = useScroll();

    // [新] Refs 现在是局部的
    const slideRef = useRef<HTMLDivElement>(null);
    const splitTextRef1 = useRef<HTMLSpanElement>(null);
    const splitTextRef2 = useRef<HTMLSpanElement>(null);
    const splitEnglishRef1 = useRef<HTMLSpanElement>(null);
    const splitEnglishRef2 = useRef<HTMLSpanElement>(null);
    const saltLakeVideoContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // [新] 等待父组件的 horizontalTween 准备就绪
        if (!horizontalTween) {
            return;
        }

        const slide = slideRef.current;
        const videoContainer = saltLakeVideoContainerRef.current;
        const sText1 = splitTextRef1.current;
        const sText2 = splitTextRef2.current;
        const sEng1 = splitEnglishRef1.current;
        const sEng2 = splitEnglishRef2.current;

        if (!slide || !videoContainer || !sText1 || !sText2 || !sEng1 || !sEng2) {
            console.warn("GSAP (SaltLake): 缺少元素。");
            return;
        }

        let ctx = gsap.context(() => {
            const saltLakeTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: slide,
                    containerAnimation: horizontalTween, // [!] 挂载！
                    start: "left right", // [!] 使用您调整后的触发点
                    end: "right left",
                    scrub: 1.5,
                }
            });

            saltLakeTimeline.add("intro", 0);

            // [!] 使用您最新的 GSAP matchMedia 逻辑...
            const mm = gsap.matchMedia();
            mm.add(
                {
                    isDesktop: "(min-width: 769px)",
                    isMobile: "(max-width: 768px)"
                },
                (context) => {
                    const { isDesktop } = context.conditions!;

                    // [!] 注意：您代码中 x 值为 '-30vw'
                    // 但您之前设置 .saltLakeVideoContainer 宽度为 55vw
                    // 30vw + 30vw = 60vw 间隙. 55vw 视频. 完美.
                    const xMove = isDesktop ? '-35vw' : '-48vw'; // 移动端 90vw 视频 -> 48vw 移动 = 96vw 间隙
                    const xMovePos = isDesktop ? '35vw' : '48vw';

                    saltLakeTimeline.to(sText1, { x: xMove, ease: "power2.inOut", duration: 1 }, "intro");
                    saltLakeTimeline.to(sText2, { x: xMovePos, ease: "power2.inOut", duration: 1 }, "intro");
                    saltLakeTimeline.to(sEng1, { x: xMove, ease: "power2.inOut", duration: 1 }, "intro");
                    saltLakeTimeline.to(sEng2, { x: xMovePos, ease: "power2.inOut", duration: 1 }, "intro");
                }
            ); // 结束 mm.add

            saltLakeTimeline.fromTo(videoContainer,
                { scale: 0, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, ease: "power2.out", duration: 1.2 },
                "intro"
            );

        }, slide); // [新] 将 GSAP 上下文限定在此幻灯片

        return () => ctx.revert();
    }, [horizontalTween]); // [新] 依赖 horizontalTween

    return (
        <div
            className={`${parentStyles.slide} ${styles.slideSaltLake}`}
            ref={slideRef}
        >
            <h2 className={styles.splitTextContainer}>
                <div className={styles.splitChinese}>
                    <span ref={splitTextRef1}>你来到了</span>
                    <span ref={splitTextRef2}>察尔汗盐湖</span>
                </div>
                <div className={styles.splitEnglish}>
                    <span ref={splitEnglishRef1}>You have arrived at</span>
                    <span ref={splitEnglishRef2}>Qarhan Salt Lake</span>
                </div>
            </h2>
            <div
                className={styles.saltLakeVideoContainer}
                ref={saltLakeVideoContainerRef}
            >
                <video src="/videos/salt-lake.mp4" muted autoPlay loop playsInline />
                <p>
                    当山峰隐去，大地变为镜面。在这里，天空与大地再无分别。
                </p>
            </div>
        </div>
    );
};