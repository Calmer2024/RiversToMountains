import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideChapterCarved.module.scss'; // [!] 导入自己的 SCSS

export const SlideChapterCarved: FC = () => {
    return (
        // [!] 修改类名
        <div className={`${parentStyles.slide} ${styles.slideChapterCarvedWrapper}`}>
            {/* 结构与 SlideChapterTitle (雪域天穹) 完全相同 */}
            <div className={styles.chapterTitleCard} data-animate="text-fade-in">
                <div className={styles.chapterTitleWrapper}>
                    {/* [!] 替换标题 */}
                    <h2>斧凿天工</h2>
                    <img
                        // [!] 替换图片
                        src="/images/斧凿天工.png"
                        alt="斧凿天工"
                        className={styles.titleIcon}
                    />
                </div>
                <div className={styles.divider}></div>
                {/* [!] 替换副标题 */}
                <h3 className={styles.chapterSubtitle}>第二章·雕刻</h3>
                {/* [!] 替换段落文本 */}
                <p>
                    江河自高原奔涌而下，以亿万年时光为刃，深切峡谷，雕琢奇峰。
                    你将见证自然伟力最凌厉的笔触，如何塑造出大地的峥嵘。
                </p>
            </div>
        </div>
    );
};