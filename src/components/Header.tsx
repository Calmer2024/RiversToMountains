import { type FC, useEffect, useState, useRef } from 'react';
import { FiMenu, FiX, FiGithub, FiMessageSquare, FiBox } from 'react-icons/fi'; // 引入新图标
import { IoMdClipboard } from "react-icons/io";
import { useNavigate, useLocation } from 'react-router-dom';
import { FloatingAssistant } from './FloatingAssistant';
import styles from './Header.module.scss';

interface HeaderProps {
  isHidden?: boolean;
}

export const Header: FC<HeaderProps> = ({ isHidden = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState<'home' | 'outside'>('home');
  const [scrolled, setScrolled] = useState(false);
  
  // --- 新增：菜单状态控制 ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isRootHome = location.pathname === '/';

  // 监听路由变化
  useEffect(() => {
    if (location.pathname === '/outside') {
      setActiveView('outside');
    } else {
      setActiveView('home');
    }
    // 路由跳转后自动关闭菜单
    setIsMenuOpen(false);
  }, [location.pathname]);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 新增：点击外部关闭菜单 ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleToggle = (view: 'home' | 'outside') => {
    if (view === 'home') navigate('/');
    else navigate('/outside');
  };

  // 菜单跳转处理
  const handleMenuClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={[
          styles.header,
          activeView === 'home' && isRootHome && !scrolled 
            ? styles.homeTransparent 
            : styles.headerGlass,
          isHidden ? styles.headerHidden : ''
        ].join(' ')}
      >
        {/* 左侧 Logo */}
        <div className={styles.headerLeft}>
          <img src="/images/logo.png" alt="Logo" className={styles.logo} />
          <span className={styles.logoText}>CREATIVEPAGE</span> 
        </div>

        {/* 中间滑动开关 */}
        <div className={styles.headerCenter}>
          <div className={styles.toggleContainer}>
            <div className={`${styles.toggleSlider} ${activeView === 'outside' ? styles.sliderRight : ''}`}></div>
            <button 
              className={`${styles.toggleButton} ${activeView === 'home' ? styles.active : ''}`}
              onClick={() => handleToggle('home')}
            >
              Home
            </button>
            <button 
              className={`${styles.toggleButton} ${activeView === 'outside' ? styles.active : ''}`}
              onClick={() => handleToggle('outside')}
            >
              Outside
            </button>
          </div>
        </div>

        {/* 右侧集成菜单按钮 */}
        <div className={styles.headerRight} ref={menuRef}>
          <button 
            className={`${styles.menuTrigger} ${isMenuOpen ? styles.open : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {/* 图标切换动画 */}
            <div className={styles.iconWrapper}>
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </div>
          </button>

          {/* 下拉菜单面板 */}
          <div className={`${styles.dropdownMenu} ${isMenuOpen ? styles.menuVisible : ''}`}>
            <div className={styles.menuContent}>
              
              <div 
                className={styles.menuItem} 
                onClick={() => handleMenuClick(() => navigate('/bpco'))}
              >
                <IoMdClipboard className={styles.menuIcon} />
                <span>山河留言板</span>
              </div>

              <div 
                className={styles.menuItem} 
                onClick={() => handleMenuClick(() => navigate('/developer'))}
              >
                <FiMessageSquare className={styles.menuIcon} />
                <span>用户意见箱</span>
              </div>

              <a 
                href="https://github.com/Calmer2024/RiversToMountains"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiGithub className={styles.menuIcon} />
                <span>项目 Github</span>
              </a>

            </div>
          </div>
        </div>
      </header>
      
      {activeView === 'home' && <FloatingAssistant />}
    </>
  );
};