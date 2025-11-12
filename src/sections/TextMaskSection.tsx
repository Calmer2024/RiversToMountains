// @ts-ignore
import React from 'react';
import { motion } from 'framer-motion';
import styles from './TextMaskSection.module.scss';

export const TextMaskSection = () => {
  return (
    <section className={styles.container}>
      <motion.div
        className={styles.textWrapper}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* 核心遮罩文字 */}
        <h1 className={styles.maskedText} data-text="山河入梦">
          山河入梦
        </h1>

        <p className={styles.subtitle}>
          A Dream of Mountains and Rivers
        </p>
      </motion.div>
    </section>
  );
};