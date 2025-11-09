// src/sections/BpcoPage.tsx
import React, { useState, useEffect } from 'react';
import styles from './BpcoPage.module.scss';

interface Message {
  id: number;
  name: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

// 背景图片数组 - 使用您提供的图片路径
const backgroundImages = [
  '/images/cards/guilin.jpg',
  '/images/cards/huangshan.jpg',
  '/images/cards/jiuzhaigou.jpg',
  '/images/cards/zhangjiajie.jpg',
  '/images/cards/zhangye.jpg'
];

const BpcoPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
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

  const [newMessage, setNewMessage] = useState({
    name: '',
    content: ''
  });

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 背景轮播效果
  useEffect(() => {
    const timer = setInterval(() => {
      if (backgroundImages.length <= 1) return;
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // 手动切换背景
  const nextBackground = () => {
    if (backgroundImages.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
      setIsTransitioning(false);
    }, 1000);
  };

  const prevBackground = () => {
    if (backgroundImages.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBgIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
      setIsTransitioning(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.content.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      name: newMessage.name,
      content: newMessage.content,
      timestamp: new Date().toLocaleString('zh-CN'),
      avatar: '💬'
    };

    setMessages([message, ...messages]);
    setNewMessage({ name: '', content: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMessage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div 
      className={`${styles.bpcoPage} ${isTransitioning ? styles.transitioning : ''}`}
      style={{ backgroundImage: `url(${backgroundImages[currentBgIndex]})` }}
    >
      {/* 背景控制按钮 */}
      {backgroundImages.length > 1 && (
        <div className={styles.bgControls}>
          <button 
            className={styles.bgControlButton}
            onClick={prevBackground}
            aria-label="上一张背景"
          >
            ‹
          </button>
          <div className={styles.bgIndicator}>
            {currentBgIndex + 1} / {backgroundImages.length}
          </div>
          <button 
            className={styles.bgControlButton}
            onClick={nextBackground}
            aria-label="下一张背景"
          >
            ›
          </button>
        </div>
      )}

      {/* 导航栏 */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>山河留言板</div>
        <div className={styles.navInfo}>分享你的山河故事</div>
      </nav>

      {/* 主视觉区域 */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            山河图鉴
            <br />
            笔墨山河 · 留白天地
          </h1>
          <p className={styles.heroSubtitle}>
            在这里分享你的旅行见闻、摄影心得和山河故事
          </p>
        </div>
      </section>

      {/* 留言表单区域 */}
      <section className={styles.messageForm}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>发布新留言</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                value={newMessage.name}
                onChange={handleInputChange}
                placeholder="你的昵称"
                className={styles.formInput}
                maxLength={20}
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                name="content"
                value={newMessage.content}
                onChange={handleInputChange}
                placeholder="分享你的山河故事、旅行见闻或摄影心得..."
                rows={4}
                className={styles.formTextarea}
                maxLength={500}
              />
              <div className={styles.charCount}>
                {newMessage.content.length}/500
              </div>
            </div>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!newMessage.name.trim() || !newMessage.content.trim()}
            >
              发布留言
            </button>
          </form>
        </div>
      </section>

      {/* 留言列表区域 */}
      <section className={styles.messages}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            最新留言
            <span className={styles.messageCount}>({messages.length} 条)</span>
          </h2>
          
          <div className={styles.messagesList}>
            {messages.map((message) => (
              <div key={message.id} className={styles.messageItem}>
                <div className={styles.messageHeader}>
                  <span className={styles.avatar}>{message.avatar}</span>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{message.name}</span>
                    <span className={styles.timestamp}>{message.timestamp}</span>
                  </div>
                </div>
                <div className={styles.messageContent}>
                  {message.content}
                </div>
                <div className={styles.messageActions}>
                  <button className={styles.actionButton}>👍 赞</button>
                  <button className={styles.actionButton}>💬 回复</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2025 山河图鉴留言板. 记录每一段山河故事.</p>
        </div>
      </footer>
    </div>
  );
};

export default BpcoPage;