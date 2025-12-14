# Frontend Lab 🧪

> 一个基于 React + Tailwind CSS 的前端难点与实验性功能演练场。

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Build-Vite-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 项目介绍

本项目旨在深入探索前端开发中的核心概念与性能优化方案。不同于简单的组件堆砌，这里的每一个 Demo 都聚焦于解决特定的技术难点（如长列表性能瓶颈、复杂状态管理等）。

项目采用**配置驱动（Config-driven）**的架构设计，实现了路由的自动化生成与组件的按需加载，为后续扩展提供了良好的工程化基础。

## 🌟 核心亮点

- **工程化架构**：通过 `demos/index.js` 配置表统一管理 Demo 元数据，自动生成路由，无需手动编写重复的 Route 代码。
- **性能优化**：全站采用 `React.lazy` 实现路由级代码分割（Code Splitting），确保首屏加载速度。
- **极致体验**：使用 Tailwind CSS 构建现代化 UI，保证在展示硬核逻辑的同时拥有良好的视觉体验。

## 🧩 实验项目 (Demos)

| 项目名称                       | 核心技术点                                    | 难点解析                                                                                                                 |
| :----------------------------- | :-------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **VirtualList**定高虚拟列表    | `Scroll Event` `Math` `Transform`             | 处理 10 万+ 数据渲染瓶颈。通过计算可视区索引，只渲染屏幕可见 DOM，利用 `padding` 撑开容器高度，保持原生滚动体验。        |
| **InfiniteScroll**触底无限加载 | `IntersectionObserver` `Callback Ref`         | 摒弃低性能的 scroll 监听。利用 IO API 监听底部哨兵元素，解决 `useEffect` 闭包陷阱，实现高性能分页加载。                  |
| **Autocomplete**防抖搜索联想   | `Debounce` `AbortController` `Race Condition` | 手写 `useDebounce` 优化请求频次。利用 `AbortController` 取消未完成请求以解决**竞态问题**，并用正则实现关键词高亮。       |
| **Carousel**无缝轮播图         | `TransitionEnd` `Clone Node` `Throttling`     | 通过首尾克隆节点实现视觉无缝切换。核心在于利用**节流锁**解决快速点击导致的白屏问题，以及定时器的自动管理。               |
| **LazyImage**图片懒加载        | `IntersectionObserver` `Double State`         | **双重状态管理**（InView/Loaded）。利用骨架屏占位防止 **CLS (布局偏移)**，支持图片加载完成后的优雅渐变显示。             |
| **TreeView**递归文件树         | `Recursion` `DFS` `Component Self-Call`       | 组件**递归调用**自身以渲染无限层级数据（类似 VS Code 侧边栏）。独立管理每个节点的展开/折叠状态，数据结构转化的经典案例。 |

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
