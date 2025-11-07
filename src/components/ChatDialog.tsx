// src/components/ChatDialog.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatDialog.module.scss';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息到大语言模型
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 调用大语言模型 API
      const response = await callLanguageModelAPI(inputText);
      
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
        text: '抱歉，我暂时无法回应。请稍后再试。',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 清空对话
  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <h3>图鉴助手</h3>
          <div className={styles.actions}>
            <button onClick={clearChat} className={styles.clearButton}>
              清空
            </button>
            <button onClick={onClose} className={styles.closeButton}>
              ×
            </button>
          </div>
        </div>

        {/* 消息区域 */}
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
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              rows={1}
              className={styles.textInput}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className={styles.sendButton}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 大语言模型 API 调用函数
// 大语言模型 API 调用函数 - 直接调用版本
async function callLanguageModelAPI(message: string): Promise<string> {
  const API_KEY = '';
  const API_URL = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的图鉴助手，帮助用户了解山河图鉴的相关信息。回答要简洁专业。'
          },
          {
            role: 'user',
            content: message
          }
        ],
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
    return '抱歉，暂时无法处理您的请求。请稍后再试。';
  }
}