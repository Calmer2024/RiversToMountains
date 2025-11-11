// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// App.tsx
import { useState } from 'react';
import HeroSection from './sections/HeroSection';
import './styles/global.scss';
import { Header } from './components/Header';
import { CardCarousel } from './sections/CardCarousel';
import { HorizontalStorySection } from './sections/HorizontalStorySection/HorizontalStorySection';
import { StoryHeaderSection } from './sections/StoryHeaderSection';
import BpcoPage from './sections/BpcoPage';
import FeedbackPage from './sections/FeedbackPage'; // 替换为意见箱页面

function HomePage() {
import OpeningAnimation from './components/OpeningAnimation';
import CompanionSystem from './components/CompanionSystem';

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
        subtitle="A sanctuary nestled in the classic landscapes of China"
        buttonLink="/bpco"
      />
      {/* <CardCarousel /> */}
      <StoryHeaderSection />
      <HorizontalStorySection />

      <CardCarousel />
      <CompanionSystem />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bpco" element={<BpcoPage />} />
        <Route path="/developer" element={<FeedbackPage />} /> {/* 替换为意见箱 */}
      </Routes>
    </Router>
  );
}

export default App;