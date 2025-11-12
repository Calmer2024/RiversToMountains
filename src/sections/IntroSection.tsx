// @ts-ignore
import React from 'react';
import { motion } from 'framer-motion';
import styles from './IntroSection.module.scss';

// 定义一个简单的“向上浮现”动画配置
const fadeUp = {
  hidden: { opacity: 0, y: 50 }, // 初始状态：透明，在下方 50px
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2, ease: "easeOut" } // 慢慢浮上来，耗时0.8秒
  }
};

export const IntroSection = () => {
  // @ts-ignore
  // @ts-ignore
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>

        {/* 🟦 第一块：左文右图 */}
        <motion.div
          className={styles.storyRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }} // 露出 30% 就触发动画
          // @ts-ignore
          variants={fadeUp}
        >
          <div className={styles.textContent}>
            <h3>古韵山河 · 数字化新生</h3>
            <p>
              我们致力于挖掘中华大地被遗忘的绝美风景。
              不仅仅是看风景，更是通过数字化的方式，永久珍藏这些瞬间。
            </p>
          </div>
          <div className={styles.imageContent}>
            {/* TODO 暂时用占位图，回头换成大气的山水图 */}
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Mountain" />
          </div>
        </motion.div>

        {/* 🟧 第二块：左图右文 (反过来) */}
        <motion.div
          className={`${styles.storyRow} ${styles.reverse}`} // 加个 reverse 类名让它反向
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          // @ts-ignore
          variants={fadeUp}
        >
          <div className={styles.textContent}>
            <h3>沉浸体验 · 指尖触达</h3>
            <p>
              这是一幅流动的画卷。
              请向下滑动，开启一场西东之旅，见证大地的奇迹。
            </p>
          </div>
          <div className={styles.imageContent}>
            {/* TODO 暂时用占位图，回头换成大气的山水图 */}
            <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Nature" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};