import { useState, useRef, useLayoutEffect } from "react";
import {
  AlignLeft,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Navigation,
  Settings,
  Activity,
  Zap,
  EyeOff,
  BrainCircuit,
} from "lucide-react";

// ==========================================
// 1. 模拟数据生成器
// ==========================================
const generateData = (count) => {
  const sentences = [
    "React 是一个用于构建用户界面的 JavaScript 库。",
    "虚拟滚动（Virtual Scrolling）是前端性能优化的核心技术之一。",
    "Tailwind CSS 是一个功能类优先的 CSS 框架。",
    "在不等高列表中，我们需要动态测量每个列表项的真实高度。",
    "如果不进行优化，渲染 10 万个 DOM 节点会导致浏览器卡死。",
    "这是一段比较长的文本，旨在测试换行后的高度计算是否准确这是一段比较长的文本，旨在测试换行后的高度计算是否准确这是一段比较长的文本，旨在测试换行后的高度计算是否准确这是一段非常非常长的文本，用来测试自动换行后的高度变化。它包含了很多废话，主要目的就是为了把这个 div 撑高，看看我们的测量逻辑准不准。如果不准的话，列表就会抖动，用户体验就会很差。所以我们必须使用 ResizeObserver 或者 getBoundingClientRect 来精确获取高度。",
    "短文本。",
    "中等长度的文本，大概占据两行左右的空间，具体取决于屏幕宽度。",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    index: i,
    content: sentences[Math.floor(Math.random() * sentences.length)],
    color: i % 2 === 0 ? "bg-white" : "bg-gray-50",
  }));
};

// 配置常量
const TOTAL_COUNT = 1000;
const ESTIMATED_HEIGHT = 80;
const CONTAINER_HEIGHT = 500;

// --- 动画模式定义 ---
const SCROLL_MODES = {
  SMART: {
    id: "smart",
    name: "Smart Hybrid",
    desc: "智能判断：近距离平滑，远距离瞬移",
    icon: <BrainCircuit size={16} />,
  },
  NATIVE: {
    id: "native",
    name: "Native Smooth",
    desc: "强制原生平滑 (可能有误差)",
    icon: <Activity size={16} />,
  },
  BLUR: {
    id: "blur",
    name: "Blur & Teleport",
    desc: "模糊瞬移 (强烈推荐)",
    icon: <EyeOff size={16} />,
  },
  FLASH: {
    id: "flash",
    name: "Flash Skip",
    desc: "分段加速动画",
    icon: <Zap size={16} />,
  },
};

export default function VariableList() {
  const [listData] = useState(() => generateData(TOTAL_COUNT));
  const containerRef = useRef(null);

  // 状态管理
  const [positions, setPositions] = useState(() => {
    return listData.map((_, index) => ({
      index,
      height: ESTIMATED_HEIGHT,
      top: index * ESTIMATED_HEIGHT,
      bottom: (index + 1) * ESTIMATED_HEIGHT,
      isMeasured: false,
    }));
  });

  const [scrollTop, setScrollTop] = useState(0);
  const [currentMode, setCurrentMode] = useState(SCROLL_MODES.SMART.id);
  const [jumpIndex, setJumpIndex] = useState("");
  const [isBlurring, setIsBlurring] = useState(false);
  const [logMsg, setLogMsg] = useState(null);

  const totalHeight = positions[positions.length - 1].bottom;

  // --- 二分查找 ---
  const getStartIndex = (scrollTop) => {
    let start = 0;
    let end = positions.length - 1;
    let tempIndex = -1;

    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const midVal = positions[mid].bottom;

      if (midVal === scrollTop) return mid + 1;
      else if (midVal < scrollTop) start = mid + 1;
      else {
        if (tempIndex === -1 || tempIndex > mid) tempIndex = mid;
        end = mid - 1;
      }
    }
    return tempIndex;
  };

  const startIndex = getStartIndex(scrollTop);
  const VISIBLE_COUNT = 10;
  const endIndex = Math.min(startIndex + VISIBLE_COUNT, listData.length);
  const visibleData = listData.slice(startIndex, endIndex);

  // --- 滚动监听 ---
  const onScroll = (e) => {
    requestAnimationFrame(() => {
      setScrollTop(e.target.scrollTop);
    });
  };

  // --- 动态测量 ---
  const measureItem = (index, realHeight) => {
    setPositions((prevPositions) => {
      const target = prevPositions[index];
      if (target.isMeasured && Math.abs(target.height - realHeight) < 0.5) {
        return prevPositions;
      }

      const newPositions = [...prevPositions];
      newPositions[index] = {
        ...target,
        height: realHeight,
        bottom: target.top + realHeight,
        isMeasured: true,
      };

      const diff = realHeight - target.height;
      if (diff !== 0) {
        for (let i = index + 1; i < newPositions.length; i++) {
          newPositions[i].top = newPositions[i - 1].bottom;
          newPositions[i].bottom = newPositions[i].top + newPositions[i].height;
        }
      }
      return newPositions;
    });
  };

  // --- 核心：跳转逻辑 ---
  const handleScrollTo = (target) => {
    if (!containerRef.current) return;

    let targetIndex = 0;
    if (target === "top") targetIndex = 0;
    else if (target === "bottom") targetIndex = listData.length - 1;
    else targetIndex = parseInt(target, 10);

    if (isNaN(targetIndex)) return;
    targetIndex = Math.max(0, Math.min(targetIndex, listData.length - 1));

    // *关键区别*：在不定高列表中，我们获取的是 position 表中的 top
    // 这个 top 可能是真实的，也可能是基于估算的
    const targetScrollTop = positions[targetIndex].top;
    const currentScrollTop = containerRef.current.scrollTop;

    // 计算当前大概在哪一行
    const currentIndex = getStartIndex(currentScrollTop);
    const indexDiff = Math.abs(targetIndex - currentIndex);

    switch (currentMode) {
      case SCROLL_MODES.SMART.id:
        if (indexDiff <= 50) {
          // 阈值调小点，因为不定高误差大
          setLogMsg(`近距离 (${indexDiff}) -> 平滑滚动`);
          executeNativeScroll(targetScrollTop);
        } else {
          setLogMsg(`远距离 (${indexDiff}) -> 模糊瞬移 (推荐)`);
          executeBlurScroll(targetScrollTop);
        }
        break;
      case SCROLL_MODES.NATIVE.id:
        setLogMsg("执行原生平滑滚动");
        executeNativeScroll(targetScrollTop);
        break;
      case SCROLL_MODES.BLUR.id:
        setLogMsg("执行模糊瞬移");
        executeBlurScroll(targetScrollTop);
        break;
      case SCROLL_MODES.FLASH.id:
        setLogMsg("执行分段帧动画");
        executeFlashScroll(
          currentScrollTop,
          targetScrollTop,
          targetScrollTop - currentScrollTop
        );
        break;
      default:
        containerRef.current.scrollTop = targetScrollTop;
    }
  };

  // --- 策略实现 (复用之前的逻辑) ---
  const executeNativeScroll = (top) => {
    containerRef.current.scrollTo({ top, behavior: "smooth" });
  };

  const executeBlurScroll = async (top) => {
    setIsBlurring(true);
    await new Promise((r) => setTimeout(r, 200));
    containerRef.current.scrollTop = top;
    // 稍微给多一点时间让 DOM 测量和回流
    requestAnimationFrame(() => {
      setTimeout(() => setIsBlurring(false), 80);
    });
  };

  const executeFlashScroll = (start, end, distance) => {
    const startTime = performance.now();
    const duration = 800;
    const shouldSkip = Math.abs(distance) > 3000;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      if (shouldSkip && progress > 0.4 && progress < 0.7) {
        // 跳跃区间
        containerRef.current.scrollTop = start + distance * 0.95;
      } else {
        containerRef.current.scrollTop = start + distance * ease;
      }

      if (progress < 1) requestAnimationFrame(step);
      else containerRef.current.scrollTop = end;
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="h-[calc(100vh-88px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row">
        {/* 左侧控制台 */}
        <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 p-5 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
              <AlignLeft size={20} className="text-purple-600" />
              不等高列表
            </h2>
            <p className="text-xs text-gray-500">
              Total: {TOTAL_COUNT} (Dynamic Height)
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Scroll Strategy
            </label>
            <div className="flex flex-col gap-2">
              {Object.values(SCROLL_MODES).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setCurrentMode(mode.id);
                    setLogMsg(null);
                  }}
                  className={`flex items-start gap-3 p-3 rounded-lg text-left transition-all border ${
                    currentMode === mode.id
                      ? "bg-white border-purple-500 shadow-md ring-1 ring-purple-500"
                      : "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <div
                    className={`mt-1 ${
                      currentMode === mode.id
                        ? "text-purple-600"
                        : "text-gray-400"
                    }`}
                  >
                    {mode.icon}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${
                        currentMode === mode.id
                          ? "text-purple-700"
                          : "text-gray-700"
                      }`}
                    >
                      {mode.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                      {mode.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Navigation
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Index..."
                value={jumpIndex}
                onChange={(e) => setJumpIndex(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleScrollTo(jumpIndex)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => handleScrollTo(jumpIndex)}
                className="px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Navigation size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => handleScrollTo("top")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-600 hover:text-purple-600 hover:border-purple-500"
              >
                <ArrowUpCircle size={16} /> Top
              </button>
              <button
                onClick={() => handleScrollTo("bottom")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-600 hover:text-purple-600 hover:border-purple-500"
              >
                <ArrowDownCircle size={16} /> Bottom
              </button>
            </div>
          </div>
        </div>

        {/* 右侧列表 */}
        <div className="flex-1 relative bg-white h-[600px] md:h-auto flex flex-col">
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-none">
            <div className="bg-gray-900/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-mono shadow-lg">
              View: {startIndex} - {endIndex}
            </div>
            {logMsg && (
              <div className="bg-purple-600/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-fade-in-down">
                {logMsg}
              </div>
            )}
          </div>

          <div className="flex-1 p-6 overflow-hidden">
            <div
              ref={containerRef}
              className={`
                relative overflow-auto border border-gray-200 rounded-xl shadow-inner bg-gray-50 custom-scrollbar
                transition-all duration-300 ease-in-out
                ${
                  isBlurring
                    ? "opacity-40 blur-[2px] scale-95"
                    : "opacity-100 blur-0 scale-100"
                }
              `}
              style={{ height: CONTAINER_HEIGHT }}
              onScroll={onScroll}
            >
              <div style={{ height: totalHeight, position: "relative" }}>
                {visibleData.map((item) => {
                  const pos = positions[item.index];
                  return (
                    <ListItem
                      key={item.id}
                      item={item}
                      isTarget={item.index === parseInt(jumpIndex)}
                      style={{
                        position: "absolute",
                        top: pos.top,
                        left: 0,
                        width: "100%",
                      }}
                      onMeasure={measureItem}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 border-t border-purple-100 text-xs text-purple-600 flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            注意观察：跳转到未渲染区域时，列表可能会在加载瞬间轻微抖动，这是因为预估高度(80px)与真实高度不符，触发了修正逻辑。使用
            "Blur" 模式可完美掩盖此现象。
          </div>
        </div>
      </div>
    </div>
  );
}

// 子组件
const ListItem = ({ item, style, onMeasure, isTarget }) => {
  const itemRef = useRef(null);

  useLayoutEffect(() => {
    if (itemRef.current) {
      onMeasure(item.index, itemRef.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      ref={itemRef}
      style={style}
      className={`
        p-4 border-b border-gray-100 flex gap-4 transition-all duration-500
        ${
          isTarget
            ? "bg-purple-100 scale-[1.02] z-10 shadow-sm"
            : `${item.color} hover:bg-purple-50`
        }
      `}
    >
      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
        {item.index}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-800 text-sm mb-1 flex justify-between">
          <span>Dynamic Row #{item.index}</span>
          {isTarget && (
            <span className="text-purple-600 text-xs">🎯 Target</span>
          )}
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
      </div>
    </div>
  );
};
