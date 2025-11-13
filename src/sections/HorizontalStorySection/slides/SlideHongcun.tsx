import { useState, useMemo, type FC, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScroll } from '../ScrollContext';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideHongcun.module.scss'; // [!] 导入自己的 SCSS

// [!] 1. 定义我们“宏村之旅”的停靠点数据
const stopsData = [
    {
        image: "/images/hongcun/hongcun-1-moon.jpg", 
        title: "月沼倒影",
        subTitle: "水墨画的“留白”",
        description: "白墙黑瓦，水墨画的“留白”与“归宿”。人间的烟火，在此刻静止。"
    },
    {
        image: "/images/hongcun/wuzhen-bridge.jpg", 
        title: "乌镇水乡",
        subTitle: "枕水人家",
        description: "小桥，流水，人家。乌篷船摇曳过千年的时光，这里是梦里的江南。"
    },
    {
        image: "/images/hongcun/suzhou-garden.jpg", 
        title: "苏州园林",
        subTitle: "咫尺之内再造乾坤",
        description: "移步换景，曲径通幽。亭台楼阁与山水倒影，构成了江南园林的精巧与雅致。"
    },
    {
        image: "/images/hongcun/hongcun-4-alley.jpg",
        title: "清晨巷陌",
        subTitle: "人间烟火",
        description: "当第一缕炊烟升起，古老的村落便苏醒过来，石板路被岁月磨得温润。"
    }
];
const TOTAL_STOPS = stopsData.length;

export const SlideHongcun: FC = () => {
    const { horizontalTween } = useScroll();
    const slideRef = useRef<HTMLDivElement>(null);
    
    // [!] 2. 使用 State 来跟踪当前激活的停靠点
    const [activeIndex, setActiveIndex] = useState(0);

    // [!] 3. 点击处理函数：循环切换到下一个点
    const handleNextStop = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % TOTAL_STOPS);
    };

    // [!] 4. 计算小车的位置 (百分比)
    const carPosition = useMemo(() => {
        return (activeIndex / (TOTAL_STOPS - 1)) * 100;
    }, [activeIndex]);

    // [!] 5. 使用 GSAP 实现整个幻灯片的“初始淡入”
    useLayoutEffect(() => {
        if (!horizontalTween || !slideRef.current) return;
        
        const slide = slideRef.current;
        let ctx = gsap.context(() => {
            gsap.from(slide, {
                autoAlpha: 0,
                scrollTrigger: {
                    trigger: slide,
                    containerAnimation: horizontalTween,
                    start: "left 80%", // 当幻灯片进入 20% 时触发
                    toggleActions: "play none none reverse",
                }
            });
        }, slide);
        return () => ctx.revert();
    }, [horizontalTween]);

    return (
        // [!] 6. 点击幻灯片任意位置都会切换
        <div 
            className={`${parentStyles.slide} ${styles.slideHongcun}`} 
            ref={slideRef}
            onClick={handleNextStop}
        >
            {/* --- A. 变化的图片背景 --- */}
            <div className={styles.imageContainer}>
                {stopsData.map((stop, index) => (
                    <div
                        key={index}
                        className={`${styles.image} ${index === activeIndex ? styles.active : ''}`}
                        style={{ backgroundImage: `url(${stop.image})` }}
                    />
                ))}
                <div className={styles.overlay}></div> {/* 蒙版 */}
            </div>

            {/* --- B. 变化的文本内容 --- */}
            <div className={styles.textContainer}>
                {stopsData.map((stop, index) => (
                    <div 
                        key={index}
                        className={`${styles.textContent} ${index === activeIndex ? styles.active : ''}`}
                    >
                        <h3 className={styles.subTitle}>{stop.subTitle}</h3>
                        <h2 className={styles.mainTitle}>{stop.title}</h2>
                        <div className={styles.divider}></div>
                        <p className={styles.description}>{stop.description}</p>
                    </div>
                ))}
            </div>
            
            {/* --- C. 底部时间轴 --- */}
            <div className={styles.timelineContainer}>
                {/* 1. 坐标轴 */}
                <div className={styles.axis}>
                    <div className={styles.stopsWrapper}>
                        {stopsData.map((_, index) => (
                            <div 
                                key={index}
                                className={`${styles.stop} ${index === activeIndex ? styles.active : ''}`}
                            />
                        ))}
                    </div>
                    {/* 2. 小车 */}
                    <div className={styles.car} style={{ left: `${carPosition}%` }}>
                        <img
                            src="/images/电动自行车-侧面.svg" 
                            alt="当前位置"
                            className={styles.carIcon} 
                        />
                    </div>
                </div>
                {/* 3. 交互提示 */}
                <div className={styles.clickPrompt}>
                    [ 点击任意处，前往下一站 ]
                </div>
            </div>
        </div>
    );
};