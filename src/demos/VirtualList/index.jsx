import { useState, useRef } from "react";

// 模拟生成 10万 条数据
const TOTAL_COUNT = 10000;
const ITEM_HEIGHT = 50; // 每项高度固定 50px

const VirtualList = () => {
  const [listData] = useState(Array.from({ length: TOTAL_COUNT }, (_, i) => i));
  const containerRef = useRef(null);

  // 可视区域起始索引
  const [startIndex, setStartIndex] = useState(0);

  // 可视区域能容纳的数量 (假设容器高度 500px, 500/50 = 10，多渲染几个防止空白)
  const VISIBLE_COUNT = 12;

  const containerHeight = 500;

  // 核心1：计算总高度，撑开滚动条
  const totalHeight = listData.length * ITEM_HEIGHT;

  // 核心2：滚动事件监听
  const onScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    // 算出当前卷去了多少个元素
    const currentStartIndex = Math.floor(scrollTop / ITEM_HEIGHT);

    if (currentStartIndex !== startIndex) {
      setStartIndex(currentStartIndex);
    }
  };

  // 核心3：计算可视区域的数据切片
  const endIndex = Math.min(startIndex + VISIBLE_COUNT, listData.length);
  const visibleData = listData.slice(startIndex, endIndex);

  // 核心4：动态计算 translateY 偏移量，让渲染出来的列表始终保持在可视区
  // 也可以用 padding-top 撑开
  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <div className="p-4">
      <div className="mb-4 text-sm text-gray-500">
        当前渲染范围: Index {startIndex} - {endIndex} | DOM节点数:{" "}
        {visibleData.length}
      </div>

      {/* 滚动容器 */}
      <div
        ref={containerRef}
        className="relative overflow-auto border border-gray-300 rounded-lg bg-white shadow-sm"
        style={{ height: containerHeight }}
        onScroll={onScroll}
      >
        {/* 幽灵占位层：负责撑开高度 */}
        <div
          style={{
            height: totalHeight,
            position: "absolute",
            width: "100%",
            zIndex: -1,
          }}
        />

        {/* 真实渲染层：使用 transform 偏移 */}
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleData.map((item) => (
            <div
              key={item}
              className="flex items-center px-4 border-b border-gray-100 hover:bg-blue-50 transition-colors box-border"
              style={{ height: ITEM_HEIGHT }}
            >
              <span className="font-mono font-bold text-blue-600 mr-4">
                #{item}
              </span>
              <span>虚拟列表测试数据 - Row Content {item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
