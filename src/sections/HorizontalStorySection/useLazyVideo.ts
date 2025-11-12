import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScroll } from './ScrollContext';

// [!code focus:start]
// [!] 1. 修复 "NodeJS" 报错
function simpleDebounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
) {
    // [!] 关键修改: 
    // "NodeJS.Timeout" 是 Node.js (后端) 的类型。
    // 在浏览器 (前端) 中, setTimeout 返回的是一个 "number"。
    let timeout: number | null = null;
    
    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        // [!] 明确使用 window.setTimeout, 它返回 'number'
        timeout = window.setTimeout(() => {
            func(...args);
        }, delay);
    };
}
// [!code focus:end]

export const useLazyVideo = (
    videoRef: React.RefObject<HTMLVideoElement | null>
) => {
    const { horizontalTween } = useScroll();

    useLayoutEffect(() => {
        const video = videoRef.current;
        if (!video || !horizontalTween) {
            return;
        }

        const slide = video.closest<HTMLElement>(
            '[class*="slide"]'
        );
        if (!slide) return;

        let hasLoaded = false;

        // [!] "激进预加载" 触发器 (保持不变)
        const loadTrigger = ScrollTrigger.create({
            trigger: slide,
            containerAnimation: horizontalTween,
            start: "left 200%", // 提前 100vw 加载
            end: "right 0%",   
            onEnter: () => {
                if (hasLoaded) return;
                
                const dataSrc = video.getAttribute('data-src');
                if (dataSrc) {
                    video.src = dataSrc;
                    video.load();
                    hasLoaded = true;
                }
            },
        });

        // [!] "防抖播放" 函数 (保持不变)
        const debouncedTogglePlay = simpleDebounce((isActive: boolean) => {
            if (isActive) {
                if (video.readyState >= 3) {
                    video.play();
                } else {
                    video.oncanplay = () => video.play();
                }
            } else {
                video.pause();
            }
        }, 100); 

        // 播放触发器 (保持不变)
        const playTrigger = ScrollTrigger.create({
            trigger: slide,
            containerAnimation: horizontalTween,
            start: "left 70%", 
            end: "right 30%",  
            
            onToggle: (self) => {
                debouncedTogglePlay(self.isActive);
            },
        });

        return () => {
            loadTrigger.kill();
            playTrigger.kill();
        };

    }, [videoRef, horizontalTween]);
};