// @ts-ignore
import React from 'react';
import { motion } from 'framer-motion'; // 引入动画库
import styles from './FeatureSection.module.scss';

// 📦 1. 容器动画：控制子元素的出场顺序
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.5, // 每个子元素间隔 xxx秒 出场
    }
  }
};

// 🃏 2. 卡片整体动画：从下往上滑入
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2, ease: "easeOut" }
  }
};

// 🖼️ 3. 图片的“高光 -> 沉浸”剧本
const imageAnim = {
  hidden: {
    filter: "brightness(1.2) grayscale(0)", // 初始状态：亮、原色
    scale: 1.1 // 稍微放大一点
  },
  visible: {
    filter: "brightness(0.7) grayscale(0.3)", // 最终状态：暗、低饱和
    scale: 1, // 回到正常大小
    transition: {
      delay: 3, // 让用户先看 xxx秒 的高清图！
      duration: 1.5, // 然后用 xxx秒 慢慢变暗
      ease: "easeInOut"
    }
  }
};

// 🌑 4. 遮罩层的剧本
const overlayAnim = {
  hidden: { opacity: 0 }, // 初始：没有遮罩，看清原图
  visible: {
    opacity: 1, // 最终：遮罩出现，为了衬托文字
    transition: { delay: 1.2, duration: 1.5 } // 和图片变暗同步
  }
};

// ✍️ 5. 文字的剧本
const textAnim = {
  hidden: { opacity: 0, y: 20 }, // 初始：隐藏
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.5, duration: 1 } // 等图片变暗后，文字才出来
  }
};

export const FeatureSection = () => {
  const features = [
    {
      id: 1, title: "寻山", subtitle: "Mount.", desc: "云深不知处，只缘身在此山中",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2, title: "问水", subtitle: "River.", desc: "君不见黄河之水天上来",
      img: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 3, title: "探楼", subtitle: "Tower.", desc: "危楼高百尺，手可摘星辰",
      img: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 4, title: "访古", subtitle: "History.", desc: "古人今人若流水，共看明月皆如此",
      img: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=1000&auto=format&fit=crop"
    },
  ];

  return (
    <section className={styles.sectionContainer}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2>探索 · 四时之景</h2>
        <p>Choose your journey</p>
      </motion.div>

      {/* 网格容器 */}
      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }} // 露出一点再触发
      >
        {features.map((item) => (
          <motion.div
            key={item.id}
            className={styles.card}
            // @ts-ignore
            variants={cardVariants} // 应用卡片入场动画
          >
            {/* 1. 背景图片层 */}
            <motion.div
              className={styles.bgImage}
              style={{ backgroundImage: `url(${item.img})` }}
              // @ts-ignore
              variants={imageAnim} // 应用“高光->沉浸”剧本
            />

            {/* 2. 黑色遮罩层 */}
            <motion.div
              className={styles.overlay}
              variants={overlayAnim} // 应用遮罩剧本
            />

            {/* 3. 文字内容层 */}
            <motion.div
              className={styles.content}
              variants={textAnim} // 应用文字剧本
            >
              <span className={styles.subtitle}>{item.subtitle}</span>
              <h3>{item.title}</h3>
              <p className={styles.desc}>{item.desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};