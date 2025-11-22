import React, { useState, useEffect } from 'react';
import { GiInkSwirl } from "react-icons/gi"; 
import { ChatDialog } from './ChatDialog';
import styles from './FloatingAssistant.module.scss';


export const FloatingAssistant: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    // 切换聊天窗口
    setIsChatOpen(!isChatOpen);
    setShowBubble(false); // 点击一次后永久隐藏初始气泡
  };

  // 气泡文字
  const bubbleText = "山河万里皆画卷，何忍匆匆作别离？";

  return (
    <>
      <div
        className={`${styles.floatingAssistant} ${isMounted ? styles.mounted : ''}`}
        // 核心修改：移除动态坐标，直接CSS固定在左下角
        style={{ bottom: '30px', left: '30px', position: 'fixed' }}
      >
        {/* 提示气泡 (仅在未打开且未点击过时显示) */}
        {showBubble && !isChatOpen && (
          <div className={styles.speechBubble}>
            {bubbleText}
            <div className={styles.arrow}></div>
          </div>
        )}

        <button
          className={`${styles.assistantButton} ${isChatOpen ? styles.active : ''}`}
          onClick={handleClick}
          aria-label="呼唤墨灵"
          style={{ cursor: 'pointer' }} 
        >
          <GiInkSwirl className={styles.icon} />
          {!isChatOpen && <div className={styles.inkPulse}></div>}
        </button>
      </div>

      <ChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};