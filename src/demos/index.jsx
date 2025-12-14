import { lazy } from "react";

// 懒加载组件
const VirtualList = lazy(() => import("./VirtualList/index.jsx"));

export const demos = [
  {
    path: "virtual-list",
    title: "定高虚拟列表",
    description: "处理十万级数据渲染，只渲染可视区域 DOM，包含滚动计算逻辑。",
    component: VirtualList,
  },
];
