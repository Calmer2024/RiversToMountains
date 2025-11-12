// @ts-ignore
import React, { useEffect, useRef, useState } from 'react';
import { FaHeart, FaClock, FaGlobeAsia } from "react-icons/fa";
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';
import styles from './StatsSection.module.scss';

/**
 * 核心组件：会跑动、会偷涨的数字
 * @param value 初始目标值
 * @param shouldGrow 是否需要开启“偷涨”模式 (比如天数就不需要涨)
 */
const AnimatedCounter = ({ value, shouldGrow = false }: { value: number, shouldGrow?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // 不再从 0 开始，而是从目标值的 xx% 开始跑
  const startValue = value * 0.98;

  const motionValue = useMotionValue(startValue);

  // 调整物理参数，让刹车更灵敏，不拖泥带水
  const springValue = useSpring(motionValue, {
    damping: 100, // 阻尼 (刹车)：越小晃得越厉害，适中一点停得快
    stiffness: 500, // 刚度 (动力)：越大跑得越快
    mass: 1, // 质量：轻一点，启动和停止都更快
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value); // 设置目标值，开始冲刺
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    if (!isInView || !shouldGrow) return;

    // 偷涨逻辑保持不变
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 5) + 1;
      const current = motionValue.get();
      // 这里要注意：如果还在跑动画的过程中，不要偷涨，以免冲突
      // 简单判断一下：如果当前值已经很接近目标值了，再开始偷涨
      if (current >= value) {
        motionValue.set(current + increment);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView, shouldGrow, motionValue, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        // 取整并格式化
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return <span ref={ref} className={styles.number} />;
};
export const StatsSection = () => {
  const stats = [
    {
      id: 1,
      icon: <FaHeart />,
      value: 105230, // 改成数字类型，方便计算
      label: "累计点赞收藏",
      grow: true // 开启偷涨
    },
    {
      id: 2,
      icon: <FaClock />,
      value: 520,
      unit: "天",
      label: "平稳守护时间",
      grow: false
    },
    {
      id: 3,
      icon: <FaGlobeAsia />,
      value: 2890000,
      label: "山河见证次数",
      grow: true // 开启偷涨
    },
  ];

  return (
    <section className={styles.statsContainer}>
      <div className={styles.statsWrapper}>
        {stats.map((item, index) => (
          <div key={item.id} className={styles.statItem}>
            {/* 图标加一个微小的呼吸动画 */}
            <motion.div
              className={styles.iconWrapper}
              animate={{ scale: [1, 1.1, 1] }} // 缩放：1 -> 1.1 -> 1
              transition={{
                duration: 2,
                repeat: Infinity, // 无限循环
                ease: "easeInOut",
                delay: index * 0.5 // 错开呼吸时间，更自然
              }}
            >
              {item.icon}
            </motion.div>

            <div className={styles.numberWrapper}>
              {/* 使用我们的新组件 */}
              <AnimatedCounter value={item.value} shouldGrow={item.grow} />
              {item.unit && <span className={styles.unit}>{item.unit}</span>}
            </div>

            <div className={styles.label}>{item.label}</div>

            {index !== stats.length - 1 && <div className={styles.divider} />}
          </div>
        ))}
      </div>
    </section>
  );
};