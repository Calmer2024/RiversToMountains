# 🏞️ 山河图鉴 (Rivers & Mountains)



`山河图鉴` 是一个旨在以“高级感”和“沉浸式体验”展示中国山水奇景的现代Web项目。

本项目深受 `Squarespace.com` 设计风格的启发，追求极简的布局、巨型字体排版、高品质的影像素材，以及平滑、富有创意的交互动画。

------

[ [此处插入一张网站的精美截图，例如 Hero Section 或 Card Carousel] ]



## ✨ 核心功能 (Key Features)

- **全屏视频主屏 (Hero Section):**
  - 自动播放、静音的 4K 视频背景。
  - 使用自定义的 `title.png` 图片Logo，替代标准文本标题，提升品牌感。
- **浮动头部导航 (Header):**
  - 采用 `position: absolute` 浮动于主屏之上，实现现代网站的层次感。
  - 包含 Logo（左）和图标按钮（右）。
- **2D 倾斜卡片轮播 (Card Carousel):**
  - 项目的核心交互功能，用于展示山水景点清单。
  - 使用 `Swiper.js` 的 `onProgress` API **完全自定义**实现。
  - **中间卡片：** 尺寸最大、水平（`rotate: 0`）。
  - **两侧卡片：** 尺寸缩小、有轻微的Y轴上移和Z轴倾斜（`rotateZ`）。
  - 卡片间距由 `spaceBetween` 控制，**互不重叠**，布局干净。
  - 支持点击两侧卡片平滑切换，点击中间卡片可跳转（已预留 `onClick` 逻辑）。
  - 支持自动播放和鼠标拖拽。



## 🛠️ 技术栈 (Tech Stack)

- **React (v18+)**
- **TypeScript**
- **Vite** (作为开发服务器和构建工具)
- **Swiper.js** (用于实现高度自定义的卡片轮播)
- **SCSS (CSS Modules)** (用于编写组件化、可维护的样式)
- **react-icons** (用于头部导航的图标)



## 🚀 本地运行 (Getting Started)

### 1. 克隆项目

```bash
git clone https://github.com/your-username/RiversToMountains.git
cd RiversToMountains
```

*(请将 `your-username/RiversToMountains.git` 替换为你们的实际仓库地址)*

### 2. 安装依赖

```bash
npm install
```

### 3. 准备静态资源

本项目的视觉效果**高度依赖**本地静态资源。请在 `public/` 目录下创建并放置以下文件，否则应用将无法正常显示：

```
/public
|-- /videos/
|   `-- hero-video.mp4      # 主屏的背景视频
|
|-- /images/
|   |-- hero-poster.jpg     # 视频加载前的封面图
|   |-- title.png           # Hero Section 的 Logo 图片
|   |-- /cards/
|   |   |-- huangshan.jpg   # 卡片轮播 - 黄山
|   |   |-- zhangjiajie.jpg # 卡片轮播 - 张家界
|   |   |-- ... (其他所有景点图片)
```

### 4. 运行开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` (或Vite指定的其他端口) 上运行。



## 📁 项目结构 (Project Structure)

```
/src
|
|-- /components     # 全局可复用的小组件 (e.g., Button.tsx, Header.tsx)
|-- /data           # 数据源 (e.g., scenicSpots.ts)
|-- /sections       # 构成页面的"版块" (e.g., HeroSection.tsx, CardCarousel.tsx)
|-- /styles         # 全局样式 (e.g., global.scss, _variables.scss)
|-- /assets         # 需要被 Vite 打包处理的静态资源 (e.g., UI图标)
|
|-- App.tsx         # 应用主组件 (负责页面版块布局)
|-- main.tsx        # 应用入口 (启动 React, 导入全局 CSS)
|-- types.d.ts      # TypeScript 全局类型声明 (e.g., for swiper/css)
|
/public
|-- /videos         # 静态视频资源 (Vite 不处理)
|-- /images         # 静态图片资源 (Vite 不处理)
```



## 🤝 团队分工 (Team Contribution)

为了高效协作，我们按以下职责划分：

- **UI/UX & 视觉 (Designer):**
  - **职责:** 负责定义 `src/styles/_variables.scss` 中的所有设计规范（颜色、字体、间距）。
  - **职责:** 筛选、压缩并管理 `public/` 目录中的所有视觉素材（视频、图片）。
- **React 组件工程师 (Component Logic):**
  - **职责:** 负责 `components/` 和 `sections/` 中组件的 `props` 定义、状态管理和业务逻辑 (e.g., `handleCardClick`, `spot.map(...)`)。
  - **职责:** 负责 `App.tsx` 中的页面布局和组件编排。
- **前端动效/样式工程师 (Style & Motion):**
  - **职责:** 负责所有 `.module.scss` 文件的编写，将设计稿高保真还原。
  - **职责:** **(核心)** 负责实现高级交互动画，例如 `CardCarousel.tsx` 中的 `onProgress` 和 `onSetTransition` 回调，以实现 `Squarespace` 风格的动画。



## 📄 许可证 (License)

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 授权。
