# Frontend Lab 🧪

> 一个基于 React + Tailwind CSS 的前端难点与实验性功能演练场。

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Build-Vite-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 项目介绍

本项目旨在深入探索前端开发中的核心概念与性能优化方案。不同于简单的组件堆砌，这里的每一个 Demo 都聚焦于解决特定的技术难点（如长列表性能瓶颈、复杂状态管理等）。

项目采用**配置驱动（Config-driven）**的架构设计，实现了路由的自动化生成与组件的按需加载，为后续扩展提供了良好的工程化基础。

## 🔗 Live Demo / 在线演示

**[👉 Live](https://kogorou0105-bit.github.io/frontend-advanced-demos/)**

## 🌟 核心亮点

- **工程化架构**：通过 `demos/index.js` 配置表统一管理 Demo 元数据，自动生成路由，无需手动编写重复的 Route 代码。
- **性能优化**：全站采用 `React.lazy` 实现路由级代码分割（Code Splitting），确保首屏加载速度。
- **极致体验**：使用 Tailwind CSS 构建现代化 UI，保证在展示硬核逻辑的同时拥有良好的视觉体验。

## 🧩 实验项目 (Demos)

### 1. 虚拟滚动系列 (Virtual Scrolling)

- **Fixed Height Virtual List (定高虚拟列表)**
  - 支持十万级数据渲染，只渲染可视区域 DOM。
  - **New**: 新增多种滚动动画策略与控制台日志面板。
- **Variable Height Virtual List (不定高虚拟列表)**
  - 进阶难点：处理高度不确定的列表项。
  - 核心技术：二分查找 (Binary Search) + 动态高度测量 (Dynamic Measurement) + 滚动位置修正。

### 2. 交互与性能 (Interaction & Performance)

- **Infinite Scroll (触底无限加载)**
  - 基于 `Intersection Observer API` 实现的高性能翻页，告别 scroll 事件监听。
- **Lazy Load Image (图片懒加载)**
  - 自定义 Hook 实现图片进入视口加载，支持 "Blur-up" 模糊占位过渡效果。
- **Debounced Autocomplete (防抖搜索)**
  - 处理网络请求竞态问题 (Race Condition)，支持关键词高亮。

### 3. 组件实现 (Component Implementation)

- **Seamless Carousel (无缝轮播图)**
  - 手写实现首尾相接的无缝循环逻辑 (Clone Node 方案)。
- **Recursive Tree View (递归文件树)**
  - 类似 VSCode 侧边栏的无限层级递归组件，独立管理节点状态。
- **Native Drag Sort (原生拖拽排序)**
  - 抛弃 dnd-kit，基于 HTML5 Drag API 实现列表实时交换排序。

## 📂 目录结构

项目的目录结构经过精心设计，遵循“配置与逻辑分离”的原则：

```text
frontend-lab/
├─ src/
│  ├─ demos/                 # 🧪 实验田核心区域
│  │  ├─ VirtualList/        # 虚拟列表
│  │  ├─ InfiniteScroll/     # 无限加载
│  │  ├─ Autocomplete/       # 防抖搜索
│  │  ├─ Carousel/           # 无缝轮播
│  │  ├─ LazyImage/          # 图片懒加载
│  │  ├─ TreeView/           # 递归文件树
│  │  └─ index.js            # ⚙️ 核心配置表：注册路由、标题、懒加载映射
│  ├─ pages/
│  │  ├─ Home.jsx            # 仪表盘首页（展示所有 Demo 卡片）
│  │  └─ DemoLayout.jsx      # 通用布局容器（包含返回导航、面包屑等）
│  ├─ App.jsx                # 路由入口（解析 demos/index.js 自动生成 Route）
│  └─ ...
```

## 🛠️ 如何运行

确保你的环境已安装 Node.js (v16+)。

1. **克隆仓库**

   ```bash
   git clone https://github.com/kogorou0105-bit/frontend-advanced-demos.git
   cd frontend-lab
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   ```

4. **构建生产版本**

   ```bash
   npm run build
   ```

## ✨ 最新更新 / Recent Updates

- **🎨 Global Dark Mode (Tailwind v4)**:
  完全适配 Tailwind CSS v4 的暗黑模式，内置 `ThemeContext` 与持久化状态管理，支持一键切换。
- **🌐 Internationalization (i18n)**:
  集成 `react-i18next`，支持中/英双语无缝切换，所有 Demo 文本均已提取为翻译键值。

## 🤝 如何贡献 / 添加新 Demo

得益于配置化的设计，添加一个新的 Demo 非常简单：

1. 在 `src/demos/` 下新建组件文件夹（如 `DragDrop`）。
2. 在 `src/demos/index.js` 中引入并注册：

   ```javascript
   {
     path: 'drag-drop',
     title: '拖拽排序',
     description: '基于 HTML5 Dnd API 的列表排序实现。',
     component: lazy(() => import('./DragDrop')),
   }
   ```

3. 无需修改任何路由代码，新页面即刻生效。
