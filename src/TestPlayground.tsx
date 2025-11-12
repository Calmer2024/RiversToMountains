// src/TestPlayground.tsx
// @ts-ignore
import React from 'react';
// import styles from './styles/global.scss'; // 引入全局样式防止样式崩坏

// 👇 这里引入你要开发的组件
// 1. 比如你现在要写 IntroSection，就把这行注释解开
import { IntroSection } from './sections/IntroSection';

// 2. 等你要写 StatsSection，就解开这行
// import { StatsSection } from './sections/StatsSection';

// 3. FeatureSection 同理
// import { FeatureSection } from './sections/FeatureSection';

const TestPlayground = () => {
    return (
        <div style={{
            backgroundColor: '#f5f5f5', // 灰色背景，一眼区分开发环境
            minHeight: '100vh',
            padding: '40px'
        }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '40px' }}>
                🚧 独立组件测试台 🚧
            </h1>

            {/* 👇 这是一个测试容器，模拟真实宽度 */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minHeight: '200px'
            }}>

                {/* ------------------------------------------- */}
                {/* 👇 在这里放置你的组件 (解开注释)             */}
                {/* ------------------------------------------- */}

                 <IntroSection />

                {/* <StatsSection /> */}

                {/* <FeatureSection /> */}

                <p style={{textAlign:'center', padding: '50px', color: '#999'}}>
                    (当前没有加载组件，请在代码里解开注释)
                </p>

            </div>
        </div>
    );
};

export default TestPlayground;