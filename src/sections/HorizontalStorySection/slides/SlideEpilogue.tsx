import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideEpilogue.module.scss'; // [!] 导入自己的 SCSS

export const SlideEpilogue: FC = () => {
    return (
        // [!] 修改类名
        <div className={`${parentStyles.slide} ${styles.slideEpilogueWrapper}`}>
            {/* 结构与 SlideChapterTitle (雪域天穹) 完全相同 */}
            <div className={styles.chapterTitleCard} data-animate="text-fade-in">
                <div className={styles.chapterTitleWrapper}>
                    {/* [!] 替换标题 */}
                    <h2>烟火弦歌</h2>
                    <img
                        // [!] 替换图片
                        src="/images/烟火弦歌.png"
                        alt="烟火弦歌"
                        className={styles.titleIcon}
                    />
                </div>
                <div className={styles.divider}></div>
                {/* [!] 替换副标题 */}
                <h3 className={styles.chapterSubtitle}>第四章·人间</h3>
                {/* [!] 替换段落文本 */}
                <p>
                    山河的终点，是人间。你将走入梯田、村落与滩涂，
                    看人们如何与山水共生，在此间刻下文明的指纹，
                    奏响宁静而悠远的生命弦歌。
                </p>
            </div>
        </div>
    );
};