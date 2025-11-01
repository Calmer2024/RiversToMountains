import { type FC, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

import styles from './CardCarousel.module.scss';
import { spots, type ScenicSpot } from '../data/scenicSpots';

export const CardCarousel: FC = () => {
    const swiperRef = useRef<any>(null);

    const handleCardClick = useCallback((index: number, spotId: string) => {
        if (!swiperRef.current) return;
        const activeIndex = swiperRef.current.swiper.realIndex;

        if (index === activeIndex) {
            console.log(`点击了中间的卡片 ${spotId}，准备跳转！`);
        } else {
            swiperRef.current.swiper.slideToLoop(index);
        }
    }, []);

    const onCardTransition = (swiper: any, transition: number) => {
        swiper.slides.forEach((slide: HTMLElement) => {
            slide.style.transitionDuration = `${transition}ms`;
        });
    };

    const onCardProgress = (swiper: any) => {
        swiper.slides.forEach((slide: HTMLElement, index: number) => {
            const progress = (slide as any).progress;
            if (typeof progress !== 'number') return;

            const absProgress = Math.abs(progress);

            let scale = 1;
            let rotate = 0; // Z轴旋转角度
            let translateX = 0;
            let translateY = 0;
            let zIndex = 100 - absProgress * 10; // 离中间越远，z-index越小
            let opacity = 1;

            // 根据 progress 调整样式
            if (progress === 0) { // 中间卡片
                scale = 1;
                rotate = 0;
                translateX = 0;
                translateY = 0;
                zIndex = 100;
                opacity = 1;
            } else { // 左右两侧卡片 (包括那些只露出一半的)
                // 基础缩放和透明度
                scale = 0.85; // 左右卡片缩小到 85%
                opacity = 0.8;

                // X轴偏移量，用于实现“露出一半”的效果
                const slideWidth = slide.offsetWidth;
                const offsetPx = (slideWidth * (1 - scale)) / 2 + (slideWidth * 1); // 调整此处的 0.4 来控制露出多少

                if (progress > 0) { // 右侧卡片
                    rotate = -2; // 倾斜角度
                    // translateX = swiper.width / 2 * progress; // 基本向右偏移
                    // 进一步调整 translateX，使其部分可见并向外多露
                    // translateX = (swiper.width / 2 + slideWidth / 2) - offsetPx;
                    translateY = (absProgress * 20); // 略微向上或向下调整Y轴
                    zIndex = 90; // 右侧卡片比中间的低
                } else { // 左侧卡片
                    rotate = 2;
                    // translateX = -(swiper.width / 2 * absProgress); // 基本向左偏移
                    // 进一步调整 translateX，使其部分可见并向外多露
                    translateX = -((swiper.width / 2 + slideWidth / 2) - offsetPx);
                    translateY = (absProgress * 20); // 略微向上或向下调整Y轴
                    zIndex = 90; // 左侧卡片比中间的低
                }

                // 进一步调整左右卡片的 z-index，让最靠近中间的在更上面
                if (absProgress > 0 && absProgress < 1) { // 紧挨着中间的卡片
                    zIndex = 95 - (progress > 0 ? 0 : 1); // 右边的 z-index 95, 左边的 94
                } else { // 更远的卡片
                    zIndex = 80 - (progress > 0 ? 0 : 1);
                }

                // 确保远处的卡片透明度更低
                if (absProgress > 1) {
                    opacity = 0.5;
                    scale = 0.75;
                    zIndex = 80;
                }
            }

            // 应用 transform 属性
            slide.style.transform = `translateY(${translateY}px) scale(${scale}) rotateZ(${rotate}deg)`;
            // slide.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotateZ(${rotate}deg)`;
            slide.style.opacity = `${opacity}`;
            slide.style.zIndex = `${Math.floor(zIndex)}`; // z-index 必须是整数
        });
    };

    return (
        <section className={styles.carouselSection}>
            <Swiper
                ref={swiperRef}
                modules={[Autoplay]}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                loop={true}

                // slidesPerView 设为 'auto'，让 CSS 决定卡片宽度
                slidesPerView={'auto'}
                centeredSlides={true}
                spaceBetween={30}
                grabCursor={true}
                watchSlidesProgress={true}
                onProgress={onCardProgress}
                onSetTransition={onCardTransition}
                className={styles.swiperContainer}
            >
                {spots.map((spot, index) => (
                    <SwiperSlide
                        key={spot.id}
                        className={styles.swiperSlide}
                        onClick={() => handleCardClick(index, spot.id)}
                    >
                        <div
                            className={styles.cardContent}
                            style={{ backgroundImage: `url(${spot.imageSrc})` }}
                        >
                            <div className={styles.cardText}>
                                <h3>{spot.title}</h3>
                                <p>{spot.subtitle}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};