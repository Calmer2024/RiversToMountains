import { useLayoutEffect, useRef, type FC } from 'react';
import { gsap } from 'gsap';
import { useScroll } from '../../../context/ScrollContext';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideHuangshan.module.scss'; 

export const SlideHuangshan: FC = () => {
    const { horizontalTween } = useScroll();

    const slideRef = useRef<HTMLDivElement>(null);
    const splitTextRef1 = useRef<HTMLSpanElement>(null);
    const splitTextRef2 = useRef<HTMLSpanElement>(null);
    const splitEnglishRef1 = useRef<HTMLSpanElement>(null);
    const splitEnglishRef2 = useRef<HTMLSpanElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);


    useLayoutEffect(() => {
        if (!horizontalTween) {
            return;
        }

        const slide = slideRef.current;
        const videoContainer = videoContainerRef.current; 
        const sText1 = splitTextRef1.current;
        const sText2 = splitTextRef2.current;
        const sEng1 = splitEnglishRef1.current;
        const sEng2 = splitEnglishRef2.current;

        if (!slide || !videoContainer || !sText1 || !sText2 || !sEng1 || !sEng2) {
            console.warn("GSAP (Huangshan): 缺少元素。"); 
            return;
        }

        let ctx = gsap.context(() => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: slide,
                    containerAnimation: horizontalTween,
                    start: "left right",
                    end: "right left",
                    scrub: 1.5,
                }
            });

            timeline.add("intro", 0);

            const mm = gsap.matchMedia();
            mm.add(
                {
                    isDesktop: "(min-width: 769px)",
                    isMobile: "(max-width: 768px)"
                },
                (context) => {
                    const { isDesktop } = context.conditions!;

                    const xMove = isDesktop ? '-35vw' : '-48vw';
                    const xMovePos = isDesktop ? '35vw' : '48vw';

                    timeline.to(sText1, { x: xMove, ease: "power2.inOut", duration: 1 }, "intro");
                    timeline.to(sText2, { x: xMovePos, ease: "power2.inOut", duration: 1 }, "intro");
                    timeline.to(sEng1, { x: xMove, ease: "power2.inOut", duration: 1 }, "intro");
                    timeline.to(sEng2, { x: xMovePos, ease: "power2.inOut", duration: 1 }, "intro");
                }
            );

            timeline.fromTo(videoContainer,
                { scale: 0, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, ease: "power2.out", duration: 1.2 },
                "intro"
            );

        }, slide);

        return () => ctx.revert();
    }, [horizontalTween]);

    return (
        <div
            className={`${parentStyles.slide} ${styles.slideHuangshan}`}
            ref={slideRef}
        >
            <h2 className={styles.splitTextContainer}>
                <div className={styles.splitChinese}>
                    <span ref={splitTextRef1}>黄山</span>
                    <span ref={splitTextRef2}>归来不看岳</span>
                </div>
                <div className={styles.splitEnglish}>
                    <span ref={splitEnglishRef1}>Huangshan</span>
                    <span ref={splitEnglishRef2}>Apex of Mountains</span>
                </div>
            </h2>
            <div
                className={styles.videoContainer}
                ref={videoContainerRef}
            >
                <video
                    muted   
                    autoPlay 
                    playsInline
                    loop
                    src="/videos/huangshan-bg.mp4" 
                />
                <p>
                    奇松、怪石、云海。这是浓缩的盆景，“五岳归来不看山，黄山归来不看岳。”
                </p>
            </div>
        </div>
    );
};