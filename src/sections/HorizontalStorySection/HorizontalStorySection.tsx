// src/sections/HorizontalStorySection.tsx
import React, { useLayoutEffect, useRef, useState, type FC } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './HorizontalStorySection.module.scss';

// 导入 Context 和所有子幻灯片
import { ScrollContext } from '../../context/ScrollContext';
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
import { SlideWaterInk } from './slides/SlideWaterInk';
import { SlideGuilin } from './slides/SlideGuilin';
import { SlideHuangshan } from './slides/SlideHuangshan';
import { SlideLushan } from './slides/SlideLushan';
import { SlideEpilogue } from './slides/SlideEpilogue';
import { SlideYuanyangTerraces } from './slides/SlideYuanyangTerraces';
import { SlideHongcun } from './slides/SlideHongcun';
import { SlideXiapu } from './slides/SlideXiapu';
import { SlideFinale } from './slides/SlideFinale';

// 导入新加的控件和数据
import { StoryControls } from '../../components/StoryControls'; 
import { SLIDE_INFO_MAP, type SlideInfo } from '../../data/slideInfo';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const HorizontalStorySection: FC = () => {
    // Refs 
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const horizontalTrackRef = useRef<HTMLDivElement>(null);
    const introCanvasRef = useRef<HTMLDivElement>(null);
    const cloudContainerRef = useRef<HTMLDivElement>(null);

    // State 
    const [horizontalTween, setHorizontalTween] = useState<gsap.core.Tween | null>(null);

    // State 
    const [activeSlideInfo, setActiveSlideInfo] = useState<SlideInfo | null>(
      SLIDE_INFO_MAP['intro']
    );


    useLayoutEffect(() => {
        // 所有 GSAP 设置、时间轴、Tween 和跟踪器逻辑
        const pinContainer = pinContainerRef.current;
        const horizontalTrack = horizontalTrackRef.current;
        const introCanvas = introCanvasRef.current;
        const cloudContainer = cloudContainerRef.current;

        if (!pinContainer || !horizontalTrack || !introCanvas || !cloudContainer) {
            console.warn("GSAP (Main): 缺少关键全局元素。");
            return;
        }

        const trackWidth = horizontalTrack.scrollWidth;
        const viewportWidth = window.innerWidth;
        const scrollDistance = trackWidth - viewportWidth;
        if (scrollDistance <= 0) return;

        const introGroup2 = pinContainer.querySelector("[data-animate='intro-group-2']");
        const otherAnimatedElements = gsap.utils.toArray("[data-animate='text-fade-in']");

        if (!introGroup2) {
            console.warn("GSAP (Main): 缺少 introGroup 元素。");
            return;
        }

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
                    end: `+=${scrollDistance + (window.innerHeight * 1)}`,
                    scrub: 1.5,
                    pin: true,
                    invalidateOnRefresh: true,
                }
            });

            // Phase 1
            masterTimeline.fromTo(introGroup2, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 3 });
            masterTimeline.to(introGroup2, { duration: 1 });
            masterTimeline.add("startCloudCover");
            masterTimeline.to(introGroup2, { autoAlpha: 0, duration: 3 }, "startCloudCover");
            masterTimeline.fromTo(clouds, { autoAlpha: 0, scale: 1.5, xPercent: (i) => [-150, 0, 150][i], yPercent: (i) => [20, -10, 20][i], }, { autoAlpha: 1, scale: 2.0, xPercent: (i) => [-20, 0, 20][i], yPercent: 0, duration: 5, stagger: 0.1 }, "startCloudCover");
            masterTimeline.set(introCanvas, { autoAlpha: 0, pointerEvents: 'none' });
            masterTimeline.add("startScroll");
            masterTimeline.to(clouds, { autoAlpha: 0, scale: 3, xPercent: (i) => (i - 1) * 150, duration: 7, stagger: 0.1 }, "startScroll");

            
            // 水平滚动 Tween
            const tween = gsap.to(horizontalTrack, {
                x: `-=${scrollDistance}px`,
                ease: "none",
                duration: 100,
            });
            masterTimeline.add(tween, "startScroll");
            setHorizontalTween(tween);

            // 其他幻灯片淡入
            otherAnimatedElements.forEach((el: any) => {
                gsap.fromTo(el,
                    { autoAlpha: 0, y: 50 },
                    {
                        autoAlpha: 1, y: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            containerAnimation: tween, 
                            start: "left 80%",
                            toggleActions: "play none none reverse",
                        }
                    }
                );
            });

            const slides = gsap.utils.toArray(horizontalTrack.children) as HTMLElement[];
            
            slides.forEach((slide) => {
                const slideId = slide.dataset.slideId; 
                const info = slideId ? SLIDE_INFO_MAP[slideId] : null;

                ScrollTrigger.create({
                    trigger: slide,
                    containerAnimation: tween, 
                    start: "left 75%", 
                    end: "right 25%",
                    onToggle: (self) => {
                        if (self.isActive) {
                            setActiveSlideInfo(info || null);
                        }
                    },
                });
            });

        }, pinContainer);

        return () => ctx.revert();
    }, []);

    return (
        <ScrollContext.Provider value={{ horizontalTween }}>
            <section className={styles.storySection}>
                <div className={styles.pinContainer} ref={pinContainerRef}>
                
                    {/* UI 控件  */}
                    <StoryControls activeSlideInfo={activeSlideInfo} />

                    {/* “序章”画布  */}
                    <div className={styles.introCanvas} ref={introCanvasRef}>
                         {/* 序章内容不变 */}
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

                    {/* “云层”  */}
                    <div className={styles.cloudTransitionContainer} ref={cloudContainerRef}>
                         <img src="/images/clouds/cloud1.png" alt="转场云" className={styles.cloudImage} />
                         <img src="/images/clouds/cloud2.png" alt="转场云" className={styles.cloudImage} />
                         <img src="/images/clouds/cloud3.png" alt="转场云" className={styles.cloudImage} />
                    </div>

                    {/*  --- 轨道  ---  */}
                    {/* 我们将每个 <Slide... /> 组件包裹在一个 <div> 中
                      * 并将 data-slide-id 放在这个 wrapper <div> 上。
                    */}
                    <div className={styles.horizontalTrack} ref={horizontalTrackRef}>
                        <div data-slide-id="intro"><SlideIntro /></div>
                        <div data-slide-id="chapter_tibet"><SlideChapterStart /></div>
                        <div data-slide-id="tibet_main"><SlideFullBgTibet /></div>
                        <div data-slide-id="chapter_title_tibet"><SlideChapterTitle /></div>
                        <div data-slide-id="kangrinboqe"><SlideKangrinboqe /></div>
                        <div data-slide-id="progress"><SlideProgressBar /></div>
                        <div data-slide-id="muztaghata"><SlideMuztaghAta /></div>
                        <div data-slide-id="saltlake"><SlideSaltLake /></div>
                        <div data-slide-id="zhangye_danxia"><SlideZhangyeDanxia /></div>
                        <div data-slide-id="chapter_carved"><SlideChapterCarved /></div>
                        <div data-slide-id="dual_videos"><SlideDualVideos /></div>
                        <div data-slide-id="fanjingshan"><SlideFanjingshan /></div>
                        <div data-slide-id="zhangjiajie"><SlideZhangjiajie /></div>
                        <div data-slide-id="water_ink"><SlideWaterInk /></div>
                        <div data-slide-id="guilin"><SlideGuilin /></div>
                        <div data-slide-id="huangshan"><SlideHuangshan /></div>
                        <div data-slide-id="lushan"><SlideLushan /></div>
                        <div data-slide-id="epilogue"><SlideEpilogue /></div>
                        <div data-slide-id="hongcun"><SlideHongcun /></div>
                        <div data-slide-id="yuanyang"><SlideYuanyangTerraces /></div>
                        <div data-slide-id="xiapu"><SlideXiapu /></div>
                        <div data-slide-id="finale"><SlideFinale /></div>
                    </div>
                </div>
            </section>
        </ScrollContext.Provider>
    );
};

export default HorizontalStorySection;