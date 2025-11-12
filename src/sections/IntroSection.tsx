// @ts-ignore
import React from 'react';
import { motion } from 'framer-motion';
import styles from './IntroSection.module.scss';

// 定义一个简单的“向上浮现”动画配置
const fadeUp = {
  hidden: { opacity: 0, y: 40 }, // 初始状态：透明，在下方 50px
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2, ease: "easeOut" } // 慢慢浮上来，耗时2秒
  }
};

// 动画配置：图片容器遮罩
const imageReveal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 2, ease: "easeOut" }
  }
};

export const IntroSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>

        {/* 🟦 第一组：左文右图 */}
        <div className={styles.storyRow}>

          {/* 左侧文字区 */}
          <motion.div
            className={styles.textContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            // @ts-ignore
            variants={fadeUp}
          >
            <h3>
              <span className={styles.seal}>山河</span> {/* 🏮 红色印章 */}
              古韵 · 数字化新生
            </h3>
            <p>
              我们致力于挖掘中华大地被遗忘的绝美风景。
              不仅仅是看风景，更是通过数字化的方式，永久珍藏这些瞬间。
            </p>
          </motion.div>

          {/* 右侧图片区 */}
          <motion.div
            className={styles.imageWrapper}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            // @ts-ignore
            variants={imageReveal}
          >
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Mountain" />

            {/* 📜 装饰：竖排文字 (放在图片边缘) */}
            <div className={styles.verticalDeco}>
              天地有大美而不言
            </div>
          </motion.div>
        </div>

        {/* 🟧 第二组：右文左图 (反向) */}
        <div className={`${styles.storyRow} ${styles.reverse}`}>

          <motion.div
            className={styles.textContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            // @ts-ignore
            variants={fadeUp}
          >
            <h3>
              <span className={styles.seal}>寻迹</span>
              沉浸体验 · 指尖触达
            </h3>
            <p>
              这是一幅流动的画卷。
              请向下滑动，开启一场西东之旅，见证大地的奇迹。
            </p>
          </motion.div>

          <motion.div
            className={styles.imageWrapper}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            // @ts-ignore
            variants={imageReveal}
          >
            <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Nature" />
            {/* 📜 装饰：竖排文字 */}
            <div className={`${styles.verticalDeco} ${styles.left}`}>
              万物有成理而不说
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};