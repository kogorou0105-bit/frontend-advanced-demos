import { lazy } from "react";

// 懒加载组件
const VirtualList = lazy(() => import("./VirtualList/index.jsx"));
const InfiniteScroll = lazy(() => import("./InfiniteScroll/index.jsx"));
const LazyImage = lazy(() => import("./LazyImage/index.jsx"));
const Carousel = lazy(() => import("./Carousel/index.jsx"));
const Autocomplete = lazy(() => import("./Autocomplete/index.jsx"));
const TreeView = lazy(() => import("./TreeView/index.jsx"));
const DragSort = lazy(() => import("./DragSort/index.jsx"));
const VariableList = lazy(() => import("./VariableList/index.jsx"));

export const demos = [
  {
    path: "virtual-list",
    title: "demos.virtualList.title",
    description: "demos.virtualList.description",
    component: VirtualList,
  },
  {
    path: "variable-list",
    title: "demos.variableList.title",
    description: "demos.variableList.description",
    component: VariableList,
  },
  {
    path: "infinite-scroll",
    title: "demos.infiniteScroll.title",
    description: "demos.infiniteScroll.description",
    component: InfiniteScroll,
  },
  {
    path: "lazy-image",
    title: "demos.lazyImage.title",
    description: "demos.lazyImage.description",
    component: LazyImage,
  },
  {
    path: "carousel",
    title: "demos.carousel.title",
    description: "demos.carousel.description",
    component: Carousel,
  },
  {
    path: "autocomplete",
    title: "demos.autocomplete.title",
    description: "demos.autocomplete.description",
    component: Autocomplete,
  },
  {
    path: "tree-view",
    title: "demos.treeView.title",
    description: "demos.treeView.description",
    component: TreeView,
  },
  {
    path: "drag-sort",
    title: "demos.dragSort.title",
    description: "demos.dragSort.description",
    component: DragSort,
  },
];
