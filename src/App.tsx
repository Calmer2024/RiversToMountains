import HeroSection from './sections/HeroSection';
import './styles/global.scss';
import { Header } from './components/Header';
import { CardCarousel } from './sections/CardCarousel';

function App() {
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
  )
}

export default App
