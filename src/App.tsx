import React, { useState, useEffect, useRef } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.scss';

// 组件
import {Header} from './components/Header';
import OpeningAnimation from './components/OpeningAnimation/OpeningAnimation';
import CompanionSystem from './components/CompanionSystem';

// 页面
import BpcoPage from './sections/BpcoPage';
import FeedbackPage from './sections/FeedbackPage';

// 区域 
import HeroSection from './sections/HeroSection';
import {HorizontalStorySection} from './sections/HorizontalStorySection/HorizontalStorySection';
import {StoryHeaderSection} from './sections/StoryHeaderSection';
import { IntroSection } from './sections/IntroSection';
import { StatsSection } from './sections/StatsSection';

import TestPlayground from "./TestPlayground.tsx";
import {FeatureSection} from "./sections/FeatureSection.tsx";
import {TextMaskSection} from "./sections/TextMaskSection.tsx";

interface HomePageProps {
  hasPlayed: boolean;           // 全局是否已经播放过动画
  onAnimationFinish: () => void; // 动画播放完成的回调
}

function HomePage({ hasPlayed, onAnimationFinish }: HomePageProps) {
  // 用于控制 Header 隐藏
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  // 用于引用 <HorizontalStorySection /> 包装器的 ref
  const storySectionRef = useRef<HTMLDivElement>(null);

  // 如果 App 告诉我们已经播过了 (hasPlayed为true)，这里直接初始化为 true (跳过动画)
  const [animationCompleted, setAnimationCompleted] = useState(hasPlayed);

  useEffect(() => {
    
    // 1. 如果动画未完成，DOM 元素不存在，直接返回
    if (!animationCompleted) {
      return;
    }

    const HEADER_HEIGHT_PX = 100;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderHidden(true);
        } else {
          if (entry.boundingClientRect.top > HEADER_HEIGHT_PX) {
            setIsHeaderHidden(false);
          }
        }
      },
      {
        rootMargin: `-${HEADER_HEIGHT_PX}px 0px 0px 0px`,
        threshold: 0
      }
    );

    const currentRef = storySectionRef.current;
    
    // 2. 此时 animationCompleted 为 true，currentRef 应该存在
    if (currentRef) {
      observer.observe(currentRef);
    }

    // 3. 返回清理函数
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
    
  // 4. 添加 animationCompleted 作为依赖项
  }, [animationCompleted]);

  const criticalAssets = [
    '/videos/hero-video.mp4',
    '/images/hero-poster.jpg',
    '/images/title.png',
    '/videos/story.mp4',
    '/videos/tibet-loop.mp4',
    '/videos/muztagh-ata-bg.mp4',
    '/videos/zhangye-danxia-bg.mp4',
  ];

  const logoPath = '/images/logo.png'; 

  const introTextLines = [
    { chinese: "云深不知处，山水有相逢", english: "Where clouds veil the peaks, landscapes await our encounter" },
  ];

  if (!animationCompleted) {
    return (
      <OpeningAnimation 
        assetsToLoad={criticalAssets} 
        logoSrc={logoPath} // 传递 Logo 路径
        introductionLines={introTextLines} // 传递介绍文本
        onAnimationComplete={() => {
            // 动画完成后，不仅更新本地状态，还要通知 App 组件
            setAnimationCompleted(true);
            onAnimationFinish();
        }} 
      />
    );
  }

  // 动画完成后，显示主页内容
  return (
    <div className="app-container">
      <Header isHidden={isHeaderHidden} />
      <HeroSection
        videoSrc="/videos/hero-video.mp4"
        posterImage="/images/hero-poster.jpg"
        logoImageSrc="/images/title.png"
        logoAlt="山河奇景 网站 Logo"
        subtitle="A retreat from classic China"
        scrollTargetRef={storySectionRef}
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
  // 1. 创建一个状态来控制 Header 的可见性
  // 默认是 true (显示 Header)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // 2. 创建一个回调函数，这个函数将被传递给子组件
  // 当子组件状态改变时，会调用这个函数
  const handleCompanionStateChange = (isCompanionActive: boolean) => {
    // isCompanionActive=true (选择了主题) -> 隐藏Header (false)
    // isCompanionActive=false (返回选择页) -> 显示Header (true)
    setIsHeaderVisible(!isCompanionActive);
  };

  return (
    <>
      {/* 3. 根据状态决定是否渲染 Header */}
      {isHeaderVisible && <Header />}

      {/* 4. 将回调函数作为 prop 传递下去 */}
      <CompanionSystem onStateChange={handleCompanionStateChange} />
    </>
  );
}

/**
 * 根组件
 * 负责处理应用级路由
 */
function App() {
  // 在 App 层级维护“是否已播放过动画”的状态
  // 默认 false，表示刷新网页或首次进入时需要播放
  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);

  return (
    <Router>
      <Routes>
        {/* 路由：主页 
            （将状态和回调传递给 HomePage）
        */}
        <Route 
            path="/" 
            element={
                <HomePage 
                    hasPlayed={hasIntroPlayed} 
                    onAnimationFinish={() => setHasIntroPlayed(true)} 
                />
            } 
        />

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