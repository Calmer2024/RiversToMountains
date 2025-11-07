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

    // --- 进度条 Refs ---
    const progressBarSlideRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);

    // --- [新] 察尔汗盐湖的 Refs ---
    const saltLakeSlideRef = useRef<HTMLDivElement>(null);
    const splitTextRef1 = useRef<HTMLSpanElement>(null);
    const splitTextRef2 = useRef<HTMLSpanElement>(null);
    const splitEnglishRef1 = useRef<HTMLSpanElement>(null); // [!code ++]
    const splitEnglishRef2 = useRef<HTMLSpanElement>(null); // [!code ++]
    const saltLakeVideoContainerRef = useRef<HTMLDivElement>(null); // [!code modification] (代替 cuboidRef)

    useLayoutEffect(() => {
        // --- 1. 获取所有元素 ---
        const pinContainer = pinContainerRef.current;
        const horizontalTrack = horizontalTrackRef.current;
        const introCanvas = introCanvasRef.current;
        const cloudContainer = cloudContainerRef.current;

        if (!pinContainer || !horizontalTrack || !introCanvas || !cloudContainer ||
            !progressBarSlideRef.current ||
            !progressFillRef.current ||
            !progressTextRef.current ||
            !saltLakeSlideRef.current ||
            !splitTextRef1.current ||
            !splitTextRef2.current ||
            !splitEnglishRef1.current || // [!code ++]
            !splitEnglishRef2.current || // [!code ++]
            !saltLakeVideoContainerRef.current // [!code modification] (代替 cuboidRef)
        ) {
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

            // --- [新] Phase 6: 进度条动画 ---
            // 获取 Refs
            const progressBarSlide = progressBarSlideRef.current!;
            const progressFill = progressFillRef.current!;
            const progressText = progressTextRef.current!;

            // 创建一个 "代理" 对象，GSAP 可以动画化它的 'percent' 属性
            const progressProxy = { percent: 0 };

            // 创建一个专门用于进度条的时间轴
            const progressTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: progressBarSlide,           // 触发器是进度条幻灯片
                    containerAnimation: horizontalScrollTween, // 关键：动画在水平滚动中发生

                    // 当幻灯片的左边缘碰到视口左边缘时开始
                    start: "left left",

                    // 当幻灯片的右边缘碰到视口右边缘时结束
                    // 这确保动画在幻灯片完全穿过屏幕的 100vw 距离内完成
                    end: "right right",

                    scrub: 1.5, // 关联到滚动条
                }
            });

            // 动画1: 填充条的 scaleX 从 0 到 1
            progressTimeline.to(progressFill, {
                scaleX: 1,
                ease: "none"
            }, 0); // 0 表示在时间轴的开头

            // 动画2: 代理对象的 'percent' 属性从 0 到 100
            progressTimeline.to(progressProxy, {
                percent: 100,
                ease: "none",
                roundProps: "percent", // 关键：将数字四舍五入为整数
                onUpdate: () => {
                    // 每次更新时，将数字设置到 span 元素中
                    progressText.textContent = `${progressProxy.percent}%`;
                }
            }, 0); // 0 表示与上一个动画同时开始

            // --- [修改] Phase 7: 察尔汗盐湖 动画 ---
            const saltLakeSlide = saltLakeSlideRef.current!;
            const splitText1 = splitTextRef1.current!;
            const splitText2 = splitTextRef2.current!;
            const saltLakeVideoContainer = saltLakeVideoContainerRef.current!;

            const saltLakeTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: saltLakeSlide,
                    containerAnimation: horizontalScrollTween,
                    start: "left 30%",
                    end: "right right",
                    scrub: 1.5,
                }
            });

            // 1. 动画 "Intro" 部分
            saltLakeTimeline.add("intro", 0);

            // [!code modification]
            // 文本 1 向左移动 50vw (屏幕宽度的一半)，并保持可见
            saltLakeTimeline.to(splitText1, {
                x: '-30vw',          // [!code ++] (使用视口宽度确保移开)
                // xPercent: -100,      // [!code --]
                // autoAlpha: 0,        // [!code --] (移除淡出)
                ease: "power2.inOut",// [!code modification] (使用更平滑的缓动)
                duration: 1,
            }, "intro");

            // [!code modification]
            // 文本 2 向右移动 50vw，并保持可见
            saltLakeTimeline.to(splitText2, {
                x: '30vw',           // [!code ++]
                // xPercent: 100,       // [!code --]
                // autoAlpha: 0,        // [!code --] (移除淡出)
                ease: "power2.inOut",// [!code modification]
                duration: 1,
            }, "intro");

            // [!code focus:start]
            // [新] 英文动画 (与中文同步)
            const splitEnglish1 = splitEnglishRef1.current!;
            const splitEnglish2 = splitEnglishRef2.current!;

            saltLakeTimeline.to(splitEnglish1, {
                x: '-30vw',          // [!code ++] (使用视口宽度确保移开)
                // xPercent: -100,      // [!code --]
                // autoAlpha: 0,        // [!code --] (移除淡出)
                ease: "power2.inOut",// [!code modification] (使用更平滑的缓动)
                duration: 1,
            }, "intro");

            saltLakeTimeline.to(splitEnglish2, {
                x: '30vw',           // [!code ++]
                // xPercent: 100,       // [!code --]
                // autoAlpha: 0,        // [!code --] (移除淡出)
                ease: "power2.inOut",// [!code modification]
                duration: 1,
            }, "intro");
            // [!code focus:end]

            // 视频容器从 0 放大到 1 (保持不变)
            saltLakeTimeline.fromTo(saltLakeVideoContainer, {
                scale: 0,
                autoAlpha: 0,
            }, {
                scale: 1,
                autoAlpha: 1,
                ease: "power2.out",
                duration: 1.2,
            }, "intro");

            // --- [删除] 移除了 3D 旋转 (rotateY) 动画 ---

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
                                    拨开云雾，你来到了青藏高原，这里是雪山与冰川的故乡。
                                    冰川融水汇聚成河，一路向东。
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
                                你背起行囊，便叩问了这般雪域天穹。这里是山河的源头，
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

                    {/* --- [新] 幻灯片 6: 进度条 --- */}
                    <div
                        className={`${styles.slide} ${styles.slideProgressBar}`}
                        ref={progressBarSlideRef}
                    >
                        {/* data-animate 用于整体淡入 */}
                        <div className={styles.loadingContainer} data-animate="text-fade-in">
                            <img
                                // [!code warning] 确保你有这个图片文件
                                src="/images/loading-top.jpg" // 假设图片路径
                                alt="加载插画"
                                className={styles.loadingImage}
                            />
                            {/* 1. 百分比文本 */}
                            <div className={styles.loadingText}>
                                {/* [!code ++] 使用 ref */}
                                辞别这片圣地，愿将冈仁波齐的祝福与静穆，带往尘世的每一步: <span ref={progressTextRef}>0%</span>
                            </div>

                            {/* 2. 进度条轨道 */}
                            <div className={styles.progressBarTrack}>
                                {/* [!code ++] 
                                  进度条填充
                                  我们将用 GSAP 动画化这个元素的 scaleX
                              */}
                                <div className={styles.progressBarFill} ref={progressFillRef}></div>
                            </div>

                            {/* 3. 底部说明文字 */}
                            <p className={styles.loadingCaption}>
                                OUR JOURNEY COMMENCES AT THE SUMMIT OF THE WORLD. THIS IS THE SOURCE OF THE GREAT RIVERS AND MOUNTAINS, WHERE SNOW-CAPPED PEAKS STAND IN SILENT GRANDEUR, GLACIERS GLITTER WITH ETERNAL LIGHT, AND LAKES LIE AS STILL AS MIRRORS, REVEALING THE PURE, MONUMENTAL SPLENDOR OF THE DAWN OF CREATION.
                            </p>
                        </div>
                    </div>


                    {/* --- [修改] 幻灯片 7: 慕士塔格峰 --- */}
                    <div className={`${styles.slide} ${styles.slideMuztaghAta}`}>

                        {/* 1. 全屏背景视频 */}
                        <video
                            // [!code warning] 确保你有这个视频文件
                            src="/videos/muztagh-ata-bg.mp4"
                            muted
                            autoPlay
                            loop
                            playsInline
                            className={styles.fullScreenVideo}
                        />

                        {/* 3. 主要内容 (同冈仁波齐的 .textContent) */}
                        <div className={styles.mainContent}>
                            {/* 复用冈仁波齐的 .textContent 样式 */}
                            <div className={styles.textContent} data-animate="text-fade-in">
                                <h2>慕士塔格峰</h2>
                                <p>
                                    你来到了慕士塔格峰，这是帕米尔高原上的巨擎，冷峻，纯粹，守护着古老的丝路。
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- [修改] 幻灯片 8: 察尔汗盐湖 --- */}
                    <div
                        className={`${styles.slide} ${styles.slideSaltLake}`}
                        ref={saltLakeSlideRef}
                    >
                        {/* 1. 分裂的文本 */}
                        <h2 className={styles.splitTextContainer}>
                            {/* 中文行 */}
                            <div className={styles.splitChinese}>
                                <span ref={splitTextRef1}>你来到了</span>
                                <span ref={splitTextRef2}>察尔汗盐湖</span>
                            </div>
                            {/* 英文行 */}
                            <div className={styles.splitEnglish}>
                                <span ref={splitEnglishRef1}>You have arrived at</span>
                                <span ref={splitEnglishRef2}>Qarhan Salt Lake</span>
                            </div>
                        </h2>

                        {/* 2. 视频容器 */}
                        <div
                            className={styles.saltLakeVideoContainer}
                            ref={saltLakeVideoContainerRef}
                        >
                            <video
                                src="/videos/salt-lake.mp4"
                                muted autoPlay loop playsInline
                            />
                            <p>
                                当山峰隐去，大地变为镜面。在这里，天空与大地再无分别。
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default HorizontalStorySection;