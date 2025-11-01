// // components/OpeningAnimation.tsx
// import { useEffect, useState } from 'react'; // 不要导入整个 React
// import './OpeningAnimation.css'; // 使用 CSS 而不是 SCSS

// interface OpeningAnimationProps {
//   onAnimationComplete?: () => void;
// }

// const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onAnimationComplete }) => {
//   const [show, setShow] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShow(false);
//       if (onAnimationComplete) {
//         onAnimationComplete();
//       }
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, [onAnimationComplete]);

//   if (!show) {
//     return null;
//   }

//   return (
//     <div className="opening-animation">
//       <div className="animation-content">
//         <h1 className="main-title">山河图鉴</h1>
//         <p className="subtitle">方寸屏间，万里河山</p>
//         <div className="loading-text">画卷徐徐展开中...</div>
//       </div>
//     </div>
//   );
// };

// export default OpeningAnimation;

// components/OpeningAnimation.tsx
import { useEffect, useState } from 'react';
import './OpeningAnimation.css';

interface OpeningAnimationProps {
  onAnimationComplete?: () => void;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onAnimationComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStage(1), 500);
    const timer2 = setTimeout(() => setCurrentStage(2), 2000);
    const timer3 = setTimeout(() => setCurrentStage(3), 4500);
    const timer4 = setTimeout(() => {
      setShowContent(true);
      if (onAnimationComplete) onAnimationComplete();
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onAnimationComplete]);

  return (
    <div className={`opening-animation ${showContent ? 'fade-out' : ''}`}>
      {/* 背景 */}
      <div className="animation-bg"></div>
      
      {/* 卷轴容器 */}
      <div className={`scroll-container ${currentStage >= 1 ? 'scroll-open' : ''}`}>
        
        {/* 卷轴左侧 */}
        <div className="scroll-left">
          {/* 注释: 替换下面的图片路径为您的卷轴左侧素材 */}
          {/* 建议图片放在 public/images/ 目录下 */}
          <img 
            src="/images/hero-poster.JPG" 
            alt="卷轴左侧" 
            className="scroll-image"
          />
        </div>
        
        {/* 卷轴中间画布 */}
        <div className="scroll-center">
          <div className={`scroll-content ${currentStage >= 2 ? 'content-visible' : ''}`}>
            <h1 className="main-title">山河图鉴</h1>
            <p className="subtitle">方寸屏间，万里河山</p>
            
            {/* 山水画 - 可以替换为您的山水素材 */}
            <div className="landscape-simple">
              <div className="mountain"></div>
              <div className="river"></div>
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
            </div>
          </div>
        </div>
        
        {/* 卷轴右侧 */}
        <div className="scroll-right">
          {/* 注释: 替换下面的图片路径为您的卷轴右侧素材 */}
          <img 
            src="/images/title.png" 
            alt="卷轴右侧" 
            className="scroll-image"
          />
        </div>
      </div>
      
      {/* 加载提示 */}
      <div className={`loading-hint ${currentStage >= 2 ? 'hint-visible' : ''}`}>
        画卷徐徐展开中...
      </div>
    </div>
  );
};

export default OpeningAnimation;