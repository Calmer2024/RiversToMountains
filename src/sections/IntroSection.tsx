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
              <span className={styles.seal}>画卷</span> 
              <span className={styles.subtitle}>
                <span>西东万里</span>
                <span>一览山河</span>
              </span>
            </h3>
            <p>
              这是一幅横贯东西的数字长卷。
              我们以技术为笔，重绘从西域苍茫雪原到东海浩渺波涛的地理跨越。
              指尖轻触间，不仅是视觉的游历，更是对中华大地经纬脉络的深情注视。
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
            <img
              src="./images/summer-palace.jpg"
              alt="Mountain"/>

            {/* 📜 装饰：竖排文字 (放在图片边缘) */}
            <div className={styles.verticalDeco}>
              行遍江南塞北路
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
              <span className={styles.seal}>静域</span>
              <span className={styles.subtitle}>
                <span>喧嚣之外</span>
                <span>择处栖息</span>
              </span>
            </h3>
            <p>
              不仅是看客，更是归人。
              我们特辟一方“世外静域”，引山川白噪为伴，融专注机制于景。
              于松涛雨夜中安放焦虑，在数字山水中寻回久违的内心秩序。
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
            <img
              src="./images/china.jpg"
              alt="Nature"/>
            {/* 📜 装饰：竖排文字 */}
            <div className={`${styles.verticalDeco} ${styles.left}`}>
              偷得浮生半日闲
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};