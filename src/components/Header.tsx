import { type FC } from 'react';
import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { IoBookOutline } from "react-icons/io5";
import styles from './Header.module.scss';

export const Header: FC = () => {
    return (
        <header className={styles.header}>
            {/* 左侧区域 */}
            <div className={styles.headerLeft}>
                <a href="#" className={styles.iconButton} aria-label="图鉴">
                    <IoBookOutline />
                </a>
            </div>

            {/* 右侧区域 */}
            <div className={styles.headerRight}>
                <a href="#" className={styles.iconButton} aria-label="搜索">
                    <FiSearch />
                </a>

                {/* 用户 */}
                <a href="#" className={styles.iconButton} aria-label="用户中心">
                    <FiUser />
                </a>

                {/* 菜单 */}
                <a href="#" className={styles.iconButton + ' ' + styles.menuButton} aria-label="菜单">
                    <FiMenu />
                </a>
            </div>

        </header>
    );
};