// src/sections/HeroSection.tsx
import React from 'react';
import styles from './HeroSection.module.scss';
import { Button } from '../components/Button';

interface HeroSectionProps {
    videoSrc: string;
    posterImage: string;
    subtitle: string;
    logoImageSrc?: string;
    logoAlt?: string;
    
    // ✨ 最终修正：
    // 类型必须与 `useRef<HTMLDivElement>(null)` 的返回类型完全一致
    // 即 React.RefObject<HTMLDivElement | null>
    scrollTargetRef?: React.RefObject<HTMLDivElement | null>;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    videoSrc,
    posterImage,
    subtitle,
    logoImageSrc,
    logoAlt = '标题 Logo',
    scrollTargetRef
}) => {
    
    const handleButtonClick = () => {
        // 这个检查逻辑 (scrollTargetRef && scrollTargetRef.current)
        // 已经正确处理了 .current 可能为 null 的情况，所以无需更改。
        if (scrollTargetRef && scrollTargetRef.current) {
            scrollTargetRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start' 
            });
        }
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.videoContainer}>
                <video
                    src={videoSrc}
                    poster={posterImage}
                    className={styles.videoBackground}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <div className={styles.overlay}></div>
            </div>

            <div className={styles.contentContainer}>
                <img src={logoImageSrc} alt={logoAlt} className={styles.logoTitle} />
                <p className={styles.subtitle}>{subtitle}</p>

                <div className={styles.buttonContainer}>
                    <Button 
                        variant="secondary"
                        onClick={handleButtonClick}
                    >
                        开始探索
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;