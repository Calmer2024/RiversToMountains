import { type FC } from 'react';
import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { IoBookOutline } from "react-icons/io5";
import styles from './Header.module.scss';

export const Header: FC = () => {
    return (
        <header className={styles.header}>
            {/* 左侧区域 */}
            <div className={styles.headerLeft}>
                <a href="/" className={styles.iconButton} aria-label="图鉴">
                    <IoBookOutline />
                </a>
            </div>

            {/* 右侧区域 */}
            <div className={styles.headerRight}>
                <a href="#" className={styles.iconButton} aria-label="搜索">
                    <FiSearch />
                </a>

                {/* 用户 - 跳转到团队页面 */}
                <a 
                    href="/thanks.html" 
                    className={styles.iconButton} 
                    aria-label="团队风采"
                    title="查看团队风采"
                >
                    <FiUser />
                </a>

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
    );
};