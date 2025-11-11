import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoBookOutline } from "react-icons/io5";
import { ChatDialog } from './ChatDialog';
import styles from './FloatingAssistant.module.scss';

type Pos = { x: number; y: number };

export const FloatingAssistant: React.FC = () => {
  const [pos, setPos] = useState<Pos>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const startOffsetRef = useRef<Pos>({ x: 0, y: 0 });      // 指针按下时：指针相对按钮左上角偏移
  const startPosRef = useRef<Pos>({ x: 20, y: 20 });       // 指针按下时：按钮起始位置（用于判断是否移动）
  const suppressClickRef = useRef<boolean>(false);         // 拖动后合成点击需要拦截

  useEffect(() => setIsMounted(true), []);

  // 读取本地位置
  useEffect(() => {
    const saved = localStorage.getItem('floating_pos');
    if (saved) {
      try {
        const p = JSON.parse(saved) as Pos;
        setPos(p);
        startPosRef.current = p;
      } catch {}
    }
  }, []);

  // 保存本地位置
  useEffect(() => {
    if (isMounted) localStorage.setItem('floating_pos', JSON.stringify(pos));
  }, [pos, isMounted]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const updatePos = (x: number, y: number) => {
    const size = 60, m = 10;
    const maxX = window.innerWidth  - size - m;
    const maxY = window.innerHeight - size - m;
    setPos({ x: clamp(x, m, maxX), y: clamp(y, m, maxY) });
  };

  const beginDrag = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    // 记录起点
    startOffsetRef.current = { x: clientX - pos.x, y: clientY - pos.y };
    startPosRef.current = { x: pos.x, y: pos.y };
    suppressClickRef.current = false; // 每次新的按下重置
    // UX：拖动体验
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }, [pos.x, pos.y]);

  const finishDrag = useCallback(() => {
    // 恢复 UX
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    setIsDragging(false);

    // 判断是否发生移动（阈值 3px）
    const dx = Math.abs(pos.x - startPosRef.current.x);
    const dy = Math.abs(pos.y - startPosRef.current.y);
    const moved = dx > 3 || dy > 3;

    // 如果是“拖动”，标记拦截接下来的一次合成 click
    if (moved) {
      suppressClickRef.current = true;
    }
    // 注意：这里不主动打开 chat；只依赖按钮自身 onClick（并结合 suppressClickRef 拦截）
  }, [pos.x, pos.y]);

  // 指针按下
  const onMouseDown = (e: React.MouseEvent) => beginDrag(e.clientX, e.clientY);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    beginDrag(t.clientX, t.clientY);
  };

  // 全局监听移动/松开
  useEffect(() => {
    if (!isDragging) return;

    const move = (e: MouseEvent | TouchEvent) => {
      if (e instanceof TouchEvent) {
        const t = e.touches[0];
        updatePos(
          t.clientX - startOffsetRef.current.x,
          t.clientY - startOffsetRef.current.y
        );
      } else {
        updatePos(
          e.clientX - startOffsetRef.current.x,
          e.clientY - startOffsetRef.current.y
        );
      }
    };

    const up = () => finishDrag();

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', up);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    };
  }, [isDragging, finishDrag]);

  return (
    <>
      <div
        className={`${styles.floatingAssistant} ${isMounted ? styles.mounted : ''} ${isDragging ? styles.dragging : ''}`}
        style={{ top: pos.y, left: pos.x }} // 用 top/left 定位，避免 transform 定位冲突
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <button
          className={styles.assistantButton}
          aria-label="open-chat"
          type="button"
          onClick={(e) => {
            // 如果刚刚发生过拖动，拦截这次（浏览器/React 合成的）点击
            if (suppressClickRef.current) {
              suppressClickRef.current = false; // 只拦截一次
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            // 纯点击 → 打开 chat
            setIsChatOpen(true);
          }}
        >
          <IoBookOutline className={styles.icon} />
          {!isDragging && <div className={styles.pulse}></div>}
        </button>

        {/*isDragging && <div className={styles.dragIndicator}>拖动中...</div>*/}
      </div>

      <ChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
