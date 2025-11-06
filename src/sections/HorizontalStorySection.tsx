import { useLayoutEffect, useRef, type FC } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HorizontalStorySection.module.scss';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

export const HorizontalStorySection: FC = () => {

    const pinContainerRef = useRef<HTMLDivElement>(null);
    const horizontalTrackRef = useRef<HTMLDivElement>(null);

    const introCanvasRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // --- 1. 获取所有元素 ---
        const pinContainer = pinContainerRef.current;
        const horizontalTrack = horizontalTrackRef.current;
        const introCanvas = introCanvasRef.current;

        // 检查所有关键元素是否存在
        if (!pinContainer || !horizontalTrack || !introCanvas) {
            console.warn("GSAP: 缺少关键元素，动画取消。");
            return;
        }

        // --- 2. (+++ 已简化 +++)
        // 我们不再需要 setupGSAPTimeline 或 'canplay' 事件
        // GSAP 可以立即运行

        // --- 获取动画元素 ---
        const trackWidth = horizontalTrack.scrollWidth;
        const viewportWidth = window.innerWidth;
        const scrollDistance = trackWidth - viewportWidth;
        if (scrollDistance <= 0) return;

        const introGroup2 = pinContainer.querySelector("[data-animate='intro-group-2']");
        const otherAnimatedElements = gsap.utils.toArray("[data-animate='text-fade-in']");

        if (!introGroup2) {
            console.warn("GSAP: 缺少 introGroup 元素，动画取消。");
            return;
        }

        // --- 创建 "主时间轴" (Master Timeline) ---
        let ctx = gsap.context(() => {

            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: pinContainer,
                    start: "top top",
                    // (我们不再需要为视频擦洗增加额外时间，可以改回 400vh)
                    end: `+=${scrollDistance + (window.innerHeight * 4)}`,
                    scrub: 1.5,
                    pin: true,
                    invalidateOnRefresh: true,
                }
            });

            // --- “电影开场”动画 ---

            // Phase 7: 章节标题 ("Intro 序幕") 渐显
            masterTimeline.fromTo(introGroup2,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 10 }
            );

            // Phase 8
            masterTimeline.to(introGroup2, { duration: 10 });

            // Phase 9: 章节标题 淡出 *同时* 画卷开始移动
            masterTimeline.to(introGroup2,
                { autoAlpha: 0, duration: 5 },
                "startScroll"
            );

            masterTimeline.to(introCanvas,
                { autoAlpha: 0, duration: 3, pointerEvents: 'none' },
                "startScroll"
            );

            // Phase 10: 水平画卷
            const horizontalScrollTween = masterTimeline.to(horizontalTrack,
                {
                    x: `-=${scrollDistance}px`,
                    ease: "none",
                    duration: 100
                },
                "startScroll"
            );

            // Phase 11: “其他幻灯片”的淡入动画 (保持不变)
            otherAnimatedElements.forEach((el: any) => {
                gsap.fromTo(el,
                    { autoAlpha: 0, y: 50 },
                    {
                        autoAlpha: 1, y: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            containerAnimation: horizontalScrollTween,
                            start: "left 80%",
                            toggleActions: "play none none reverse",
                        }
                    }
                );
            });

        }, pinContainer); // 绑定 GSAP 上下文

        return () => ctx.revert(); // 返回清理函数

    }, []);

    return (
        <section className={styles.storySection}>
            <div className={styles.pinContainer} ref={pinContainerRef}>
                <div className={styles.introCanvas} ref={introCanvasRef}>

                    <div className={styles.subTitleGroup} data-animate="intro-group-2">
                        <div className={styles.chapterTitleWrapper}>
                            <h2>山河伊始</h2>
                            <img
                                src="/images/山河伊始.png"
                                alt="山河伊始"
                                className={styles.titleIcon}
                            />
                        </div>
                        <div className={styles.divider}></div>
                        <h3 className={styles.chapterSubtitle}>序章·开霁</h3>
                        <p>我们的画卷从青藏高原开始，顺着冰川融水与大江大河，穿过中部的奇峰峡谷，最终抵达东部的人文与海岸。</p>
                    </div>
                </div>

                <div className={styles.horizontalTrack} ref={horizontalTrackRef}>
                    <div className={`${styles.slide} ${styles.slideIntro}`}>
                    </div>

                    <div className={`${styles.slide} ${styles.slideDual}`}>
                        <div className={styles.textLayout} data-animate="text-fade-in">
                            <h2>黄山</h2>
                            <p>奇松、怪石、云海。看自然如何作画。</p>
                        </div>
                        <div className={styles.imageLayout} data-animate="text-fade-in">
                            <img src="/images/cards/huangshan.jpg" alt="黄山" />
                        </div>
                    </div>

                    <div className={`${styles.slide} ${styles.slideDual} ${styles.layoutReverse}`}>
                        <div className={styles.textLayout} data-animate="text-fade-in">
                            <h2>漓江</h2>
                            <p>江作青罗带，山如碧玉簪。乘一叶竹筏，画中游。</p>
                        </div>
                        <div className={styles.imageLayout} data-animate="text-fade-in">
                            <img src="/images/cards/guilin.jpg" alt="漓江" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HorizontalStorySection;