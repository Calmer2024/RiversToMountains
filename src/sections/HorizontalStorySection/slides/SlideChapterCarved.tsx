import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideChapterCarved.module.scss'; // [!] 导入自己的 SCSS

export const SlideChapterCarved: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideChapterCarvedWrapper}`}>
            <div className={styles.chapterTitleCard} data-animate="text-fade-in">
                <div className={styles.chapterTitleWrapper}>
                    <h2>斧凿天工</h2>
                    <img
                        src="/images/slides/斧凿天工.png"
                        alt="斧凿天工"
                        className={styles.titleIcon}
                    />
                </div>
                <div className={styles.divider}></div>
                <h3 className={styles.chapterSubtitle}>第二章·雕刻</h3>
                <p>
                    江河自高原奔涌而下，以亿万年时光为刃，深切峡谷，雕琢奇峰。
                    你将见证自然伟力最凌厉的笔触，如何塑造出大地的峥嵘。
                </p>
            </div>
        </div>
    );
};