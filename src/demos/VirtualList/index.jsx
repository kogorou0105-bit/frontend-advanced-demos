import { useState, useRef } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Navigation,
  Settings,
  Activity,
  Zap,
  EyeOff,
  BrainCircuit, // 新增一个图标代表智能模式
} from "lucide-react";

// --- 配置常量 ---
const TOTAL_COUNT = 10000;
const ITEM_HEIGHT = 50;
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
    desc: "强制原生平滑 (仅作对比)",
    icon: <Activity size={16} />,
  },
  BLUR: {
    id: "blur",
    name: "Blur & Teleport",
    desc: "强制模糊瞬移 (赛博风格)",
    icon: <EyeOff size={16} />,
  },
  FLASH: {
    id: "flash",
    name: "Flash Skip",
    desc: "分段加速动画 (iOS风格)",
    icon: <Zap size={16} />,
  },
};

const VirtualList = () => {
  // 数据与状态
  const [listData] = useState(Array.from({ length: TOTAL_COUNT }, (_, i) => i));
  const [startIndex, setStartIndex] = useState(0);
  const [jumpIndex, setJumpIndex] = useState("");

  // 默认使用 SMART 模式
  const [currentMode, setCurrentMode] = useState(SCROLL_MODES.SMART.id);
  const [isBlurring, setIsBlurring] = useState(false);
  const [logMsg, setLogMsg] = useState(null); // 用于展示触发了什么逻辑

  const containerRef = useRef(null);

  // 虚拟滚动计算
  const VISIBLE_COUNT = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 4;
  const totalHeight = listData.length * ITEM_HEIGHT;
  const endIndex = Math.min(startIndex + VISIBLE_COUNT, listData.length);
  const visibleData = listData.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;

  const onScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const currentStartIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    if (currentStartIndex !== startIndex) {
      setStartIndex(currentStartIndex);
    }
  };

  // --- 核心：策略分发器 ---
  const handleScrollTo = (target) => {
    if (!containerRef.current) return;

    // 1. 解析目标 Index
    let targetIndex = 0;
    if (target === "top") targetIndex = 0;
    else if (target === "bottom") targetIndex = listData.length - 1;
    else targetIndex = parseInt(target, 10);

    if (isNaN(targetIndex)) return;
    targetIndex = Math.max(0, Math.min(targetIndex, listData.length - 1));

    const targetScrollTop = targetIndex * ITEM_HEIGHT;
    const startScrollTop = containerRef.current.scrollTop;
    const distance = targetScrollTop - startScrollTop;

    // 获取当前的索引位置
    const currentIndex = Math.floor(startScrollTop / ITEM_HEIGHT);
    const indexDiff = Math.abs(targetIndex - currentIndex);

    // 2. 根据模式执行不同策略
    switch (currentMode) {
      case SCROLL_MODES.SMART.id:
        // --- 智能混合逻辑 ---
        if (indexDiff <= 100) {
          setLogMsg(`距离 ${indexDiff} 行 (≤100) -> 触发平滑滚动`);
          executeNativeScroll(targetScrollTop);
        } else {
          setLogMsg(`距离 ${indexDiff} 行 (>100) -> 触发模糊瞬移`);
          executeBlurScroll(targetScrollTop);
        }
        break;

      case SCROLL_MODES.NATIVE.id:
        setLogMsg("强制原生平滑滚动");
        executeNativeScroll(targetScrollTop);
        break;

      case SCROLL_MODES.BLUR.id:
        setLogMsg("强制模糊瞬移");
        executeBlurScroll(targetScrollTop);
        break;

      case SCROLL_MODES.FLASH.id:
        setLogMsg("触发分段帧动画");
        executeFlashScroll(startScrollTop, targetScrollTop, distance);
        break;

      default:
        containerRef.current.scrollTop = targetScrollTop;
    }
  };

  // --- 策略实现 ---

  const executeNativeScroll = (targetTop) => {
    containerRef.current.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  };

  const executeBlurScroll = async (targetTop) => {
    setIsBlurring(true);
    await new Promise((r) => setTimeout(r, 200));
    containerRef.current.scrollTop = targetTop;
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsBlurring(false);
      }, 50);
    });
  };

  const executeFlashScroll = (start, end, distance) => {
    const startTime = performance.now();
    const duration = 800;
    const shouldSkipFrames = Math.abs(distance) > 5000;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      if (shouldSkipFrames) {
        if (progress > 0.4 && progress < 0.7) {
          const virtualPos = start + distance * 0.9;
          containerRef.current.scrollTop = virtualPos;
        } else {
          containerRef.current.scrollTop = start + distance * ease;
        }
      } else {
        containerRef.current.scrollTop = start + distance * ease;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        containerRef.current.scrollTop = end;
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="h-[calc(100vh-88px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row">
        {/* --- 左侧：设置面板 --- */}
        <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 p-5 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
              <Settings size={20} className="text-gray-600" />
              控制台
            </h2>
            <p className="text-xs text-gray-500">
              Total: {TOTAL_COUNT.toLocaleString()} Items
            </p>
          </div>

          {/* 模式选择器 */}
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
                      ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div
                    className={`mt-1 ${
                      currentMode === mode.id
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {mode.icon}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${
                        currentMode === mode.id
                          ? "text-blue-700"
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

          {/* 跳转控制 */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Navigation
            </label>

            <div className="flex flex-col gap-2">
              <div className="text-[10px] text-gray-400 mb-1">
                尝试输入当前 Index ±50 和 ±500 的值体验区别
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Target Index..."
                  value={jumpIndex}
                  onChange={(e) => setJumpIndex(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleScrollTo(jumpIndex)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleScrollTo(jumpIndex)}
                  className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Navigation size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => handleScrollTo("top")}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-600 hover:text-blue-600 hover:border-blue-500"
                >
                  <ArrowUpCircle size={16} /> Top
                </button>
                <button
                  onClick={() => handleScrollTo("bottom")}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-600 hover:text-blue-600 hover:border-blue-500"
                >
                  <ArrowDownCircle size={16} /> Bottom
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- 右侧：列表视图 --- */}
        <div className="flex-1 relative bg-white h-[600px] md:h-auto flex flex-col">
          {/* 浮动状态条 */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-none">
            <div className="bg-gray-900/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-mono shadow-lg">
              View: {startIndex} - {endIndex}
            </div>
            {logMsg && (
              <div className="bg-blue-600/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-fade-in-down">
                {logMsg}
              </div>
            )}
          </div>

          <div className="flex-1 p-6 overflow-hidden">
            <div
              ref={containerRef}
              onScroll={onScroll}
              style={{ height: CONTAINER_HEIGHT }}
              className={`
                relative overflow-auto border border-gray-200 rounded-xl shadow-inner bg-gray-50
                transition-all duration-300 ease-in-out custom-scrollbar
                ${
                  isBlurring
                    ? "opacity-40 blur-[2px] scale-95"
                    : "opacity-100 blur-0 scale-100"
                }
              `}
            >
              <div
                style={{
                  height: totalHeight,
                  position: "absolute",
                  width: "100%",
                  zIndex: -1,
                }}
              />

              <div style={{ transform: `translateY(${offsetY}px)` }}>
                {visibleData.map((item) => (
                  <div
                    key={item}
                    className={`
                      flex items-center px-6 h-[50px] border-b border-gray-200 transition-colors
                      ${
                        item === parseInt(jumpIndex)
                          ? "bg-blue-100"
                          : "bg-white hover:bg-blue-50"
                      }
                    `}
                  >
                    <span className="w-16 font-mono text-gray-400 font-bold">
                      #{item}
                    </span>
                    <span className="text-sm text-gray-700">
                      {item === parseInt(jumpIndex)
                        ? "🎯 Target Item Found"
                        : "Virtual List Item"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
