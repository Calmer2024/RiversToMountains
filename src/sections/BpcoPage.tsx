import React, { useState, useEffect, useRef } from "react";
import styles from "./BpcoPage.module.scss";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";

interface Message {
  id: number;
  name: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

const backgroundImages = [
  "/images/cards/guilin.jpg",
  "/images/cards/huangshan.jpg",
  "/images/cards/jiuzhaigou.jpg",
  "/images/cards/zhangjiajie.jpg",
  "/images/cards/zhangye.jpg",
];

const BpcoPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({ name: "", content: "" });
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 背景自动轮播
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentBgIndex((p) => (p + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // ✅ 初始化加载留言
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("shanhua_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch (e) {
      console.warn("无法读取留言数据", e);
    }
  }, []);

  // ✅ 保存留言（仅当有内容时）
  useEffect(() => {
    if (messages.length > 0) {
      window.localStorage.setItem("shanhua_messages", JSON.stringify(messages));
    }
  }, [messages]);


  // 输入
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({ ...prev, [name]: value }));
  };

  // 提交留言
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.content.trim()) return;

    const msg: Message = {
      id: Date.now(),
      name: newMessage.name.trim(),
      content: newMessage.content.trim(),
      timestamp: new Date().toLocaleString("zh-CN", { hour12: false }),
      avatar: "💬",
    };

    setMessages([msg, ...messages]);
    setNewMessage({ name: "", content: "" });
  };

  // 每列最多 3 条
  const columns: Message[][] = [];
  for (let i = 0; i < messages.length; i += 3) {
    columns.push(messages.slice(i, i + 3));
  }

  // 横向滚动控制
  const scrollByColumn = (dir: "left" | "right") => {
    if (!listRef.current) return;
    const container = listRef.current;
    const scrollAmount = container.clientWidth;
    const newLeft =
      dir === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: newLeft, behavior: "smooth" });
  };

  return (
    <div
      className={styles.bpcoPage}
      style={{ backgroundImage: `url(${backgroundImages[currentBgIndex]})` }}
    >
      {/* 页面标题 */}
      <div className={styles.pageTitle}>
        <div className={styles.titleMain}>山河留言板</div>
        <div className={styles.titleSub}>笔墨山河 · 留白天地</div>
      </div>

      <div className={styles.contentWrapper}>
        {/* 左侧：发布新留言 */}
        <div className={styles.newMessageCard}>
          <h2 className={styles.sectionTitle}>发布新留言</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="name"
              value={newMessage.name}
              onChange={handleInputChange}
              placeholder="你的昵称"
              className={styles.input}
            />
            <textarea
              name="content"
              value={newMessage.content}
              onChange={handleInputChange}
              placeholder="分享你的山河故事..."
              rows={6}
              className={styles.textarea}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!newMessage.name.trim() || !newMessage.content.trim()}
            >
              发布留言
            </button>
          </form>
        </div>

        {/* 右侧：留言墙 */}
        <div className={styles.messageWallWrapper}>
          <button
            className={`${styles.navButton} ${styles.leftBtn}`}
            onClick={() => scrollByColumn("left")}
          >
            <AiOutlineCaretLeft />
          </button>

          <div className={styles.messageWall} ref={listRef}>
            {columns.map((col, ci) => (
              <div key={ci} className={styles.messageColumn}>
                {col.map((msg) => (
                  <div
                    key={msg.id}
                    className={styles.messageCard}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className={styles.messageHeader}>
                      <span className={styles.avatar}>{msg.avatar}</span>
                      <div>
                        <div className={styles.userName}>{msg.name}</div>
                        <div className={styles.timestamp}>{msg.timestamp}</div>
                      </div>
                    </div>
                    <div className={styles.messageContent}>{msg.content}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            className={`${styles.navButton} ${styles.rightBtn}`}
            onClick={() => scrollByColumn("right")}
          >
            <AiOutlineCaretRight />
          </button>
        </div>
      </div>

      {/* 模态框 */}
      {selectedMessage && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <span className={styles.avatarLarge}>
                {selectedMessage.avatar}
              </span>
              <div>
                <div className={styles.modalUserName}>
                  {selectedMessage.name}
                </div>
                <div className={styles.modalTimestamp}>
                  {selectedMessage.timestamp}
                </div>
              </div>
            </div>
            <div className={styles.modalContent}>
              {selectedMessage.content}
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedMessage(null)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BpcoPage;
