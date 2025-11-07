// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './sections/HeroSection';
import './styles/global.scss';
import { Header } from './components/Header'; // 导入 Header
import { CardCarousel } from './sections/CardCarousel';
import BpcoPage from './sections/BpcoPage';

function HomePage() {
  return (
    <div className="app-container" style={{ paddingTop: '80px' }}>
      {/* 注意：这里不再包含 Header */}
      <HeroSection
        videoSrc="/videos/hero-video.mp4"
        posterImage="/images/hero-poster.jpg"
        logoImageSrc="/images/title.png"
        logoAlt="山河奇景 网站 Logo"
        subtitle="A sanctuary nestled in the classic landscapes of China"
      />
      <CardCarousel />
    </div>
  );
}

function BpcoPageWithPadding() {
  return (
    <div style={{ paddingTop: '80px' }}>
      <BpcoPage />
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* Header 现在在全局，所有页面都会显示 */}
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bpco" element={<BpcoPageWithPadding />} />
      </Routes>
    </Router>
  );
}

export default App;