# Frontend Lab 🧪

> 一个基于 React + Tailwind CSS 的前端难点与实验性功能演练场。

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?logo=tailwindcss)
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

| 项目名称                    | 核心技术点                        | 难点解析                                                                                                                                                         |
| :-------------------------- | :-------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VirtualList**定高虚拟列表 | `Scroll Event` `Math` `Transform` | 处理 10 万+ 数据渲染瓶颈。通过计算可视区索引（StartIndex/EndIndex），只渲染屏幕可见的 DOM 节点，并利用 `padding` 或 `transform` 撑开容器高度，保持原生滚动体验。 |
| _(Coming Soon)_             | ...                               | 不定高虚拟列表、拖拽排序、并发模式探索...                                                                                                                        |

## 📂 目录结构

项目的目录结构经过精心设计，遵循“配置与逻辑分离”的原则：

```text
frontend-lab/
├─ src/
│  ├─ demos/                 # 🧪 实验田核心区域
│  │  ├─ VirtualList/        # 具体 Demo 模块
│  │  ├─ UseRefDemo/
│  │  └─ index.js            # ⚙️ 核心配置表：注册路由、标题、懒加载映射
│  ├─ pages/
│  │  ├─ Home.jsx            # 仪表盘首页
│  │  └─ DemoLayout.jsx      # 通用布局容器（包含导航、面包屑等）
│  ├─ App.jsx                # 路由入口（解析配置表自动生成 Route）
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
