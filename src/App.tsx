// // App.tsx
// import React, { useState } from 'react'; // 新增的导入
// import HeroSection from './sections/HeroSection';
// import './styles/global.scss';
// import { Header } from './components/Header';
// import { CardCarousel } from './sections/CardCarousel';
// import OpeningAnimation from './components/OpeningAnimation'; // 新增的导入

// function App() {
//   const [animationCompleted, setAnimationCompleted] = useState(false); // 新增的状态

//   const handleAnimationComplete = () => {
//     setAnimationCompleted(true);
//   };

//   // 新增的条件渲染逻辑
//   if (!animationCompleted) {
//     return <OpeningAnimation onAnimationComplete={handleAnimationComplete} />;
//   }

//   // 以下是您的原始代码，完全保持不变
//   return (
//     <div className="app-container">
//       <Header />
//       <HeroSection
//         videoSrc="/videos/hero-video.mp4"
//         posterImage="/images/hero-poster.jpg"
//         logoImageSrc="/images/title.png"
//         logoAlt="山河奇景 网站 Logo"
//         subtitle="A sanctuary nestled in the classic landscapes of China"
//       />
//       <CardCarousel />
//     </div>
//   );
// }

// export default App;

// App.tsx
import { useState } from 'react';
import HeroSection from './sections/HeroSection';
import './styles/global.scss';
import { Header } from './components/Header';
import { CardCarousel } from './sections/CardCarousel';
import OpeningAnimation from './components/OpeningAnimation';

function App() {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
  };

  if (!animationCompleted) {
    return <OpeningAnimation onAnimationComplete={handleAnimationComplete} />;
  }

  return (
    <div className="app-container">
      <Header />
      <HeroSection
        videoSrc="/videos/hero-video.mp4"
        posterImage="/images/hero-poster.jpg"
        logoImageSrc="/images/title.png"
        logoAlt="山河奇景 网站 Logo"
        subtitle="A sanctuary nestled in the classic landscapes of China​"
      />
      <CardCarousel />
    </div>
  );
}

export default App;