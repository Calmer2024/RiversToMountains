import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideChapterTitle.module.scss';

export const SlideChapterTitle: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideChapterTitleWrapper}`}>
            <div className={styles.chapterTitleCard} data-animate="text-fade-in">
                <div className={styles.chapterTitleWrapper}>
                    <h2>雪域天穹</h2>
                    <img
                        src="/images/雪域天穹.png"
                        alt="雪域天穹"
                        className={styles.titleIcon}
                    />
                </div>
                <div className={styles.divider}></div>
                <h3 className={styles.chapterSubtitle}>第一章·天际</h3>
                <p>
                    你背起行囊，便叩问了这般雪域天穹。这里是山河的源头，
                    雪峰静默，冰川闪耀，湖泊如镜，
                    展现着天地之初的纯粹与宏大。
                </p>
            </div>
        </div>
    );
};