import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatDialog.module.scss';
import { FaPaperPlane, FaTrash, FaTimes, FaCog, FaSave } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// ... SettingsModal 组件保持不变 (和上次一样) ...
interface SettingsModalProps {
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}
const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey);
  const handleSave = () => { onSave(key); };

  return (
    <div className={styles.settingsOverlay} onClick={onClose}>
      <div className={styles.settingsDialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.settingsHeader}>
          <h4>助手设置</h4>
          <button onClick={onClose} className={styles.settingsCloseButton}><FaTimes /></button>
        </div>
        <div className={styles.settingsBody}>
          <label htmlFor="apiKeyInput">DeepSeek API Key</label>
          <p>API Key 将安全地存储在您的浏览器本地。</p>
          <input
            id="apiKeyInput" type="password" value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..." className={styles.settingsInput}
          />
          <button onClick={handleSave} className={styles.settingsSaveButton}>
            <FaSave /> 保存
          </button>
        </div>
      </div>
    </div>
  );
};


// -----------------------------------------------------
// 主聊天对话框 (核心修改区)
// -----------------------------------------------------
export const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // ⭐️ 修复 2: 创建一个 ref 来引用 textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 组件加载时，尝试从 localStorage 读取 API Key
  useEffect(() => {
    const storedKey = localStorage.getItem('deepseek_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  // ⭐️ 修复 2: 监听输入框文字变化，自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      // 1. 先重置高度，让它能正确缩小
      textareaRef.current.style.height = 'auto';
      // 2. 再设置成滚动高度 (即内容高度)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]); // 依赖 inputText

  // 保存 API Key
  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('deepseek_api_key', key);
    setApiKey(key);
    setIsSettingsOpen(false);
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    // ⭐️ 修复 3: 捕获当前的聊天记录 (不包括新消息)
    const currentMessages = [...messages];

    // 更新UI (加上用户的新消息)
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // ⭐️ 修复 3: 把历史记录和新消息一起发给 API
      const response = await callLanguageModelAPI(inputText, apiKey, currentMessages);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API调用失败:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，我暂时无法回应。请检查您的 API Key 或稍后再试。',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) { // 加上 !isLoading
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {isSettingsOpen && (
        <SettingsModal
          currentKey={apiKey}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveApiKey}
        />
      )}

      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h3>图鉴助手</h3>
            <div className={styles.actions}>
              <button onClick={() => setIsSettingsOpen(true)} className={styles.iconButton} title="设置">
                <FaCog />
              </button>
              <button onClick={clearChat} className={styles.iconButton} title="清空对话">
                <FaTrash />
              </button>
              <button onClick={onClose} className={styles.iconButton} title="关闭">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* 消息区域 (滚动条样式会在这里生效) */}
          <div className={styles.messages}>
            {messages.length === 0 ? (
              <div className={styles.welcome}>
                <p>您好！我是图鉴助手，可以问我关于山河图鉴的任何问题。</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.isUser ? styles.userMessage : styles.botMessage
                  }`}
                >
                  <div className={styles.messageContent}>
                    {message.text}
                  </div>
                  <div className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className={styles.inputArea}>
            <div className={styles.inputContainer}>
              <textarea
                ref={textareaRef} // ⭐️ 修复 2: 绑定 ref
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题 (Shift+Enter 换行)..."
                rows={1} // 始终从1行开始
                className={styles.textInput}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className={styles.sendButton}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// -----------------------------------------------------
// 大语言模型 API (支持上下文)
// -----------------------------------------------------
async function callLanguageModelAPI(
  message: string,
  apiKey: string,
  history: Message[] // ⭐️ 修复 3: 接收历史记录
): Promise<string> {

  const API_URL = 'https://api.deepseek.com/chat/completions';
  if (!apiKey) throw new Error('API Key is missing.');

  // 1. 定义系统提示
  const systemMessage = {
    role: 'system',
    content: '你是一个专业的图鉴助手，帮助用户了解山河图鉴的相关信息。回答要简洁专业，风格要匹配中国古典美学，沉稳而富有诗意，输出不要包含任何markdown标记。'
  };

  // 2. 转换历史记录 (只取最后10条)
  const historyMessages = history.slice(-10).map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.text
  }));

  // 3. 组装新的用户消息
  const userMessage = {
    role: 'user',
    content: message
  };

  // 4. 拼接最终的消息数组
  const messagesPayload = [
    systemMessage,
    ...historyMessages,
    userMessage
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messagesPayload, // ⭐️ 修复 3: 发送完整的上下文
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误详情:', errorText);
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      throw new Error('API返回数据格式错误');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('API调用错误:', error);
    return '抱歉，山河入梦，思绪暂断... 请稍后再试。';
  }
}