import { useLayoutEffect, useRef, type FC } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './HorizontalStorySection.module.scss';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const HorizontalStorySection: FC = () => {

    const pinContainerRef = useRef<HTMLDivElement>(null);
    const horizontalTrackRef = useRef<HTMLDivElement>(null);

    const introCanvasRef = useRef<HTMLDivElement>(null);

    const cloudContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // --- 1. 获取所有元素 ---
        const pinContainer = pinContainerRef.current;
        const horizontalTrack = horizontalTrackRef.current;
        const introCanvas = introCanvasRef.current;

        const cloudContainer = cloudContainerRef.current;

        // 检查所有关键元素是否存在
        if (!pinContainer || !horizontalTrack || !introCanvas || !cloudContainer) {
            console.warn("GSAP: 缺少关键元素，动画取消。");
            return;
        }

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
            const clouds = gsap.utils.toArray(cloudContainer.querySelectorAll("img"));
            if (clouds.length === 0) {
                console.warn("GSAP: 未找到云层图片，转场取消。");
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

            // --- “电影开场”动画 ---

            // Phase 1: 章节标题 (序幕·开霁) 渐显
            masterTimeline.fromTo(introGroup2,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 10 }
            );

            masterTimeline.to(introGroup2, { duration: 10 });

            // --- Phase 2: 云层覆盖 ---
            // "山河伊始" 开始淡出
            masterTimeline.add("startCloudCover");
            masterTimeline.to(introGroup2,
                { autoAlpha: 0, duration: 10 },
                "startCloudCover"
            );

            // 云层 *同时* 动画进入，覆盖屏幕
            masterTimeline.fromTo(clouds,
                {
                    autoAlpha: 0,
                    scale: 1.5, // [!code modification] 从一个已经不小的尺寸开始
                    // 根据索引 (0, 1, 2) 分散它们
                    xPercent: (i) => [-150, 0, 150][i], // [!code modification] 从屏幕外飞入 (左, 中, 右)
                    yPercent: (i) => [20, -10, 20][i],  // [!code modification] 从不同高度飞入
                },
                {
                    autoAlpha: 1,
                    scale: 2.0, // [!code modification] 汇聚时变得非常大 (200%)，确保覆盖
                    xPercent: (i) => [-20, 0, 20][i], // [!code modification] 在中心重叠，而不是都在 0
                    yPercent: 0, // [!code modification] 汇聚到 Y 轴中心
                    duration: 15, // 覆盖过程
                    stagger: 0.1 // 云层错开
                },
                "startCloudCover"
            );

            // --- Phase 3: "交换"  ---
            // 在云层完全覆盖后 (时间轴的下一个点)，立即隐藏 introCanvas
            masterTimeline.set(introCanvas, { autoAlpha: 0, pointerEvents: 'none' });

            // --- Phase 4: 云层拨开 & 画卷开始 ---
            // 这是转场的“高光时刻”
            masterTimeline.add("startScroll");

            // 云层 *同时* 拨开 (例如：飞散 + 放大 + 淡出)
            masterTimeline.to(clouds, {
                autoAlpha: 0,
                scale: 3, // 放大
                xPercent: (i) => (i - 1) * 150, // 向两边飞散
                duration: 20, // 拨开过程
                stagger: 0.1
            }, "startScroll");

            // 水平画卷 *同时* 开始移动
            // 1. **单独创建** 水平滚动的 Tween
            //    我们使用 gsap.to() 而不是 masterTimeline.to()
            const horizontalScrollTween = gsap.to(horizontalTrack, {
                x: `-=${scrollDistance}px`,
                ease: "none",
                duration: 100, // 这个 duration 定义了它在时间轴上的相对速度
                // paused: true  
            });

            // 2. 将这个 **已创建的 Tween** 添加到主时间轴
            masterTimeline.add(horizontalScrollTween, "startScroll");

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

                <div className={styles.cloudTransitionContainer} ref={cloudContainerRef}>
                    <img
                        src="/images/clouds/cloud1.png"
                        alt="转场云"
                        className={styles.cloudImage}
                    />
                    <img
                        src="/images/clouds/cloud2.png"
                        alt="转场云"
                        className={styles.cloudImage}
                    />
                    <img
                        src="/images/clouds/cloud3.png"
                        alt="转场云"
                        className={styles.cloudImage}
                    />
                </div>

                <div className={styles.horizontalTrack} ref={horizontalTrackRef}>
                    <div className={`${styles.slide} ${styles.slideIntro}`}>
                    </div>

                    {/* --- 幻灯片 2:青藏高原 --- */}
                    <div className={`${styles.slide} ${styles.slideChapterStart}`}>

                        {/* 巨型背景文字 */}
                        <div className={styles.backgroundText} data-animate="text-fade-in">
                            Tibet
                        </div>

                        {/* 主要内容容器 */}
                        <div className={styles.mainContent}>

                            {/* 胶囊视频 */}
                            <div className={styles.videoLayoutWrapper} data-animate="text-fade-in">

                                {/* --- 视频容器 --- */}
                                <div className={styles.capsuleVideoContainer}>
                                    <video
                                        src="/videos/tibet-loop.mp4"
                                        muted
                                        autoPlay
                                        loop
                                        playsInline
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
                            <div className={styles.chapterText} data-animate="text-fade-in">
                                <h2>青藏高原</h2>
                                <p>
                                    故事从这里开始。世界的屋脊，雪山与冰川的故乡。
                                    冰川融水汇聚成河，一路向东，开启了这场山河之旅。
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- 幻灯片 3: 全屏背景图片  --- */}
                    {/* 这个 slide 将没有任何内容，只用于展示背景图 */}
                    <div className={`${styles.slide} ${styles.slideFullBgTibet}`}>
                        {/* <h2 className={styles.fullBgText} data-animate="text-fade-in">浩瀚与深邃</h2> */}
                        <div className={styles.loadingBar}></div>
                    </div>

                    {/* --- 幻灯片 4: "雪域天穹" 章节标题 --- */}
                    <div className={`${styles.slide} ${styles.slideChapterTitleWrapper}`}>
                        <div className={styles.chapterTitleCard} data-animate="text-fade-in">
                            <div className={styles.chapterTitleWrapper}>
                                <h2>雪域天穹</h2>
                                <img
                                    src="/images/雪域天穹.png"
                                    alt="雪域天穹"
                                    className={styles.titleIcon}
                                />
                            </div>
                            <div className={styles.divider}></div>
                            <h3 className={styles.chapterSubtitle}>第一章·天际</h3>
                            <p data-animate-text="typewriter"> {/* [!code ++] */}
                                我们的旅程从世界之巅开始。这里是山河的源头，
                                雪峰静默，冰川闪耀，湖泊如镜，
                                展现着天地之初的纯粹与宏大。
                            </p>
                        </div>
                    </div>

                    {/* --- [新] 幻灯片 5: 冈仁波齐 --- */}
                    <div className={`${styles.slide} ${styles.slideKangrinboqe}`}>
                        {/* 巨型背景文字 */}
                        <div className={styles.backgroundText} data-animate="text-fade-in">
                            Kangrinboqe
                        </div>

                        {/* 主要内容容器 (z-index: 2) */}
                        <div className={styles.mainContent}>

                            {/* 1. 视频窗口网格 */}
                            <div className={styles.videoWindowGrid} data-animate="text-fade-in">
                                {/* 大窗口 (占据 2x2) */}
                                <div className={`${styles.videoWindow} ${styles.windowLarge}`}>
                                    <video
                                        src="/videos/kailash-main.mp4"
                                        muted
                                        autoPlay
                                        loop
                                        playsInline
                                    />
                                </div>
                                {/* 小窗口 1 (右上) */}
                                <div className={`${styles.videoWindow} ${styles.windowSmallTop}`}>
                                    <video
                                        // [!code warning] 确保你有这个视频文件
                                        src="/videos/kailash-drone.mp4"
                                        muted
                                        autoPlay
                                        loop
                                        playsInline
                                    />
                                </div>
                                {/* 小窗口 2 (右下) */}
                                <div className={`${styles.videoWindow} ${styles.windowSmallBottom}`}>
                                    <video
                                        // [!code warning] 确保你有这个视频文件
                                        src="/videos/kailash-prayer-flags.mp4"
                                        muted
                                        autoPlay
                                        loop
                                        playsInline
                                    />
                                </div>
                            </div>

                            {/* 2. 文本内容 */}
                            <div className={styles.textContent} data-animate="text-fade-in">
                                <h2>冈仁波齐</h2>
                                <p>冈仁波齐。信仰的中心，世界的轴。我们的旅程，从最高处的仰望开始。</p>
                            </div>

                        </div>
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