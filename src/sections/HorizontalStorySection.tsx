import React, { useLayoutEffect, useRef, type FC } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { FiMousePointer } from 'react-icons/fi';
import styles from './HorizontalStorySection.module.scss';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

export const HorizontalStorySection: FC = () => {

    // --- 1. 创建 Refs ---
    // 明确指定 Ref 的类型为 HTMLDivElement
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const horizontalTrackRef = useRef<HTMLDivElement>(null);


    // --- 使用 useLayoutEffect ---
    useLayoutEffect(() => {
        const pinContainer = pinContainerRef.current;
        const horizontalTrack = horizontalTrackRef.current;
        if (!pinContainer || !horizontalTrack) return;

        // 1. 获取所有需要动画的元素
        const trackWidth = horizontalTrack.scrollWidth;
        const viewportWidth = window.innerWidth;
        const scrollDistance = trackWidth - viewportWidth;
        if (scrollDistance <= 0) return;

        // 获取开幕动画的元素
        const introGroup1 = pinContainer.querySelector("[data-animate='intro-group-1']");
        const introGroup2 = pinContainer.querySelector("[data-animate='intro-group-2']");
        // 获取开幕动画的“画布” (即第一张幻灯片)
        const introSlide = pinContainer.querySelector("." + styles.slideIntro);

        // 获取后续幻灯片中的"淡入"元素
        const otherAnimatedElements = gsap.utils.toArray("[data-animate='text-fade-in']");

        if (!introGroup1 || !introGroup2 || !introSlide) return;

        // --- 3. 创建 "主时间轴" (Master Timeline) ---
        let ctx = gsap.context(() => {

            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: pinContainer,
                    start: "top top",
                    end: `+=${scrollDistance + (window.innerHeight * 1.5)}`,
                    scrub: 1.5,
                    pin: true,
                    invalidateOnRefresh: true,
                    // markers: true,
                }
            });

            // --- 5. 编排动画 ---

            // Phase 1: “云壑寻幽” 渐显
            masterTimeline.fromTo(introGroup1,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 10 } // "duration: 10" 是相对"权重"
            );

            // "钉住" 状态：在 Phase 1 结束后，立即将 'introGroup1' 的
            // autoAlpha "设置" 为 1，防止 SASS 样式 "闪烁" 回来。
            masterTimeline.set(introGroup1, { autoAlpha: 1 });

            masterTimeline.to({}, { duration: 10 });


            // 主标题淡出
            masterTimeline.to(introGroup1,
                { autoAlpha: 0, duration: 5 },
                "fadeOutTitles"
            );

            // Phase 4: 章节标题 ("Intro 序幕") 渐显
            // (在主副标题淡出后)
            masterTimeline.fromTo(introGroup2,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 10 }
            );

            // Phase 5: 保持
            masterTimeline.to({}, { duration: 10 });

            // Phase 6: 章节标题 淡出 *同时* 画卷开始移动
            masterTimeline.to(introGroup2,
                { autoAlpha: 0, duration: 5 },
                "startScroll" // 创建一个"标签"
            );

            // Phase 5: “水平画卷” 开始滚动
            // (我们让它在 "startScroll" 标签处开始，持续 100 "权重")
            const horizontalScrollTween = masterTimeline.to(horizontalTrack,
                {
                    x: `-=${scrollDistance}px`,
                    ease: "none",
                    duration: 100
                },
                "startScroll"
            );

            // Phase 6: “其他幻灯片”的淡入动画
            // (我们重新实现了这个逻辑，使其绑定到主时间轴)
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

        return () => ctx.revert();
    }, []);

    return (
        <section className={styles.storySection}>

            <div className={styles.pinContainer} ref={pinContainerRef}>

                <div className={styles.introCanvas}>
                    <div className={styles.titleGroup} data-animate="intro-group-1">
                        <div className={styles.mainTitleWrapper}>
                            <h2>山河之旅</h2>
                            <img
                                src="/images/山河之旅.png"
                                alt="山河之旅"
                                className={styles.titleIcon}
                            />
                        </div>

                        <p>这是一幅流动的画卷。请向下滚动，开启一场西东之旅，见证大地的奇迹</p>
                    </div>

                    <h2 className={styles.chapterTitle} data-animate="intro-group-2">
                        Intro 序幕
                    </h2>
                </div>

                {/* 水平画卷 (它现在从 z-index: 1 开始)
                */}
                <div className={styles.horizontalTrack} ref={horizontalTrackRef}>

                    {/* 幻灯片 1: [已修改] 现在只是一个"占位符" */}
                    <div className={`${styles.slide} ${styles.slideIntro}`}>
                        {/* 这个幻灯片现在是空的, 
                          它只是为了在画卷中占据 100vw 的空间。
                          真正的开幕动画在 introCanvas 里。
                        */}
                    </div>

                    {/* Warning: `data-animate` 属性已从下面的 `textLayout` 移除，
                       因为 GSAP 无法同时处理 "masterTimeline" 
                       和 "containerAnimation" 的复杂嵌套。
                       我们转而使用更简单的 "horizontal" 触发器 (见 Phase 6)。
                    */}

                    {/* 幻灯片 2: 黄山 */}
                    <div className={`${styles.slide} ${styles.slideDual}`}>
                        <div className={styles.textLayout} data-animate="text-fade-in">
                            <h2>黄山</h2>
                            <p>奇松、怪石、云海。看自然如何作画。</p>
                        </div>
                        <div className={styles.imageLayout} data-animate="text-fade-in">
                            <img src="/images/cards/huangshan.jpg" alt="黄山" />
                        </div>
                    </div>

                    {/* 幻灯片 3: 漓江 */}
                    <div className={`${styles.slide} ${styles.slideDual} ${styles.layoutReverse}`}>
                        <div className={styles.textLayout} data-animate="text-fade-in">
                            <h2>漓江</h2>
                            <p>江作青罗带，山如碧玉簪。乘一叶竹筏，画中游。</p>
                        </div>
                        <div className={styles.imageLayout} data-animate="text-fade-in">
                            <img src="/images/cards/guilin.jpg" alt="漓江" />
                        </div>
                    </div>

                    {/* (后续幻灯片...) */}
                </div>
            </div>
        </section>
    );
};

export default HorizontalStorySection;