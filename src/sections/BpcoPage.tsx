import React, { useEffect, useRef, useState } from "react";
import styles from "./BpcoPage.module.scss";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  name: string;
  content: string;
  timestamp: string;
  avatar: string;
}

const backgroundImages = [
  "/images/cards/guilin.jpg",
  "/images/cards/huangshan.jpg",
  "/images/cards/jiuzhaigou.jpg",
  "/images/cards/zhangjiajie.jpg",
  "/images/cards/zhangye.jpg",
];

const MOCK_MESSAGES: Message[] = [
  { id: 9001, name: "观山者", content: "黄山归来不看岳，云海翻腾，奇松怪石，真乃人间仙境！", timestamp: "2025/11/10 10:30:15", avatar: "观" },
  { id: 9002, name: "行路人", content: "张家界的山，如刀劈斧削，直插云霄。阿凡达的悬浮山原来真有原型。这是一段非常非常非常非常非常非常非常非常非常长的测试文本，没有任何标点符号，看看它会不会溢出aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", timestamp: "2025/11/11 14:22:05", avatar: "行" },
  { id: 9003, name: "静水流深", content: "九寨沟的水，清澈得难以置信。五彩池的光影变幻，仿佛上帝打翻了调色盘。", timestamp: "2025/11/12 09:15:40", avatar: "静" },
  { id: 9004, name: "丹霞客", content: "张掖的丹霞地貌，色彩斑斓，层理交错。大自然的鬼斧神工，令人叹为观止。", timestamp: "2025/11/12 16:55:30", avatar: "丹" },
  { id: 9005, name: "漓江舟", content: "泛舟漓江上，人在画中游。", timestamp: "2025/11/13 11:05:00", avatar: "漓" },
];

const cardMotion = {
  initial: { opacity: 0, y: 16, scale: 0.995 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.06 * i, duration: 0.45, ease: "easeOut" },
  }),
  exit: { opacity: 0, y: 8, transition: { duration: 0.25 } },
};

const modalMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.18 } },
};

const BpcoPageRefactor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({ name: "", content: "" });
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // 背景轮播
  useEffect(() => {
    const t = setInterval(() => setCurrentBgIndex((p) => (p + 1) % backgroundImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  // load / save sessionStorage
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("shanhua_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
        else setMessages(MOCK_MESSAGES);
      } else {
        setMessages(MOCK_MESSAGES);
      }
    } catch (err) {
      console.warn("读取留言失败：", err);
      setMessages(MOCK_MESSAGES);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      window.sessionStorage.setItem("shanhua_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMessage((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.content.trim()) return;
    const nameTrimmed = newMessage.name.trim();
    const firstInitial = nameTrimmed.charAt(0).toUpperCase();
    const msg: Message = {
      id: Date.now(),
      name: nameTrimmed,
      content: newMessage.content.trim(),
      timestamp: new Date().toLocaleString("zh-CN", { hour12: false }),
      avatar: firstInitial,
    };
    setMessages((prev) => [msg, ...prev]);
    setNewMessage({ name: "", content: "" });
    // 可选：滚动到最左（新消息在最前）
    if (listRef.current) listRef.current.scrollTo({ left: 0, behavior: "smooth" });
  };

  // columns: 每列 3 个（保持你原来的逻辑）
  const columns: Message[][] = [];
  for (let i = 0; i < messages.length; i += 3) columns.push(messages.slice(i, i + 3));

  const scrollByColumn = (dir: "left" | "right") => {
    const c = listRef.current;
    if (!c) return;
    const scrollAmount = c.clientWidth || (c.parentElement ? c.parentElement.clientWidth : 0);
    const newLeft = dir === "left" ? Math.max(0, c.scrollLeft - scrollAmount) : c.scrollLeft + scrollAmount;
    c.scrollTo({ left: newLeft, behavior: "smooth" });
  };

  return (
    <div className={styles.bpcoPage} style={{ backgroundImage: `url(${backgroundImages[currentBgIndex]})` }}>
      <motion.button
        className={styles.backButton}
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <FaArrowLeft />
      </motion.button>

      <motion.div className={styles.pageTitle} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className={styles.titleMain}>山河留言板</div>
        <div className={styles.titleSub}>笔墨山河 · 留白天地</div>
      </motion.div>

      <div className={styles.contentWrapper}>
        <motion.div className={styles.newMessageCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <h2 className={styles.sectionTitle}>发布新留言</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input type="text" name="name" value={newMessage.name} onChange={handleInputChange} placeholder="你的昵称" className={styles.input} />
            <textarea name="content" value={newMessage.content} onChange={handleInputChange} placeholder="分享你的山河故事..." rows={6} className={styles.textarea} />
            <button type="submit" className={styles.submitButton} disabled={!newMessage.name.trim() || !newMessage.content.trim()}>
              发布留言
            </button>
          </form>
        </motion.div>

        <motion.div className={styles.messageWallWrapper} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
          <button className={`${styles.navButton} ${styles.leftBtn}`} onClick={() => scrollByColumn("left")}>
            <AiOutlineCaretLeft />
          </button>

          <div className={styles.messageWall} ref={listRef} /* 这是一个普通 div，不再依赖复杂 variants */>
            {/* 每列仍然渲染，但卡片由 AnimatePresence + motion 单独管理 */}
            {columns.map((col, ci) => (
              <div key={ci} className={styles.messageColumn}>
                <AnimatePresence>
                  {col.map((msg, mi) => {
                    const index = ci * 3 + mi; // 用于 stagger delay
                    return (
                      <motion.div
                        key={msg.id}
                        className={styles.messageCard}
                        onClick={() => setSelectedMessage(msg)}
                        initial={cardMotion.initial}
                        // @ts-ignore
                        animate={cardMotion.animate(index)}
                        exit={cardMotion.exit}
                        // 保证长文本换行（若你 CSS 没处理的话）
                        style={{ wordBreak: "break-word" }}
                      >
                        <div className={styles.messageHeader}>
                          <span className={styles.avatar}>{msg.avatar}</span>
                          <div>
                            <div className={styles.userName}>{msg.name}</div>
                            <div className={styles.timestamp}>{msg.timestamp}</div>
                          </div>
                        </div>
                        <div className={styles.messageContent}>{msg.content}</div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <button className={`${styles.navButton} ${styles.rightBtn}`} onClick={() => scrollByColumn("right")}>
            <AiOutlineCaretRight />
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedMessage && (
          <motion.div className={styles.modalOverlay} onClick={() => setSelectedMessage(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modalCard} onClick={(e) => e.stopPropagation()} initial={modalMotion.initial} animate={modalMotion.animate} exit={modalMotion.exit}>
              <div className={styles.modalHeader}>
                <span className={styles.avatarLarge}>{selectedMessage.avatar}</span>
                <div>
                  <div className={styles.modalUserName}>{selectedMessage.name}</div>
                  <div className={styles.modalTimestamp}>{selectedMessage.timestamp}</div>
                </div>
              </div>
              <div className={styles.modalContent}>{selectedMessage.content}</div>
              <button className={styles.closeButton} onClick={() => setSelectedMessage(null)}>关闭</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BpcoPageRefactor;
