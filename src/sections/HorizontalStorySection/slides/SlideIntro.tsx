import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';

export const SlideIntro: FC = () => {
    return (
        <div className={parentStyles.slide}>
            {/* 这个是开头的空白幻灯片，用于提供滚动空间 */}
        </div>
    );
};