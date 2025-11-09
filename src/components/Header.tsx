// src/components/Header.tsx
import { type FC, useState } from 'react';
import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { IoBookOutline } from "react-icons/io5";
import { IconButton } from './IconButton';
import { useNavigate } from 'react-router-dom';
import { ChatDialog } from './ChatDialog'; // 确保导入ChatDialog
import styles from './Header.module.scss';

export const Header: FC = () => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false); // 添加弹窗状态

    return (
        <>
            <header className={styles.header}>
                {/* 左侧区域 */}
                <div className={styles.headerLeft}>
                    <IconButton 
                        icon={<IoBookOutline />}
                        ariaLabel="图鉴助手"
                        className={styles.iconButton}
                        onClick={() => setIsChatOpen(true)} // 恢复打开弹窗功能
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
                        ariaLabel="意见反馈"
                        className={`${styles.iconButton} ${styles.menuButton}`}
                        onClick={() => navigate('/developer')}
                    />
                </div>
            </header>

            {/* 图鉴助手弹窗 */}
            <ChatDialog 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </>
    );
};