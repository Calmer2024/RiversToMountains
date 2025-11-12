import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScroll } from './ScrollContext'; // 导入我们已有的 Context

/**
 * 一个自定义 Hook，用于懒加载和按需播放水平滚动中的视频。
 * @param videoRef - 指向 <video> 元素的 Ref
 */
export const useLazyVideo = (
    videoRef: React.RefObject<HTMLVideoElement | null>
) => {
    const { horizontalTween } = useScroll(); // 获取主滚动条

    useLayoutEffect(() => {
        const video = videoRef.current;
        if (!video || !horizontalTween) {
            return;
        }

        // 1. 找到这个视频所在的父幻灯片
        const slide = video.closest<HTMLElement>(
            '[class*="slide"]' // 查找类名中包含 "slide" 的父元素
        );
        if (!slide) return;

        let hasLoaded = false;

        // 2. 创建一个“加载”触发器
        const loadTrigger = ScrollTrigger.create({
            trigger: slide,
            containerAnimation: horizontalTween,
            start: "left 100%", // 当幻灯片的左边缘碰到视口右边缘 (即刚要进入)
            end: "right 0%",   // 当幻灯片的右边缘离开视口左边缘 (即完全离开)
            onEnter: () => {
                if (hasLoaded) return;
                
                // 开始加载视频
                const dataSrc = video.getAttribute('data-src');
                if (dataSrc) {
                    video.src = dataSrc;
                    video.load();
                    hasLoaded = true;
                }
            },
        });

        // 3. 创建一个“播放/暂停”触发器
        const playTrigger = ScrollTrigger.create({
            trigger: slide,
            containerAnimation: horizontalTween,
            start: "left 70%", // 当幻灯片进入视口 30% 时
            end: "right 30%",  // 当幻灯片离开视口 30% 时
            
            // onToggle 是 onEnter, onLeave, onEnterBack, onLeaveBack 的简写
            onToggle: (self) => {
                if (self.isActive) {
                    // 只有在视频数据足够播放时才尝试播放
                    if (video.readyState >= 3) {
                        video.play();
                    } else {
                        // 如果还没加载完，添加一个一次性事件
                        video.oncanplay = () => video.play();
                    }
                } else {
                    video.pause();
                }
            },
        });

        // 4. 清理
        return () => {
            loadTrigger.kill();
            playTrigger.kill();
        };

    }, [videoRef, horizontalTween]);
};