export interface ScenicSpot {
    id: string;
    title: string;
    subtitle: string;
    imageSrc: string; // 我们将使用 /public 目录
}

// 我们使用上一份清单中的数据
export const spots: ScenicSpot[] = [
    {
        id: 'huangshan',
        title: '安徽 · 黄山',
        subtitle: '奇松、怪石、云海',
        imageSrc: '/images/cards/huangshan.jpg', // 假设图片在 /public/images/cards/
    },
    {
        id: 'zhangjiajie',
        title: '湖南 · 张家界',
        subtitle: '砂岩峰林，阿凡达悬浮山',
        imageSrc: '/images/cards/zhangjiajie.jpg',
    },
    {
        id: 'jiuzhaigou',
        title: '四川 · 九寨沟',
        subtitle: '斑斓的钙化池',
        imageSrc: '/images/cards/jiuzhaigou.jpg',
    },
    {
        id: 'guilin',
        title: '广西 · 桂林',
        subtitle: '喀斯特峰林与漓江',
        imageSrc: '/images/cards/guilin.jpg',
    },
    {
        id: 'zhangye',
        title: '甘肃 · 张掖丹霞',
        subtitle: '大地上的彩虹条纹',
        imageSrc: '/images/cards/zhangye.jpg',
    },
    // ... 你可以添加更多 ...
];