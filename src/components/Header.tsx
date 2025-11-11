import { type FC, useEffect, useState } from 'react';
import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { IconButton } from './IconButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { FloatingAssistant } from './FloatingAssistant';
import styles from './Header.module.scss';

export const Header: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={
                    [
                        styles.header,
                        // 首页才透明，否则非首页永远是毛玻璃
                        isHome && !scrolled ? styles.homeTransparent : styles.headerGlass
                    ].join(' ')
                }
            >
                <div className={styles.headerLeft}></div>

                <div className={styles.headerRight}>
                    <IconButton icon={<FiUser />} ariaLabel="用户中心" className={styles.iconButton} onClick={() => navigate('/bpco')} />
                    {/* <IconButton icon={<FiMenu />} ariaLabel="意见反馈" className={`${styles.iconButton} ${styles.menuButton}`} onClick={() => navigate('/developer')} /> */}
                    {/* 菜单 */}
                    <a href="/thanks.html" 
                        className={styles.iconButton} 
                        aria-label="团队风采"
                        title="查看团队风采"
                    >
                        <FiMenu />
                    </a>
                </div>
            </header>
            <FloatingAssistant />
        </>
    );
};
