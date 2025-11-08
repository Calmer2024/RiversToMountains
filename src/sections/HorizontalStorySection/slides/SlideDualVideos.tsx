import { useState, type FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideDualVideos.module.scss';

export const SlideDualVideos: FC = () => {
    const [isLeftHovered, setIsLeftHovered] = useState(false);
    const [isRightHovered, setIsRightHovered] = useState(false);

    // [!] 移除所有 GSAP 和 useLayoutEffect

    return (
        // [!] 覆盖父级 .slide 样式, 移除 padding
        <div
            className={`${parentStyles.slide} ${styles.slideDualVideos}`}
        >
            {/* [!] 移除 .dualContainer, 我们现在是 50/50 布局 */}

            {/* --- 左侧: 九寨沟 --- */}
            <div
                // [!] .videoCard 现在是 .cardLeft
                className={`${styles.videoCard} ${styles.cardLeft} ${isLeftHovered ? styles.isHovered : ''}`}
                onMouseEnter={() => setIsLeftHovered(true)}
                onMouseLeave={() => setIsLeftHovered(false)}
            >
                {/* [!] 1. <video> 已被移除, 背景在 CSS 中 */}

                {/* 2. 模糊/变暗 蒙版 (保持不变) */}
                <div className={styles.blurMask}></div>

                {/* 3. [新] 角标 - 左上 */}
                <span className={styles.cornerTextTopLeft}>​​Jiuzhaigou Valley​</span>

                {/* 4. [新] 角标 - 右上 */}
                <span className={styles.cornerTextTopRight}>STARTUP</span>

                {/* 5. [新] 前景图片 */}
                <img
                    src="/images/cards/jiuzhaigou-fg.jpg" // [!] 确保你有这个图片
                    alt="九寨沟前景"
                    className={styles.foregroundImage}
                />

                {/* 6. 主要文本内容 (悬停显示) */}
                <div className={styles.textContent}>
                    <h3 className={styles.stylishTitle}>五彩瑶池</h3>
                    <h2>九寨沟</h2>
                    <p>神明打翻的调色盘。水是这里的主角，色彩是它的灵魂。</p>
                </div>

                {/* [!] 顶部/底部 hoverText 已被移除 */}
            </div>

            {/* --- 右侧: 虎跳峡 --- */}
            <div
                // [!] .videoCard 现在是 .cardRight
                className={`${styles.videoCard} ${styles.cardRight} ${isRightHovered ? styles.isHovered : ''}`}
                onMouseEnter={() => setIsRightHovered(true)}
                onMouseLeave={() => setIsRightHovered(false)}
            >
                {/* 1. <video> 已被移除, 背景在 CSS 中 */}

                {/* 2. 模糊/变暗 蒙版 */}
                <div className={styles.blurMask}></div>

                {/* 3. [新] 角标 - 左上 */}
                <span className={styles.cornerTextTopLeft}>Tiger Leaping Gorge</span>

                {/* 4. [新] 角标 - 右上 */}
                <span className={styles.cornerTextTopRight}>REGIONAL</span>

                {/* 5. [新] 前景图片 */}
                <img
                    src="/images/cards/tiger-gorge-fg.jpg" // [!] 确保你有这个图片
                    alt="虎跳峡前景"
                    className={styles.foregroundImage}
                />

                {/* 6. 主要文本内容 (悬停显示) */}
                <div className={styles.textContent}>
                    <h3 className={styles.stylishTitle}>江河的咆哮</h3>
                    <h2>虎跳峡</h2>
                    <p>金沙江在此奔腾。聆听山川被“雕刻”的声音，感受原始的力量。</p>
                </div>

                {/* [!] 顶部/底部 hoverText 已被移除 */}
            </div>
        </div>
    );
};