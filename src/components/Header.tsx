// src/components/Header.tsx
import { type FC, useState } from 'react';
import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { IoBookOutline } from "react-icons/io5";
import { IconButton } from './IconButton';
import { ChatDialog } from './ChatDialog'; // 导入对话框组件
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

export const Header: FC = () => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false); // 对话框状态

    return (
        <>
            <header className={styles.header}>
                {/* 左侧区域 */}
                <div className={styles.headerLeft}>
                    <IconButton 
                        icon={<IoBookOutline />}
                        ariaLabel="图鉴"
                        className={styles.iconButton}
                        onClick={() => setIsChatOpen(true)} // 打开对话框
                    />
                </div>

                {/* 右侧区域 */}
                <div className={styles.headerRight}>
                    <IconButton 
                        icon={<FiSearch />}
                        ariaLabel="搜索"
                        className={styles.iconButton}
                        onClick={() => {
                            console.log('打开搜索功能');
                        }}
                    />

                    <IconButton 
                        icon={<FiUser />}
                        ariaLabel="用户中心"
                        className={styles.iconButton}
                        onClick={() => navigate('/bpco')}
                    />

                    <IconButton 
                        icon={<FiMenu />}
                        ariaLabel="菜单"
                        className={`${styles.iconButton} ${styles.menuButton}`}
                        onClick={() => {
                            console.log('打开菜单');
                        }}
                    />
                </div>
            </header>

            {/* 对话框组件 */}
            <ChatDialog 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </>
    );
};