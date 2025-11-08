// App.tsx
import { useState } from 'react';
import HeroSection from './sections/HeroSection';
import './styles/global.scss';
import { Header } from './components/Header';
import { CardCarousel } from './sections/CardCarousel';
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
        subtitle="A sanctuary nestled in the classic landscapes of China​"
      />
      <CardCarousel />
      <CompanionSystem />
    </div>
  );
}

export default App;