import { lazy } from "react";

// 懒加载组件
const VirtualList = lazy(() => import("./VirtualList/index.jsx"));
const InfiniteScroll = lazy(() => import("./InfiniteScroll/index.jsx"));
const LazyImage = lazy(() => import("./LazyImage/index.jsx"));
const Carousel = lazy(() => import("./Carousel/index.jsx"));
const Autocomplete = lazy(() => import("./Autocomplete/index.jsx"));
const TreeView = lazy(() => import("./TreeView/index.jsx"));
const DragSort = lazy(() => import("./DragSort/index.jsx"));

export const demos = [
  {
    path: "virtual-list",
    title: "定高虚拟列表",
    description: "处理十万级数据渲染，只渲染可视区域 DOM，包含滚动计算逻辑。",
    component: VirtualList,
  },
  {
    path: "infinite-scroll",
    title: "触底无限加载",
    description:
      "基于 Intersection Observer API 实现高性能翻页，避免 scroll 事件监听，包含 Loading 状态与数据边界处理。",
    component: InfiniteScroll,
  },
  {
    path: "lazy-image",
    title: "图片懒加载与预加载",
    description:
      "自定义 Hook 实现图片进入视口才加载，支持占位图(Placeholder)到原图的平滑模糊过渡效果。",
    component: LazyImage,
  },
  {
    path: "carousel",
    title: "无缝轮播图",
    description:
      "手写轮播组件，支持自动播放、手动切换、以及首尾相接的无缝过渡动画逻辑。",
    component: Carousel,
  },
  {
    path: "autocomplete",
    title: "防抖搜索联想",
    description:
      "实现带防抖功能的搜索输入框，处理网络请求竞态问题(Race Condition)，并支持关键词高亮显示。",
    component: Autocomplete,
  },
  {
    path: "tree-view",
    title: "递归文件树",
    description:
      "基于递归组件渲染多层级嵌套数据（类似 VSCode 侧边栏），实现无限层级折叠/展开，独立管理节点状态。",
    component: TreeView,
  },
  {
    path: "drag-sort",
    title: "原生拖拽排序",
    description:
      "基于 HTML5 Drag & Drop API 实现，处理 onDragEnter 实时交换数组顺序，无第三方库依赖。",
    component: DragSort,
  },
];
