import React, { useState, useEffect } from 'react';
import styles from './FeedbackPage.module.scss';
import { useNavigate } from 'react-router-dom';
// ✨ 1. 引入 framer-motion 和图标
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

interface FeedbackForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'suggestion' | 'bug' | 'feature' | 'other';
}

const backgroundImages = [
  '/images/cards/guilin.jpg',
  '/images/cards/huangshan.jpg',
  '/images/cards/jiuzhaigou.jpg',
  '/images/cards/zhangjiajie.jpg',
  '/images/cards/zhangye.jpg'
];

// ✨ 2. 定义动画
// 瀑布流式入场 (容器)
const containerVariant = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 每个子元素间隔 0.1s
    }
  }
};
// 简单的“淡入+上浮”效果 (子元素)
const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};


const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'suggestion'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ✨ 返回按钮
  const navigate = useNavigate();

  // 背景轮播效果
  useEffect(() => {
    const timer = setInterval(() => {
      if (backgroundImages.length <= 1) return;

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 1000); // 1s 淡出
    }, 5000); // 5s 切换

    return () => clearInterval(timer);
  }, []);

  // 模拟发送
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 模拟邮件发送
      await sendFeedbackEmail(feedback);
      setSubmitStatus('success');
      setFeedback({
        name: '', email: '', subject: '', message: '', type: 'suggestion'
      });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 模拟 API
  const sendFeedbackEmail = async (feedbackData: FeedbackForm): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('发送反馈邮件:', feedbackData);
        resolve();
      }, 1500);
    });
  };

  return (
    <div
      className={`${styles.feedbackPage} ${isTransitioning ? styles.transitioning : ''}`}
      style={{ backgroundImage: `url(${backgroundImages[currentBgIndex]})` }}
    >
      {/* ✨ 3. 应用动画 (motion.div) */}
      <motion.div
        className={styles.mainContainer}
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        {/* 返回按钮 */}
        <motion.button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          variants={fadeInVariant}
        >
          <FaArrowLeft />
        </motion.button>

        {/* 标题区域 */}
        <motion.div className={styles.headerSection} variants={fadeInVariant}>
          <h1 className={styles.pageTitle}>用户意见箱</h1>
          <p className={styles.pageSubtitle}>
            感谢您使用山河图鉴！我们珍视每一位用户的反馈，您的建议将帮助我们不断改进。
          </p>
        </motion.div>

        {/* 反馈表单 */}
        <motion.div className={styles.feedbackFormSection} variants={fadeInVariant}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>发送反馈</h2>

            {submitStatus === 'success' && (
              <div className={styles.successMessage}>
                ✅ 感谢您的反馈！我们已经收到您的意见，会尽快处理。
              </div>
            )}

            {submitStatus === 'error' && (
              <div className={styles.errorMessage}>
                发送失败，请稍后重试或直接发送邮件至：2810923102@qq.com
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.feedbackForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    您的姓名 *
                  </label>
                  <input
                    type="text" id="name" name="name"
                    value={feedback.name} onChange={handleChange}
                    className={styles.formInput}
                    required
                    placeholder="请输入您的姓名"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    电子邮箱 *
                  </label>
                  <input
                    type="email" id="email" name="email"
                    value={feedback.email} onChange={handleChange}
                    className={styles.formInput}
                    required
                    placeholder="请输入您的邮箱地址"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="type" className={styles.label}>
                    反馈类型 *
                  </label>
                  <select
                    id="type" name="type"
                    value={feedback.type} onChange={handleChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value="suggestion">功能建议</option>
                    <option value="bug">问题报告</option>
                    <option value="feature">新功能请求</option>
                    <option value="other">其他反馈</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    主题 *
                  </label>
                  <input
                    type="text" id="subject" name="subject"
                    value={feedback.subject} onChange={handleChange}
                    className={styles.formInput}
                    required
                    placeholder="请简要描述反馈内容"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  详细描述 *
                </label>
                <textarea
                  id="message" name="message"
                  value={feedback.message} onChange={handleChange}
                  className={styles.formTextarea}
                  required
                  rows={6}
                  placeholder="请详细描述您的建议、遇到的问题或期望的功能..."
                />
                <div className={styles.charCount}>
                  {feedback.message.length}/1000
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !feedback.name || !feedback.email || !feedback.subject || !feedback.message}
              >
                {isSubmitting ? '发送中...' : '发送反馈'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* 联系信息 */}
        <motion.div className={styles.contactSection} variants={fadeInVariant}>
          <div className={styles.contactCard}>
            <h3>其他联系方式</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>邮箱地址：</span>
                <a href="mailto:2810923102@qq.com" className={styles.contactLink}>
                  2810923102@qq.com
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>响应时间：</span>
                <span>我们会在1-3个工作日内回复您的反馈</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 常见问题 */}
        <motion.div className={styles.faqSection} variants={fadeInVariant}>
          <h3>反馈前请阅读</h3>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <strong>如何让反馈更有效？</strong>
              <p>请尽量详细描述问题场景，附上相关截图，这样我们能更快理解并解决问题。</p>
            </div>
            <div className={styles.faqItem}>
              <strong>隐私保护</strong>
              <p>您的联系信息仅用于回复反馈，我们承诺不会将您的信息用于其他用途或透露给第三方。</p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default FeedbackPage;