// src/sections/HeroSection.tsx

import React from 'react';
import styles from './HeroSection.module.scss';
import { Button } from '../components/Button';

interface HeroSectionProps {
    videoSrc: string;
    posterImage: string;
    // title: string;
    subtitle: string;
    logoImageSrc?: string;
    logoAlt?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    videoSrc,
    posterImage,
    // title,
    subtitle,
    logoImageSrc,
    logoAlt = '标题 Logo',
}) => {
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
                {/* <h1 className={styles.title}>{title}</h1> */}
                <p className={styles.subtitle}>{subtitle}</p>

                <Button variant="secondary">开始探索</Button>
            </div>
        </section>
    );
};

export default HeroSection;