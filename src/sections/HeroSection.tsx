import React, { useRef, useState, useEffect } from 'react';
import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  videoSrc: string;
  posterImage: string;
  subtitle: string;
  logoImageSrc?: string;
  logoAlt?: string;
  scrollTargetRef?: React.RefObject<HTMLDivElement | null>;
}

// --- ✨ 子组件：磁力按钮 (模仿 Ether 风格) ---
const MagneticButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    // 计算鼠标相对于按钮中心的偏移量
    const x = (e.clientX - (left + width / 2)) * 0.3; // 0.3 是磁力强度
    const y = (e.clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 }); // 鼠标离开回弹
  };

  return (
    <button
      ref={btnRef}
      className={styles.magneticButton}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <span className={styles.btnText}>{children}</span>
      <div className={styles.btnFill}></div>
    </button>
  );
};

const HeroSection: React.FC<HeroSectionProps> = ({
  videoSrc,
  posterImage,
  subtitle,
  logoImageSrc,
  logoAlt = '标题 Logo',
  scrollTargetRef
}) => {
  // 视差背景逻辑
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleButtonClick = () => {
    if (scrollTargetRef && scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  return (
    <section className={styles.heroSection}>
      {/* 1. 视频背景层 (带视差效果) */}
      <div 
        className={styles.videoContainer}
        style={{ transform: `translateY(${offsetY * 0.5}px)` }} // 视频移动速度慢于前景，产生视差
      >
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
        {/* ✨ 创造性添加：噪点纹理，增加电影质感 */}
        <div className={styles.noiseOverlay}></div>
      </div>

      {/* 2. 内容层 */}
      <div className={styles.contentContainer}>
        {/* Logo 区域 */}
        <div className={styles.logoWrapper}>
          <img src={logoImageSrc} alt={logoAlt} className={styles.logoTitle} />
        </div>

        {/* 副标题区域 (优化排版) */}
        <div className={styles.subtitleWrapper}>
          <span className={styles.decorativeLine}></span>
          <div className={styles.subtitleContent}>
            <p className={styles.zhSubtitle}>人间值得 · 山水相逢</p>
            <p className={styles.enSubtitle}>{subtitle}</p>
          </div>
          <span className={styles.decorativeLine}></span>
        </div>

        {/* 按钮区域 */}
        <div className={styles.buttonWrapper}>
          <MagneticButton onClick={handleButtonClick}>
            START
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;