import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.scss';

// 组件
import { Header } from './components/Header';
import OpeningAnimation from './components/OpeningAnimation';
import CompanionSystem from './components/CompanionSystem';

// 页面
import BpcoPage from './sections/BpcoPage';
import FeedbackPage from './sections/FeedbackPage';

// 区域 (Sections)
import HeroSection from './sections/HeroSection';
import { HorizontalStorySection } from './sections/HorizontalStorySection/HorizontalStorySection';
import { StoryHeaderSection } from './sections/StoryHeaderSection';

/**
 * 主页组件
 * 包含了开场动画和主页所有内容
 */
function HomePage() {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
  };

  // // 动画未完成时，只显示动画
  // if (!animationCompleted) {
  //   return <OpeningAnimation onAnimationComplete={handleAnimationComplete} />;
  // }

  // 动画完成后，显示主页内容
  return (
    <div className="app-container">
      <Header />
      <HeroSection
        videoSrc="/videos/hero-video.mp4"
        posterImage="/images/hero-poster.jpg"
        logoImageSrc="/images/title.png"
        logoAlt="山河奇景 网站 Logo"
        subtitle="A sanctuary nestled in the classic landscapes of China"
        buttonLink="/bpco"
      />
      <StoryHeaderSection />
      <HorizontalStorySection />
      {/* <CompanionSystem /> */}
    </div>
  );
}

function CompanionPage() {
  return (
    <>
      <Header />
      <CompanionSystem />
    </>
  );
}

/**
 * 根组件
 * 负责处理应用级路由
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* 路由：主页 */}
        <Route path="/" element={<HomePage />} />

        {/* 路由：陪伴系统 */}
        <Route path="/outside" element={<CompanionPage />} />
        
        {/* 路由：Bpco 页面 */}
        <Route path="/bpco" element={<BpcoPage />} />
        
        {/* 路由：开发者反馈页面 */}
        <Route path="/developer" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;