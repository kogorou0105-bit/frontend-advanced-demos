import React, { useState, useRef } from "react";
import { GripVertical } from "lucide-react";

// 模拟初始任务数据
const INITIAL_TASKS = [
  { id: 101, title: "⚛️ 研究 React 并发模式", tag: "Core" },
  { id: 102, title: "🎨 优化 Tailwind 配置", tag: "CSS" },
  { id: 103, title: "⚡ 升级 Vite 到 v6", tag: "Build" },
  { id: 104, title: "🐛 修复虚拟列表滚动 Bug", tag: "Bugfix" },
  { id: 105, title: "📝 撰写技术文档", tag: "Docs" },
];

export default function DragSort() {
  const [items, setItems] = useState(INITIAL_TASKS);

  // 核心技巧：使用 useRef 记录当前拖拽项和目标项的索引
  // 避免将这些中间状态存入 state 导致每次移动都触发全量 render
  const dragItemRef = useRef(null);
  const dragOverItemRef = useRef(null);

  // 1. 开始拖拽
  const handleDragStart = (e, index) => {
    dragItemRef.current = index;
    // 视觉优化：给被拖拽的元素添加一点样式（注意：直接操作 DOM 是为了避免重渲染闪烁）
    e.target.style.opacity = "0.5";
    e.target.style.background = "#f3f4f6";
  };

  // 2. 拖拽经过其他元素 (核心排序逻辑)
  const handleDragEnter = (index) => {
    // 记录当前悬停的元素索引
    dragOverItemRef.current = index;

    // 如果悬停在自己身上，或者没有开始拖拽，忽略
    if (dragItemRef.current === null || dragItemRef.current === index) return;

    // --- 数组重排逻辑 ---
    const newItems = [...items];
    // 取出被拖拽的项
    const draggedItem = newItems[dragItemRef.current];
    // 移除旧位置
    newItems.splice(dragItemRef.current, 1);
    // 插入新位置
    newItems.splice(index, 0, draggedItem);

    // 关键：同步更新 ref 中的索引，确保连续移动时逻辑正确
    dragItemRef.current = index;

    // 更新 React 状态
    setItems(newItems);
  };

  // 3. 拖拽结束
  const handleDragEnd = (e) => {
    // 清理状态
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    // 恢复样式
    e.target.style.opacity = "1";
    e.target.style.background = "white";
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">原生拖拽排序</h1>
      <p className="text-gray-500 text-sm mb-6">
        抛弃 dnd-kit，手写 HTML5 Drag API。实现列表项的实时交换与状态同步。
      </p>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable // 开启 HTML5 拖拽
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={() => handleDragEnter(index)} // 实时交换触发点
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()} // 必须阻止默认行为以允许 Drop
            className="
              flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm
              cursor-grab active:cursor-grabbing transition-transform duration-200
              hover:border-blue-400 hover:shadow-md select-none
            "
          >
            {/* 拖拽把手图标 */}
            <span className="text-gray-400 mr-3 cursor-grab active:cursor-grabbing">
              <GripVertical size={20} />
            </span>

            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{item.title}</h3>
            </div>

            <span className="text-xs font-mono px-2 py-1 bg-gray-100 text-gray-500 rounded">
              {item.tag}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-900 rounded-lg shadow-inner">
        <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">
          Real-time State
        </h4>
        <div className="flex gap-2 flex-wrap">
          {items.map((item) => (
            <span key={item.id} className="text-xs text-blue-300 font-mono">
              {item.id} →
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
