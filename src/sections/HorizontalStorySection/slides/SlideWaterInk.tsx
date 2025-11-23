import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideWaterInk.module.scss'; // [!] 导入自己的 SCSS

export const SlideWaterInk: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideWaterInkWrapper}`}>
            {/* 结构与 SlideChapterTitle (雪域天穹) 完全相同 */}
            <div className={styles.chapterTitleCard} data-animate="text-fade-in">
                <div className={styles.chapterTitleWrapper}>
                    <h2>水墨诗吟</h2>
                    <img
                        src="/images/slides/水墨诗吟.png"
                        alt="水墨诗吟"
                        className={styles.titleIcon}
                    />
                </div>
                <div className={styles.divider}></div>
                <h3 className={styles.chapterSubtitle}>第三章·画卷</h3>
                <p>
                    当江河趋于平缓，大地便化作了宣纸。这里是中国山水的典范，
                    墨色氤氲，诗意流淌，每一帧都是浸润在文化基因里的古典画卷。
                </p>
            </div>
        </div>
    );
};