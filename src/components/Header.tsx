import { type FC, useEffect, useState } from 'react';
import { FiUser, FiMenu, FiGithub } from 'react-icons/fi';
import { IoMdClipboard } from "react-icons/io";
import { FaGithub } from "react-icons/fa6";
import { IconButton } from './iconButton';
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
    // 确定当前路由
    useEffect(() => {
        if (location.pathname === '/outside') {
            setActiveView('outside');
        } else {
            // 默认 / 或其他任何路径都视为 home
            setActiveView('home');
        }
    }, [location.pathname]);

    const [scrolled, setScrolled] = useState(false);
    // 原始的 isHome 逻辑，用于判断是否在根路径
    const isRootHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 切换视图
    const handleToggle = (view: 'home' | 'outside') => {
        if (view === 'home') {
            navigate('/');
        } else {
            navigate('/outside');
        }
    };

    return (
        <>
            <header
                className={
                    [
                        styles.header,
                        // 只有在 'home' 视图 且未滚动时才透明
                        activeView === 'home' && isRootHome && !scrolled 
                            ? styles.homeTransparent 
                            : styles.headerGlass,
                        isHidden ? styles.headerHidden : ''
                    ].join(' ')
                }
            >
                {/* 左侧 Logo 和文字 */}
                <div className={styles.headerLeft}>
                    <img src="/images/logo.png" alt="Logo" className={styles.logo} />
                    <span className={styles.logoText}>CREATIVEPAGE</span> 
                </div>

                {/* 中间滑动开关 */}
                <div className={styles.headerCenter}>
                    <div className={styles.toggleContainer}>
                        <div 
                            className={`${styles.toggleSlider} ${
                                activeView === 'outside' ? styles.sliderRight : ''
                            }`}
                        ></div>
                        <button 
                            className={`${styles.toggleButton} ${
                                activeView === 'home' ? styles.active : ''
                            }`}
                            onClick={() => handleToggle('home')}
                        >
                            Home
                        </button>
                        <button 
                            className={`${styles.toggleButton} ${
                                activeView === 'outside' ? styles.active : ''
                            }`}
                            onClick={() => handleToggle('outside')}
                        >
                            Outside
                        </button>
                    </div>
                </div>

                {/* 3. 右侧按钮 */}
                <div className={styles.headerRight}>
                    
                    <a
                        href="https://github.com/Calmer2024/RiversToMountains"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
                        className={styles.iconButton} 
                    >
                        <FaGithub />
                    </a>

                    {/* 原始按钮 */}
                    <IconButton icon={<IoMdClipboard />} ariaLabel="用户中心" className={styles.iconButton} onClick={() => navigate('/bpco')} />
                    <IconButton icon={<FiMenu />} ariaLabel="意见反馈" className={`${styles.iconButton} ${styles.menuButton}`} onClick={() => navigate('/developer')} />
                </div>
            </header>
            
            {/* 浮动助手 */}
            {activeView === 'home' && <FloatingAssistant />}
        </>
    );
};