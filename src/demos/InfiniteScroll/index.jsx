import React, { useState, useRef, useCallback, useEffect } from "react";

// 1. 模拟一个 API 请求
const mockFetchData = (page) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 每次返回 10 条数据
      const newItems = Array.from({ length: 10 }, (_, index) => ({
        id: (page - 1) * 10 + index + 1,
        title: `Item ${(page - 1) * 10 + index + 1}`,
        desc: "这是一条模拟的面试数据内容...",
        color: `hsl(${Math.random() * 360}, 70%, 80%)`, // 随机颜色
      }));

      // 模拟总共只有 5 页数据
      resolve({
        data: newItems,
        hasMore: page < 5,
      });
    }, 1000); // 1秒延迟模拟网络
  });
};

export default function InfiniteScrollDemo() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // useRef 用于存储 observer 实例，保证跨渲染周期存在
  const observer = useRef();

  // 2. 核心：最后一个元素的 Ref 回调
  // 使用 useCallback 是为了当 dependencies 变化时，重新绑定 ref
  const lastElementRef = useCallback(
    (node) => {
      // 如果正在加载，或者没有更多数据了，就不监听
      if (loading) return;

      // 如果之前的 observer 还在，先断开，避免重复监听
      if (observer.current) observer.current.disconnect();

      // 创建新的 observer
      observer.current = new IntersectionObserver((entries) => {
        // entries[0] 就是我们要监听的那个 DOM 节点
        if (entries[0].isIntersecting && hasMore) {
          console.log("触底了，加载下一页...");
          setPage((prevPage) => prevPage + 1);
        }
      });

      // 如果 node 存在，就开始观察
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 3. 数据获取逻辑
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      const res = await mockFetchData(page);

      setItems((prev) => [...prev, ...res.data]);
      setHasMore(res.hasMore);
      setLoading(false);
    };

    loadItems();
  }, [page]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">无限加载 Demo</h1>

      <div className="space-y-4">
        {items.map((item, index) => {
          // 判断是否是最后一个元素
          if (items.length === index + 1) {
            return (
              <div
                ref={lastElementRef} // 只有最后一个元素绑定 ref
                key={item.id}
                className="p-6 rounded-lg shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: item.color }}
              >
                <h2 className="text-xl font-bold">
                  {item.title} (最后一条-观察点)
                </h2>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            );
          } else {
            return (
              <div
                key={item.id}
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            );
          }
        })}
      </div>

      {/* Loading 状态展示 */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      )}

      {/* 没有更多数据 */}
      {!hasMore && (
        <div className="text-center p-4 text-gray-400">
          --- 我是有底线的 ---
        </div>
      )}
    </div>
  );
}
