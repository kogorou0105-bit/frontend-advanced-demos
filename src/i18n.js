import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 引入翻译资源 (也可以分开存放在 locales 文件夹中引入)
const resources = {
  en: {
    translation: {
      "app.title": "Frontend Lab",
      "app.subtitle": "React Advanced Techniques & Experiments",
      "nav.back": "Back to List",
      "theme.toggle": "Toggle Theme",
      "lang.switch": "Switch to Chinese",

      // Demos 翻译配置 (英文)
      demos: {
        virtualList: {
          title: "Fixed Height Virtual List",
          description:
            "Rendering 100k+ items efficiently by only rendering visible DOM nodes. Includes scroll calculation logic.",
        },
        variableList: {
          title: "Dynamic Height Virtual List",
          description:
            "Advanced: Rendering items with unknown heights using binary search and dynamic measurement to correct scroll position.",
        },
        infiniteScroll: {
          title: "Infinite Scroll",
          description:
            "High-performance pagination based on Intersection Observer API, avoiding scroll event listeners.",
        },
        lazyImage: {
          title: "Lazy Load & Preload Images",
          description:
            "Custom Hook implementation to load images only when they enter the viewport, with blur-up placeholder effect.",
        },
        carousel: {
          title: "Seamless Carousel",
          description:
            "Hand-written carousel component supporting auto-play, manual switching, and seamless loop transition logic.",
        },
        autocomplete: {
          title: "Debounced Autocomplete",
          description:
            "Search input with debouncing, handling race conditions, and keyword highlighting.",
        },
        treeView: {
          title: "Recursive Tree View",
          description:
            "Rendering multi-level nested data (like VSCode sidebar) using recursive components with independent state management.",
        },
        dragSort: {
          title: "Native Drag & Sort",
          description:
            "Implementation based on HTML5 Drag & Drop API, handling real-time array reordering without third-party libraries.",
        },
      },
    },
  },
  zh: {
    translation: {
      "app.title": "Frontend Lab",
      "app.subtitle": "React 前端难点与实验性功能展示仓库",
      "nav.back": "返回列表",
      "theme.toggle": "切换主题",
      "lang.switch": "切换到英文",

      // Demos 翻译配置 (中文)
      demos: {
        virtualList: {
          title: "定高虚拟列表",
          description:
            "处理十万级数据渲染，只渲染可视区域 DOM，包含滚动计算逻辑。",
        },
        variableList: {
          title: "不等高虚拟列表",
          description:
            "进阶难点：渲染内容高度不确定，需配合二分查找与动态高度测量(Measure)来实时修正滚动位置。",
        },
        infiniteScroll: {
          title: "触底无限加载",
          description:
            "基于 Intersection Observer API 实现高性能翻页，避免 scroll 事件监听，包含 Loading 状态与数据边界处理。",
        },
        lazyImage: {
          title: "图片懒加载与预加载",
          description:
            "自定义 Hook 实现图片进入视口才加载，支持占位图(Placeholder)到原图的平滑模糊过渡效果。",
        },
        carousel: {
          title: "无缝轮播图",
          description:
            "手写轮播组件，支持自动播放、手动切换、以及首尾相接的无缝过渡动画逻辑。",
        },
        autocomplete: {
          title: "防抖搜索联想",
          description:
            "实现带防抖功能的搜索输入框，处理网络请求竞态问题(Race Condition)，并支持关键词高亮显示。",
        },
        treeView: {
          title: "递归文件树",
          description:
            "基于递归组件渲染多层级嵌套数据（类似 VSCode 侧边栏），实现无限层级折叠/展开，独立管理节点状态。",
        },
        dragSort: {
          title: "原生拖拽排序",
          description:
            "基于 HTML5 Drag & Drop API 实现，处理 onDragEnter 实时交换数组顺序，无第三方库依赖。",
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector) // 1. 嗅探浏览器语言
  .use(initReactI18next) // 2. 初始化 React 插件
  .init({
    resources,
    fallbackLng: "en", // 默认语言
    debug: false,
    interpolation: {
      escapeValue: false, // React 默认已经防 XSS，这里不需要转义
    },
  });

export default i18n;
