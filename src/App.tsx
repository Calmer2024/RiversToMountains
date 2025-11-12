import React, { useState,useEffect, useRef } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.scss';

// 组件
import {Header} from './components/Header';
import OpeningAnimation from './components/OpeningAnimation';
import CompanionSystem from './components/CompanionSystem';

// 页面
import BpcoPage from './sections/BpcoPage';
import FeedbackPage from './sections/FeedbackPage';

// 区域 (Sections)
import HeroSection from './sections/HeroSection';
import {HorizontalStorySection} from './sections/HorizontalStorySection/HorizontalStorySection';
import {StoryHeaderSection} from './sections/StoryHeaderSection';
import { IntroSection } from './sections/IntroSection';
import { StatsSection } from './sections/StatsSection';


import TestPlayground from "./TestPlayground.tsx";
import {FeatureSection} from "./sections/FeatureSection.tsx";
import {TextMaskSection} from "./sections/TextMaskSection.tsx";

/**
 * 主页组件
 * 包含了开场动画和主页所有内容
 */
function HomePage() {
  // 用于控制 Header 隐藏
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  // 用于引用 <HorizontalStorySection /> 包装器的 ref
  const storySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const HEADER_HEIGHT_PX = 100;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderHidden(true);
        }else {
          // 目标元素不再相交。
          // 这有两种情况：
          // 1. 页面刚加载，元素在视口下方 (top > 100px)
          // 2. 
          // 用户向上滚动，元素回到了触发区上方 (top > 100px)
          
          // 检查元素的顶部是否在触发线 *以下*
          // (boundingClientRect.top > HEADER_HEIGHT_PX)
          if (entry.boundingClientRect.top > HEADER_HEIGHT_PX) {
            // 这适用于 "页面加载" 和 "向上滚动"
            // 此时应该显示 Header
            setIsHeaderHidden(false);
          }
          
          // 还有第三种情况：
          // 3. 用户继续向下滚动，元素完全离开了视口 (top < 0)
          // 此时, (entry.boundingClientRect.top > HEADER_HEIGHT_PX) 为 false
          // 所以我们什么也不做，Header 保持隐藏。
        }
      },
      {
        // 触发线：在视口顶部 向下 70px 的位置。
        // 当 storySectionRef 的顶部 碰到 这条线时...
        rootMargin: `-${HEADER_HEIGHT_PX}px 0px 0px 0px`,
        threshold: 0 // 只要一碰到就触发
      }
    );

    const currentRef = storySectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // 空依赖数组，确保只运行一次


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
      <Header isHidden={isHeaderHidden} />
      <HeroSection
        videoSrc="/videos/hero-video.mp4"
        posterImage="/images/hero-poster.jpg"
        logoImageSrc="/images/title.png"
        logoAlt="山河奇景 网站 Logo"
        subtitle="A sanctuary nestled in the classic landscapes of China"
        buttonLink="/bpco"
      />
      <StatsSection />
      <IntroSection />
      <FeatureSection />
      <TextMaskSection />
      <StoryHeaderSection />
      <div ref={storySectionRef}>
        <HorizontalStorySection />
      </div>
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
        <Route path="/bpco" element={<BpcoPage/>}/>

        {/* 路由：开发者反馈页面 */}
        <Route path="/developer" element={<FeedbackPage/>}/>

        {/*测试组件用*/}
        <Route path="/test" element={<TestPlayground/>}/>
      </Routes>
    </Router>
  );
}

export default App;