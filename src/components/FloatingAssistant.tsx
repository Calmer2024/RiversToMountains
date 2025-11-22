import React, { useState, useEffect, useRef } from 'react';
import { GiInkSwirl } from "react-icons/gi"; 
import { ChatDialog } from './ChatDialog';
import styles from './FloatingAssistant.module.scss';

// --- 常量定义 ---
const SHOW_DURATION = 10000;  // 显示 10 秒
const HIDE_DURATION = 10000; // 消失 10 秒

export const FloatingAssistant: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false); 

  // 使用 useRef 存储定时器
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- 核心逻辑：气泡循环控制 ---
  useEffect(() => {
    // 如果聊天框打开了，清除所有定时器并隐藏气泡，不再执行循环
    if (isChatOpen) {
      setShowBubble(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // 定义循环函数
    const startCycle = () => {
      // 1. 显示气泡
      setShowBubble(true);

      // 2. 设置定时器：5秒后隐藏
      timerRef.current = setTimeout(() => {
        setShowBubble(false);

        // 3. 设置定时器：再过10秒后再次重新开始循环
        timerRef.current = setTimeout(() => {
          startCycle(); // 递归调用
        }, HIDE_DURATION);

      }, SHOW_DURATION);
    };

    // 启动循环
    startCycle();

    // 组件卸载或状态改变时的清理函数
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isChatOpen]); // 依赖 isChatOpen，当开关状态变化时重新评估

  const handleClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  // 气泡文字
  const bubbleText = "山河万里皆画卷，何忍匆匆作别离？";

  return (
    <>
      <div
        className={`${styles.floatingAssistant} ${isMounted ? styles.mounted : ''}`}
        style={{ bottom: '30px', left: '30px', position: 'fixed' }}
      >
        {/* 提示气泡 */}
        {/* 这里去掉了 !isChatOpen 的判断，因为 showBubble 状态本身已经由 useEffect 根据 isChatOpen 控制了 */}
        {showBubble && (
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