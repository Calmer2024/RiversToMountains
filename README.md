# README

# 山河图鉴 (The Scroll of Mountains and Rivers)



**「山河图鉴」** 是一个基于 React 和 GSAP 的沉浸式数字体验网站。它将中国的壮丽山河化作一幅流动的交互式画卷，带领用户开启一场从西至东的视觉与诗意之旅。

项目不仅提供了“画卷”主线叙事，还创新性地加入了“世外”陪伴模式，为用户提供一个集专注、学习与放松于一体的沉浸式空间。

> **项目仓库:** `https://github.com/Calmer2024/RiversToMountains`

## ✨ 核心功能 (Features)

本项目包含两大核心模块：“山河画卷”主线和“世外”陪伴模式。

### 1. 📜 “山河画卷” (The Main Scroll)

这是项目的主体验，是一个由 GSAP `ScrollTrigger` 驱动的横向滚动叙事画廊。

- **史诗般的画卷叙事：** 引导用户从序章（`StoryHeaderSection`）开始，通过垂直滚动“解锁”一个被固定的（Pinned）横向滚动容器（`HorizontalStorySection`）。
- **GSAP 驱动的沉浸动画：**
  - **横向滚动 (Horizontal Scroll):** 整个画卷（包含数十个场景）在一个 `div` 中横向展开，通过 GSAP 将用户的垂直滚动转化为 `transform: translateX`。
  - **云层转场：** 使用多层云图和 `scale`、`opacity` 动画，实现从“序章”到“画卷”的平滑电影感转场。
  - **视差与淡入：** 画卷中的每个元素（如文本、背景）都拥有独立的 `ScrollTrigger`，实现视差滚动和动态淡入效果。
- **情景感应式 UI (Context-Aware UI)：**
  - 画卷顶部固定一个 UI 工具栏 (`StoryControls`)。
  - **动态信息：** 顶部“书页”按钮能实时识别用户当前滚动到的幻灯片（如“冈仁波齐”、“张掖丹霞”），并弹出对应的科普文字。
  - **集成 AI 助手：** 内置可拖拽的 AI 聊天弹窗 (`ChatDialog`)。
  - **高级音乐控件：** 优化的毛玻璃质感音乐面板，支持播放、暂停和音量条。



### 2. 🏞️ “世外”陪伴模式 (Companion Mode "Outside")

这是一个与主线分离的、注重功能性的沉浸式空间，旨在提供一个高效的“数字禅室”。

- **多场景切换：** 提供“崇山”、“天空”、“林间”、“草地”四种不同的动态场景。
- **沉浸式体验：** 每个场景都配有全屏循环的**背景视频**和定制的**白噪音**（如风声、鸟鸣）。
- **内置生产力工具：**
  - **番茄钟 (Pomodoro Timer)：** 用户可设置 5/15/25 分钟的专注时钟。
  - **诗歌阅读：** 提供一个“暗黑玻璃书房”风格的侧边栏，用于浏览和阅读诗歌。
  - **沉浸模式：** 可一键隐藏所有 UI，只保留背景视频和白噪音，实现纯粹的“屏保”体验。



### 3. 🎨 通用 UI / UX 优化

- **高级加载动画：** 仿 `sketchin.com` 风格，实现 Logo 淡入、多行 Slogan 逐句交替（入场/出场）的高级动画序列，并实现了**真·资源预加载**。
- **Hero 区域：** `HeroSection` 使用全屏视频背景，以及一个带“呼吸”和“光泽”动画的“开始探索”按钮，点击可平滑滚动至“画卷”序章。
- **毛玻璃导航栏 (Header)：**
  - 在首页顶部透明，滚动后变为毛玻璃（`backdrop-filter`）质感。
  - 在滚动到 `HorizontalStorySection` 时，通过 `IntersectionObserver` 自动收起（隐藏）。
  - 集成 `React Router`，实现“Home”与“Outside”模式的切换。
  - 包含指向 GitHub 仓库的链接。
- **全局样式：** 全局移除了浏览器默认滚动条（但保留滚动功能），提供了更干净的视觉体验。

------



## 🛠️ 技术栈 (Technology Stack)

- **前端框架:** React (v18)
- **语言:** TypeScript
- **动画库:** GSAP (GreenSock Animation Platform)
  - `ScrollTrigger` (用于驱动所有滚动动画)
  - `TextPlugin` (用于文本动画)
- **路由:** React Router (v6)
- **样式:** SCSS (Sass) & CSS Modules
- **图标:** React Icons (Fi)
- **构建工具:** Vite

------



## 🚀 本地运行 (Getting Started)

1. **克隆仓库**

   ```bash
   git clone https://github.com/Calmer2024/RiversToMountains.git
   cd RiversToMountains
   ```
   
2. **安装依赖**

   ```bash
   npm install
   # 或者
   # yarn install
   ```
   
3. **运行开发服务器**

   ```bash
npm run dev
   # 或者
   # yarn dev
   ```
   
   项目将在 `http://localhost:5173` (或 Vite 指定的端口) 上运行。

4. **构建生产版本**

   ```bash
   npm run build
   ```

------



## 📁 项目结构 (Project Structure)

```
/public/
  /images/        # 静态图片 (logo, posters, clouds)
  /videos/        # 背景视频 (hero, companion, slides)
  /music/         # 音频文件 (story-theme.mp3)
/src/
  /components/    # 可复用组件 (Header, Button, StoryControls, ChatDialog...)
  /data/          # 静态数据 (slideInfo.ts)
  /sections/      # 构成页面的主要“区域” (HeroSection, StatsSection...)
    /slides/      # HorizontalStorySection 专用的所有幻灯片子组件
  /styles/        # 全局 SCSS (global.scss, variables.scss)
  App.tsx         # 根组件和路由
  main.tsx        # 入口文件
```