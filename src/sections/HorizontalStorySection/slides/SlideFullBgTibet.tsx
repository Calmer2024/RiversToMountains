import type { FC } from 'react';
import parentStyles from '../HorizontalStorySection.module.scss';
import styles from './SlideFullBgTibet.module.scss';

export const SlideFullBgTibet: FC = () => {
    return (
        <div className={`${parentStyles.slide} ${styles.slideFullBgTibet}`}>
            <div className={styles.loadingBar}></div>
        </div>
    );
};