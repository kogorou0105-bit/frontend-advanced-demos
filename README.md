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

### 4. 大文件切片上传与预览 (Large File Upload & Preview)

> 模拟真实网络环境下的高性能文件上传解决方案。

- **核心技术点**：
  - **文件切片 (File Slicing)**：使用 `Blob.prototype.slice` 对大文件进行分块处理，避免内存溢出。
  - **并发控制 (Concurrency Control)**：限制同时上传的请求数量，防止浏览器卡顿。
  - **断点续传 & 错误重试**：模拟网络波动，支持自动重试和从上次中断处继续上传。
  - **文件预览**：支持图片、视频等常见格式的上传前本地预览（Object URL）。
  - **长文件名处理**：使用 CSS/JS 结合处理超长文件名的 UI 展示（中间省略号）。
  - **网络模拟**：内置随机延迟模拟，还原真实弱网环境下的进度条抖动。

### 5. 富文本/代码编辑器 (Text/Code Editor)

> 轻量级且功能完备的编辑器实现。

- **核心技术点**：
  - **核心架构**：基于 contenteditable 或相关 AST 解析原理实现（根据你实际用的技术栈可微调）。
  - **状态管理**：光标位置保持、选区操作（Selection API）。
  - **扩展性**：支持自定义格式化命令与快捷键绑定。

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
