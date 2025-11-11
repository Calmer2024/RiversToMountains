// src/sections/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.scss';
import { Button } from '../components/Button';

interface HeroSectionProps {
    videoSrc: string;
    posterImage: string;
    subtitle: string;
    logoImageSrc?: string;
    logoAlt?: string;
    buttonLink?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    videoSrc,
    posterImage,
    subtitle,
    logoImageSrc,
    logoAlt = '标题 Logo',
    buttonLink = ""
}) => {
    const navigate = useNavigate();
    
    const handleButtonClick = () => {
        if (buttonLink.startsWith('http')) {
            // 外部链接
            window.location.href = buttonLink;
        } else {
            // 内部路由
            navigate(buttonLink);
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

                <Button 
                    variant="secondary" 
                >
                    开始探索
                </Button>
            </div>
        </section>
    );
};

export default HeroSection;