import { createContext, useContext } from 'react';
import type { gsap } from 'gsap';

// 1. 定义 Context 将要传递的数据类型
interface ScrollContextType {
    horizontalTween: gsap.core.Tween | null;
}

// 2. 创建 Context
export const ScrollContext = createContext<ScrollContextType>({
    horizontalTween: null,
});

// 3. 创建一个自定义 Hook，方便子组件使用
export const useScroll = () => useContext(ScrollContext);