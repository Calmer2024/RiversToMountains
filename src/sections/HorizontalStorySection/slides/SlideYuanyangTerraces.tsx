import type { FC } from 'react';
import { useRef } from 'react'; // 导入 useRef
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideYuanyangTerraces.module.scss';
import { useScroll } from '../ScrollContext'; // 导入 ScrollContext

export const SlideYuanyangTerraces: FC = () => {
    const slideRef = useRef<HTMLDivElement>(null);
    const { horizontalTween } = useScroll(); // 获取主滚动动画

    useLayoutEffect(() => {
        const slide = slideRef.current;
        if (!slide || !horizontalTween) return;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: slide,
                    containerAnimation: horizontalTween,
                    start: "left 70%", // 当幻灯片进入视口30%时开始动画
                    end: "left -50%",    // 当幻灯片左边缘到达视口左边缘时动画结束
                    toggleActions: "play reverse play reverse", // 进入播放，离开反向
                    // scrub: true, // [可选] 如果想让动画与滚动条联动，可以取消注释
                }
            });

            // 图片淡入动画
            tl.fromTo(slide.querySelectorAll(`.${styles.imageWrapper}`),
                { autoAlpha: 0, scale: 0.95, y: 20 },
                { autoAlpha: 1, scale: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.05 },
                0 // 从时间轴开始时执行
            );

            // 文案淡入动画
            tl.fromTo(slide.querySelectorAll(`.${styles.mainTitle}`),
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
                0.2 // 稍微延迟开始
            );
            tl.fromTo(slide.querySelectorAll(`.${styles.subTitle}`),
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
                0.4 // 进一步延迟
            );
            tl.fromTo(slide.querySelectorAll(`.${styles.description}`),
                { autoAlpha: 0, y: 10 },
                { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
                0.6 // 最后延迟
            );

            // 如果需要图片视差效果，可以在这里添加额外的 ScrollTrigger
            // 例如，让图片在滚动时有轻微的Y轴偏移
            slide.querySelectorAll(`.${styles.imageWrapper}`).forEach((imgWrapper, i) => {
                gsap.to(imgWrapper, {
                    yPercent: (i % 2 === 0 ? 5 : -5), // 交替上下移动
                    ease: "none",
                    scrollTrigger: {
                        trigger: imgWrapper,
                        containerAnimation: horizontalTween,
                        start: "left right", // 当图片进入视口时开始
                        end: "right left",   // 当图片离开视口时结束
                        scrub: true,         // 与滚动条实时绑定
                    }
                });
            });


        }, slide);

        return () => ctx.revert();
    }, [horizontalTween]);

    const imageUrls = Array.from({ length: 16 }, (_, i) => `/images/yuanyang/yy${i + 1}.png`);

    return (
        <div ref={slideRef} className={`${parentStyles.slide} ${styles.slideYuanyangTerraces}`}>
            <div className={styles.imageGrid}>
                {imageUrls.map((url, index) => (
                    <div key={index} className={styles.imageWrapper}>
                        <img src={url} alt={`元阳梯田 ${index + 1}`} loading="lazy" />
                    </div>
                ))}
            </div>

            <div className={styles.textOverlay}>
                <h2 className={styles.mainTitle}>元阳梯田</h2>
                <p className={styles.description}>
                    人与自然携手，用上千年时间，在山间雕刻出的光影阶梯。
                </p>
            </div>
        </div>
    );
};