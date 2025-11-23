import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideFinale.module.scss'; // [!] 导入自己的 SCSS

export const SlideFinale: FC = () => {

    // [!] 新功能: "返回顶部" 的处理函数
    const handleScrollToTop = () => {
        // [!] 关键: 滚动整个浏览器窗口, 而不是 GSAP 容器
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });
    };

    return (
        // [!] 修改类名
        <div className={`${parentStyles.slide} ${styles.slideFinaleWrapper}`}>
            <div className={styles.chapterTitleCard} data-animate="text-fade-in">
                <div className={styles.chapterTitleWrapper}>
                    <h2>山河未尽</h2>
                    <img
                        src="/images/slides/山河未尽.png" 
                        alt="终章"
                        className={styles.titleIcon}
                    />
                </div>
                <div className={styles.divider}></div>
                <h3 className={styles.chapterSubtitle}>终章·合朔</h3>
                <p>
                    画卷虽有尽，探索永无垠。
                    <br /> 
                    我们的旅途，才刚刚启程；我们的故事，才刚刚开始。
                </p>

                <button 
                    className={styles.scrollTopButton} 
                    onClick={handleScrollToTop}
                >
                    归途
                </button>
            </div>
        </div>
    );
};