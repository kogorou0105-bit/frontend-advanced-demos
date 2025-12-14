import React, { useState, useEffect, useRef, useCallback } from "react";

// 1. 模拟图片数据
const ORIGINAL_SLIDES = [
  { id: 1, color: "bg-red-500", text: "Slide 1" },
  { id: 2, color: "bg-blue-500", text: "Slide 2" },
  { id: 3, color: "bg-green-500", text: "Slide 3" },
  { id: 4, color: "bg-yellow-500", text: "Slide 4" },
];

export default function Carousel() {
  // 核心技巧：在首尾各克隆一张，实现视觉上的无缝循环
  // 结构变为：[Clone 4, Real 1, Real 2, Real 3, Real 4, Clone 1]
  const slides = [
    ORIGINAL_SLIDES[ORIGINAL_SLIDES.length - 1], // Clone Last
    ...ORIGINAL_SLIDES,
    ORIGINAL_SLIDES[0], // Clone First
  ];

  // 初始索引设为 1（因为 0 是克隆的最后一张）
  const [currentIndex, setCurrentIndex] = useState(1);
  // 控制是否开启过渡动画（瞬移重置时需要关闭动画）
  const [isTransitioning, setIsTransitioning] = useState(false);
  // 暂停自动播放的状态
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);
  const totalSlides = slides.length;

  // ==========================================
  // 核心逻辑 1: 切换轮播
  // ==========================================
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  // ==========================================
  // 核心逻辑 2: 自动播放与暂停
  // ==========================================
  useEffect(() => {
    // 如果鼠标悬停或页面不可见，暂停定时器
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      // 在 setInterval 闭包中，我们不能直接读取外部的 state (isTransitioning)
      // 但因为我们每 3 秒触发一次，且动画只有 500ms，通常不会冲突。
      // 为了绝对安全，可以通过 Ref 来保存 transitioning 状态，
      // 或者简简单单地调用 nextSlide（因为它内部已经有 check 了，虽然在 interval 里拿到的 state 可能是旧的）

      // *面试满分写法*：这里最好只是触发，真正的锁逻辑在 nextSlide 里。
      // 由于 nextSlide 加了 dependency，useEffect 会重置，这没问题。
      nextSlide();
    }, 3000); // 3秒切换

    // 清理定时器，防止内存泄漏 (面试考点)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // ==========================================
  // 核心逻辑 3: 处理“偷梁换柱” (无缝循环的关键)
  // ==========================================
  const handleTransitionEnd = () => {
    // 动画结束后，检查是否到了边界
    setIsTransitioning(false); // 先关闭动画

    if (currentIndex === totalSlides - 1) {
      // 如果到了最后一张 (Clone 1)，瞬间跳回真实的 Index 1
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      // 如果到了第一张 (Clone 4)，瞬间跳回真实的倒数第二张 (Real 4)
      setCurrentIndex(totalSlides - 2);
    }
  };

  // 辅助函数：直接跳转到某个点（点击下方指示器时）
  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 1); // 加上偏移量 1
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">无缝轮播图 Demo</h1>

      {/* 轮播容器 */}
      <div
        className="relative overflow-hidden rounded-xl shadow-xl aspect-video group"
        onMouseEnter={() => setIsPaused(true)} // 鼠标进入暂停
        onMouseLeave={() => setIsPaused(false)} // 鼠标离开继续
      >
        {/* 滑动轨道 */}
        <div
          className="flex w-full h-full"
          style={{
            // 移动逻辑：每次移动 100% 的宽度
            transform: `translateX(-${currentIndex * 100}%)`,
            // 只有在非瞬移状态下才开启 CSS transition
            transition: isTransitioning
              ? "transform 500ms ease-in-out"
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd} // 监听动画结束
        >
          {slides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`} // 组合 key 避免重复
              className={`min-w-full h-full flex items-center justify-center text-white text-4xl font-bold ${slide.color}`}
            >
              {slide.text}
              {/* 标记一下是克隆的还是真实的，方便调试 */}
              {(index === 0 || index === slides.length - 1) && (
                <span className="text-sm absolute bottom-4">(Clone)</span>
              )}
            </div>
          ))}
        </div>

        {/* 左箭头 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ←
        </button>

        {/* 右箭头 */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          →
        </button>

        {/* 底部指示器 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {ORIGINAL_SLIDES.map((_, index) => {
            // 计算当前真实的高亮索引
            // 因为 currentIndex 包含了 Clone，所以需要转换
            let activeIndex = currentIndex - 1;
            if (currentIndex === 0) activeIndex = ORIGINAL_SLIDES.length - 1;
            if (currentIndex === totalSlides - 1) activeIndex = 0;

            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-gray-500 text-sm">
        提示：鼠标悬停在图片上可暂停轮播
      </p>
    </div>
  );
}
