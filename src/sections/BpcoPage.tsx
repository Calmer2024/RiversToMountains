import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './BpcoPage.module.scss';
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";

interface Message {
  id: number;
  name: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

const backgroundImages = [
  '/images/cards/guilin.jpg',
  '/images/cards/huangshan.jpg',
  '/images/cards/jiuzhaigou.jpg',
  '/images/cards/zhangjiajie.jpg',
  '/images/cards/zhangye.jpg'
];

export default function BpcoPage() {
  const location = useLocation();

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const publishCardRef = useRef<HTMLDivElement | null>(null);

  const [newMessage, setNewMessage] = useState({ name: '', content: '' });

  const [messages] = useState<Message[]>([
    {
      id: 1,
      name: '山河爱好者',
      content: '桂林的山水真是人间仙境，漓江的水清澈见底，象鼻山栩栩如生！',
      timestamp: '2024-01-15 14:30',
      avatar: '👤'
    },
    {
      id: 2,
      name: '旅行家小王',
      content: '黄山的云海和奇松让人叹为观止，迎客松真的像在欢迎每一位游客。',
      timestamp: '2024-01-14 10:15',
      avatar: '🧳'
    },
    {
      id: 3,
      name: '摄影爱好者',
      content: '九寨沟的秋天色彩斑斓，每个海子都像调色盘，是摄影的天堂。',
      timestamp: '2024-01-13 16:45',
      avatar: '📷'
    }
  ]);

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // 背景自动轮播
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentBgIndex(p => (p + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // 进入页面/路由切换时 → 居中发布新留言
  useEffect(() => {
    const container = scrollerRef.current;
    const firstCard = publishCardRef.current;
    if (!container || !firstCard) return;
    requestAnimationFrame(() => {
      const offset = firstCard.offsetLeft - (container.clientWidth - firstCard.clientWidth) / 2;
      container.scrollTo({ left: offset, behavior: 'auto' });
    });
  }, [location.pathname]);

  // 辅助函数：居中某一 index 的卡
  const scrollToCard = (index: number) => {
    const container = scrollerRef.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];
    if (!cards[index]) return;

    const card = cards[index];
    const offset = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left: offset, behavior: 'smooth' });
  };

  // 点击 左/右按钮
  const gotoPrev = () => {
    const container = scrollerRef.current;
    if (!container) return;
    const center = container.scrollLeft + container.clientWidth / 2;
    const cards = Array.from(container.children) as HTMLElement[];

    // 找当前
    let currentIndex = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        currentIndex = i;
      }
    });

    if (currentIndex > 0) scrollToCard(currentIndex - 1);
  };

  const gotoNext = () => {
    const container = scrollerRef.current;
    if (!container) return;
    const center = container.scrollLeft + container.clientWidth / 2;
    const cards = Array.from(container.children) as HTMLElement[];

    let currentIndex = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        currentIndex = i;
      }
    });

    if (currentIndex < cards.length - 1) scrollToCard(currentIndex + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("提交逻辑在这里执行，你可以对接后台");
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMessage(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className={styles.bpcoPage}
      style={{ backgroundImage: `url(${backgroundImages[currentBgIndex]})` }}
    >

      {/* 左右按钮 */}
      <button className={styles.arrowLeft} onClick={gotoPrev}>
        <AiOutlineCaretLeft />
      </button>

      <div className={styles.cardsScroller} ref={scrollerRef}>

        {/* 第一张：发布新留言 */}
        <div className={styles.messageCard} ref={publishCardRef}>
          <h2 className={styles.sectionTitle}>发布新留言</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="你的昵称"
              value={newMessage.name}
              onChange={handleInput}
            />
            <textarea
              className={styles.textarea}
              name="content"
              placeholder="分享你的山河故事…"
              rows={6}
              value={newMessage.content}
              onChange={handleInput}
            />
            <button
              className={styles.submitButton}
              disabled={!newMessage.name.trim() || !newMessage.content.trim()}
            >
              发布留言
            </button>
          </form>
        </div>

        {/* 后续留言卡片 */}
        {messages.map(m => (
          <div key={m.id} className={styles.messageCard}>
            <h3 className={styles.cardTitle}>{m.name}</h3>
            <div className={styles.content}>{m.content}</div>
            <div className={styles.timestamp}>{m.timestamp}</div>
          </div>
        ))}
      </div>

      <button className={styles.arrowRight} onClick={gotoNext}>
        <AiOutlineCaretRight />
      </button>
    </div>
  );
}
