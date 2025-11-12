import {motion} from 'framer-motion';
import styles from './IntroSection.module.scss';

// 定义一个简单的“向上浮现”动画配置
const fadeUp = {
  hidden: {opacity: 0, y: 40}, // 初始状态：透明，在下方 50px
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 2, ease: "easeOut"} // 慢慢浮上来，耗时2秒
  }
};

// 动画配置：图片容器遮罩
const imageReveal = {
  hidden: {opacity: 0, scale: 0.95},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {duration: 2, ease: "easeOut"}
  }
};

// 〰️ 连线动画配置：像水流一样画出来
const pathAnim = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 5, // 画慢一点，显得优雅
      ease: "easeInOut"
    }
  }
};

export const IntroSection = () => {
  return (
    <section className={styles.sectionContainer}>

      {/* 🎨 背景连线层 */}
      {/* 这个 SVG 覆盖整个区域，画一条 S 型曲线链接上下两部分 */}
      <svg className={styles.connectionSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          // 这是一条贝塞尔曲线 (S型)
          // M 80 20: 起点在右上 (对应第一张图附近)
          // C ... : 控制点，画出优雅的弧线
          // ... 20 80: 终点在左下 (对应第二张图附近)
          d="M 30 15 C 135 -20, 25 50, 25 75"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // 滚到 20% 时开始画线
          // @ts-ignore
          variants={pathAnim}
        />

      </svg>
      <div className={styles.contentWrapper}>

        {/* 🟦 第一组：左文右图 */}
        <div className={styles.storyRow}>

          {/* 左侧文字区 */}
          <motion.div
            className={styles.textContent}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.3}}
            // @ts-ignore
            variants={fadeUp}
          >
            <h3>
              <span className={styles.seal}>山河</span> {/* 🏮 红色印章 */}
              <span className={styles.subtitle}>
                <span>古韵</span>
                <span>数字化新生</span>
              </span>
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
            viewport={{once: true, amount: 0.3}}
            // @ts-ignore
            variants={imageReveal}
          >
            {/*TODO：改一个合适的图片*/}
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Mountain"/>

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
            viewport={{once: true, amount: 0.3}}
            // @ts-ignore
            variants={fadeUp}
          >
            <h3>
              <span className={styles.seal}>寻迹</span>
              <span className={styles.subtitle}>
                <span>沉浸体验</span>
                <span>指尖触达</span>
              </span>
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
            viewport={{once: true, amount: 0.3}}
            // @ts-ignore
            variants={imageReveal}
          >
            {/*TODO：改一个合适的图片*/}
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Nature"/>
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