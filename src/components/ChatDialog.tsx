import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatDialog.module.scss';
import { FaPaintBrush , FaSave, FaScroll } from 'react-icons/fa';
import { FiSettings } from "react-icons/fi";
import { MdOutlinePowerSettingsNew,MdCleaningServices  } from "react-icons/md";
const AVATAR_SRC = "/images/avatar.png";

// --- 类型定义 ---
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean; // 用于标记是否正在输出
}

// --- 打字机效果组件 (实现流式感) ---
const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        onComplete && onComplete();
      }
    }, 50); // 打字速度，越小越快
    return () => clearInterval(timer);
  }, [text]);

  return <>{displayedText}</>;
};

// --- SettingsModal (保持简单，样式更新) ---
interface SettingsModalProps {
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}
const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey);
  return (
    <div className={styles.settingsPanel}>
      <div className={styles.settingsHeader}>
        <h4><FiSettings/> 灵力之源 (API Key)</h4>
        <button onClick={onClose} className={styles.closeBtn}><MdOutlinePowerSettingsNew /></button>
      </div>
      <div className={styles.settingsBody}>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="请输入 DeepSeek Key..."
          className={styles.inkInput}
        />
        <button onClick={() => onSave(key)} className={styles.inkBtn}>
          <FaSave /> 铭刻
        </button>
      </div>
    </div>
  );
};

// --- 主组件 ---
interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 正在请求 API
  const [isTyping, setIsTyping] = useState(false);   // 正在打字输出
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 读取 Key
  useEffect(() => {
    const storedKey = localStorage.getItem('deepseek_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  // 输入框高度自适应
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || isTyping) return;
    if (!apiKey) { setIsSettingsOpen(true); return; }

    const userText = inputText;
    setInputText('');
    
    // 1. 添加用户消息
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. 请求 API
      const responseText = await callLanguageModelAPI(userText, apiKey, messages);
      
      // 3. 准备机器人消息 (标记为打字中)
      setIsLoading(false);
      setIsTyping(true);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        isTyping: true 
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      setIsLoading(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "灵力紊乱，无法连接彼岸... (请检查API Key)",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  const handleTypingComplete = (id: string) => {
    setIsTyping(false);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isTyping: false } : m));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`${styles.chatContainer} ${isOpen ? styles.open : ''}`}>
      
      {/* 顶部栏 */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.avatar}>
            <img src={AVATAR_SRC} alt="avatar" />
          </div>
          <div className={styles.info}>
            <h3>墨灵</h3>
            <span>书卷有灵，伴君同行</span>
          </div>
        </div>
        <div className={styles.controls}>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} title="设置"><FiSettings /></button>
          <button onClick={() => setMessages([])} title="清空"><MdCleaningServices /></button>
          <button onClick={onClose} title="收起"><MdOutlinePowerSettingsNew /></button>
        </div>
      </div>

      {/* 设置面板 (嵌入式，不遮挡) */}
      {isSettingsOpen && (
        <SettingsModal 
          currentKey={apiKey} 
          onClose={() => setIsSettingsOpen(false)}
          onSave={(k) => { 
            localStorage.setItem('deepseek_api_key', k); 
            setApiKey(k); 
            setIsSettingsOpen(false); 
          }} 
        />
      )}

      {/* 消息流 */}
      <div className={styles.messageList}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <FaScroll className={styles.emptyIcon} />
            <p>展信舒颜，见字如面。</p>
            <p>吾乃《山河图鉴》之书灵，<br/>知晓天文地理，愿为君解惑。</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.messageRow} ${msg.isUser ? styles.rowUser : styles.rowBot}`}>
            <div className={styles.bubble}>
              {msg.isUser ? (
                msg.text
              ) : (
                // 如果是机器人且正在打字，使用 Typewriter 组件
                msg.isTyping ? (
                  <TypewriterText text={msg.text} onComplete={() => handleTypingComplete(msg.id)} />
                ) : (
                  msg.text
                )
              )}
            </div>
          </div>
        ))}
        
        {/* 加载动画 (研磨效果) */}
        {isLoading && (
          <div className={`${styles.messageRow} ${styles.rowBot}`}>
            <div className={styles.loadingInk}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区 */}
      <div className={styles.inputArea}>
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="请小主赐教"
          rows={1}
          disabled={isLoading || isTyping}
        />
        <button onClick={sendMessage} disabled={!inputText.trim() || isLoading || isTyping} className={styles.sendBtn}>
          <FaPaintBrush />
        </button>
      </div>
    </div>
  );
};

// --- API 调用 (Prompt 优化) ---
async function callLanguageModelAPI(message: string, apiKey: string, history: Message[]): Promise<string> {
  // 系统设定：古风全知书灵
  const systemPrompt = `
    你名为“墨灵”，是《山河图鉴》的守护书灵。
    【人设】你的性格沉稳典雅，博古通今，语气谦和，带有一丝古代文人的风骨。
    【语言风格】请使用半文半白的风格（古风白话），用词优美，多用四字成语，富有画面感和诗意。避免使用过于现代的互联网用语或Markdown格式。
    【任务】回答用户关于中国山川地理、历史文化的问题。
    【示例】
    用户：你好。
    回复：道友有礼了。吾乃书灵，居于这山河图卷之中。不知今日造访，可是有何不解之谜？
  `;

  const historyPayload = history.slice(-6).map(m => ({
    role: m.isUser ? 'user' : 'assistant',
    content: m.text
  }));

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: systemPrompt }, ...historyPayload, { role: 'user', content: message }],
        max_tokens: 800,
        temperature: 0.8, 
        stream: false 
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "墨迹未干，天机难测...";
  } catch (e) {
    console.error(e);
    throw e;
  }
}