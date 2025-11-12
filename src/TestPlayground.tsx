// src/TestPlayground.tsx
// @ts-ignore
import React from 'react';
// import styles from './styles/global.scss'; // 引入全局样式防止样式崩坏

import {IntroSection} from './sections/IntroSection';

import {StatsSection} from './sections/StatsSection';

import {FeatureSection} from './sections/FeatureSection';
import {TextMaskSection} from "./sections/TextMaskSection.tsx";
import {Header} from "./components/Header.tsx";
import CompanionSystem from "./components/CompanionSystem.tsx";

const TestPlayground = () => {
  return (
    <div style={{
      backgroundColor: '#f5f5f5', // 灰色背景，一眼区分开发环境
      minHeight: '100vh',
      padding: '40px'
    }}>
      <h1 style={{textAlign: 'center', color: '#333', marginBottom: '40px'}}>
        🚧 独立组件测试台 🚧
      </h1>

      {/* 这是一个测试容器，模拟真实宽度 */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        background: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minHeight: '200px'
      }}>

        {/*  组件 (解开注释)             */}


        <CompanionSystem />

        <p style={{textAlign: 'center', padding: '50px', color: '#999'}}>
          (组件预览完毕)
        </p>

      </div>
    </div>
  );
};

export default TestPlayground;