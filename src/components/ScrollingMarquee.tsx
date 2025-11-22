// src/sections/ScrollingMarquee.tsx
import React from 'react';
import styles from './ScrollingMarquee.module.scss';

const ScrollingMarquee: React.FC = () => {
    // 定义要展示的文案项
    // isAccent 为 true 时，将使用特殊的古风强调字体
    const marqueeItems = [
        { text: '观山海万象', isAccent: true },
        { text: '品千年神韵', isAccent: false },
        { text: '承东方文脉', isAccent: true },
        { text: '绘盛世画卷', isAccent: false },
    ];

    // 为了实现无缝滚动，我们需要将内容复制一份
    const duplicatedItems = [...marqueeItems, ...marqueeItems];

    return (
        <section className={styles.marqueeSection}>
            <div className={styles.track}>
                <div className={styles.content}>
                    {duplicatedItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <span 
                                className={`${styles.textItem} ${item.isAccent ? styles.accent : ''}`}
                            >
                                {item.text}
                            </span>
                            {/* 最后一项后面不加分隔符，保证无缝连接 */}
                            {index !== duplicatedItems.length - 1 && (
                                <span className={styles.separator}>—</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ScrollingMarquee;