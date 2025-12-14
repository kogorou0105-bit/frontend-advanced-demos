import React, { useState, useEffect, useRef } from "react";

// ==========================================
// 1. 可复用的懒加载图片组件 LazyImage
// ==========================================
export default function LazyImage({
  src,
  alt,
  className,
  aspectRatio = "56.25%",
}) {
  // isVisible: 控制是否开始请求图片资源 (进入视口后变为 true)
  const [isVisible, setIsVisible] = useState(false);
  // isLoaded: 控制图片是否下载完毕 (onLoad 触发后变为 true)
  const [isLoaded, setIsLoaded] = useState(false);

  const imgRef = useRef(null);

  useEffect(() => {
    // 如果已经开始加载了，就不需要观察了
    if (isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 当图片容器进入视口时
        if (entries[0].isIntersecting) {
          // 1. 设置为可见，触发 img 标签渲染 src 属性，浏览器开始下载图片
          setIsVisible(true);
          // 2. 停止观察，节约性能
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // 提前 100px 开始加载，体验更好
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [isVisible]);

  // 处理图片加载完成的事件
  const handleImageLoad = () => {
    // 图片下载完了，设置状态为 true，触发 CSS transition 动画变清晰
    setIsLoaded(true);
  };

  return (
    // 外层容器：负责占位和背景色
    // 使用 padding-bottom hack 来防止图片加载导致的高度坍塌 (累计布局偏移 CLS)
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}
      style={{ paddingBottom: aspectRatio }} // 设置宽高比占位
    >
      {/* 占位骨架屏动画
        当图片还没加载完时显示一个闪烁的动画，加载完后隐藏
      */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse z-10"></div>
      )}

      {/* 只有进入视口才渲染 img 标签 */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad} // 关键：监听图片网络请求完成
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out
            ${
              isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
            } // Tailwind 控制透明度和模糊
          `}
        />
      )}
    </div>
  );
}
