import { useLayoutEffect, useRef, useState, type FC } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './HorizontalStorySection.module.scss';

// 导入 Context 和所有子幻灯片
import { ScrollContext } from './ScrollContext';
import { SlideIntro } from './slides/SlideIntro';
import { SlideChapterStart } from './slides/SlideChapterStart';
import { SlideFullBgTibet } from './slides/SlideFullBgTibet';
import { SlideChapterTitle } from './slides/SlideChapterTitle';
import { SlideKangrinboqe } from './slides/SlideKangrinboqe';
import { SlideProgressBar } from './slides/SlideProgressBar';
import { SlideMuztaghAta } from './slides/SlideMuztaghAta';
import { SlideSaltLake } from './slides/SlideSaltLake';
import { SlideZhangyeDanxia } from './slides/SlideZhangyeDanxia';
import { SlideChapterCarved } from './slides/SlideChapterCarved';
import { SlideDualVideos } from './slides/SlideDualVideos';
import { SlideFanjingshan } from './slides/SlideFanjingshan';
import { SlideZhangjiajie } from './slides/SlideZhangjiajie';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const HorizontalStorySection: FC = () => {
    // 全局 Refs
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const horizontalTrackRef = useRef<HTMLDivElement>(null);
    const introCanvasRef = useRef<HTMLDivElement>(null);
    const cloudContainerRef = useRef<HTMLDivElement>(null);

    // 使用 State 存储 horizontalTween 以传递给 Context
    const [horizontalTween, setHorizontalTween] = useState<gsap.core.Tween | null>(null);


    useLayoutEffect(() => {
        // --- 1. 获取所有元素 ---
        const pinContainer = pinContainerRef.current;
        const horizontalTrack = horizontalTrackRef.current;
        const introCanvas = introCanvasRef.current;
        const cloudContainer = cloudContainerRef.current;

        // 只检查全局 Refs
        if (!pinContainer || !horizontalTrack || !introCanvas || !cloudContainer) {
            console.warn("GSAP (Main): 缺少关键全局元素。");
            return;
        }

        // --- 获取动画元素 ---
        const trackWidth = horizontalTrack.scrollWidth;
        const viewportWidth = window.innerWidth;
        const scrollDistance = trackWidth - viewportWidth;
        if (scrollDistance <= 0) return;

        const introGroup2 = pinContainer.querySelector("[data-animate='intro-group-2']");

        // 通用淡入动画
        const otherAnimatedElements = gsap.utils.toArray("[data-animate='text-fade-in']");

        if (!introGroup2) {
            console.warn("GSAP (Main): 缺少 introGroup 元素。");
            return;
        }

        // --- 创建 "主时间轴" (Master Timeline) ---
        let ctx = gsap.context(() => {
            const clouds = gsap.utils.toArray(cloudContainer.querySelectorAll("img"));
            if (clouds.length === 0) {
                console.warn("GSAP (Main): 未找到云层图片。");
                return;
            }

            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: pinContainer,
                    start: "top top",
                    end: `+=${scrollDistance + (window.innerHeight * 2)}`,
                    scrub: 1.5,
                    pin: true,
                    invalidateOnRefresh: true,
                }
            });

            // --- Phase 1, 2, 3: “电影开场”和“云层”动画 ---
            masterTimeline.fromTo(introGroup2,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 10 }
            );
            masterTimeline.to(introGroup2, { duration: 10 });
            masterTimeline.add("startCloudCover");
            masterTimeline.to(introGroup2,
                { autoAlpha: 0, duration: 10 },
                "startCloudCover"
            );
            masterTimeline.fromTo(clouds,
                {
                    autoAlpha: 0,
                    scale: 1.5,
                    xPercent: (i) => [-150, 0, 150][i],
                    yPercent: (i) => [20, -10, 20][i],
                },
                {
                    autoAlpha: 1,
                    scale: 2.0,
                    xPercent: (i) => [-20, 0, 20][i],
                    yPercent: 0,
                    duration: 15,
                    stagger: 0.1
                },
                "startCloudCover"
            );
            masterTimeline.set(introCanvas, { autoAlpha: 0, pointerEvents: 'none' });

            // --- Phase 4: 云层拨开 & 画卷开始  ---
            masterTimeline.add("startScroll");
            masterTimeline.to(clouds, {
                autoAlpha: 0,
                scale: 3,
                xPercent: (i) => (i - 1) * 150,
                duration: 20,
                stagger: 0.1
            }, "startScroll");

            // 1. **单独创建** 水平滚动的 Tween
            const tween = gsap.to(horizontalTrack, {
                x: `-=${scrollDistance}px`,
                ease: "none",
                duration: 100,
            });

            // 2. 将这个 **已创建的 Tween** 添加到主时间轴
            masterTimeline.add(tween, "startScroll");

            // 3. 将 Tween 存储在 State 中，以传递给 Context
            setHorizontalTween(tween);

            // Phase 5: “其他幻灯片”的淡入动画 
            otherAnimatedElements.forEach((el: any) => {
                gsap.fromTo(el,
                    { autoAlpha: 0, y: 50 },
                    {
                        autoAlpha: 1, y: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            containerAnimation: tween, // [!] 挂载到 tween
                            start: "left 80%",
                            toggleActions: "play none none reverse",
                        }
                    }
                );
            });

        }, pinContainer); // 绑定 GSAP 上下文

        return () => ctx.revert();
    }, []);

    return (
        // 1. 使用 Context.Provider 包裹所有内容
        <ScrollContext.Provider value={{ horizontalTween }}>
            <section className={styles.storySection}>
                <div className={styles.pinContainer} ref={pinContainerRef}>

                    {/* “序章”画布  */}
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

                    {/* “云层” */}
                    <div className={styles.cloudTransitionContainer} ref={cloudContainerRef}>
                        <img src="/images/clouds/cloud1.png" alt="转场云" className={styles.cloudImage} />
                        <img src="/images/clouds/cloud2.png" alt="转场云" className={styles.cloudImage} />
                        <img src="/images/clouds/cloud3.png" alt="转场云" className={styles.cloudImage} />
                    </div>

                    {/* 轨道只包含子组件 */}
                    <div className={styles.horizontalTrack} ref={horizontalTrackRef}>
                        <SlideIntro />
                        <SlideChapterStart />
                        <SlideFullBgTibet />
                        <SlideChapterTitle />
                        <SlideKangrinboqe />
                        <SlideProgressBar />
                        <SlideMuztaghAta />
                        <SlideSaltLake />
                        <SlideZhangyeDanxia />
                        <SlideChapterCarved />
                        <SlideDualVideos />
                        <SlideFanjingshan />
                        <SlideZhangjiajie />
                    </div>
                </div>
            </section>
        </ScrollContext.Provider>
    );
};

export default HorizontalStorySection;