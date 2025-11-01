// components/OpeningAnimation.tsx
import { useEffect, useState } from 'react'; // 不要导入整个 React
import './OpeningAnimation.css'; // 使用 CSS 而不是 SCSS

interface OpeningAnimationProps {
  onAnimationComplete?: () => void;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onAnimationComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!show) {
    return null;
  }

  return (
    <div className="opening-animation">
      <div className="animation-content">
        <h1 className="main-title">山河图鉴</h1>
        <p className="subtitle">方寸屏间，万里河山</p>
        <div className="loading-text">画卷徐徐展开中...</div>
      </div>
    </div>
  );
};

export default OpeningAnimation;