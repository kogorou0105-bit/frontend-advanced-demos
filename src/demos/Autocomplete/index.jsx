import React, { useState, useEffect } from "react";

// ==========================================
// 加分项 1: 手写 useDebounce Hook
// 作用：只有当 value 变化后过了 delay 时间，才更新 debouncedValue
// ==========================================
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设定一个定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：如果 value 在 delay 结束前又变了，
    // 这里会把上一个定时器清除，重新计时。
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function AutocompleteDemo() {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 使用自定义 Hook，得到“防抖后”的值
  // 意思是：用户狂打字时 debouncedSearchTerm 不会变，停下来 500ms 后才会变
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  useEffect(() => {
    // 如果是空字符串，清空结果，不发请求
    if (!debouncedSearchTerm) {
      setOptions([]);
      return;
    }

    // ==========================================
    // 加分项 2: 解决竞态问题 (Race Condition)
    // ==========================================
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 模拟 API 请求 (用 dummyjson 接口)
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${debouncedSearchTerm}`,
          { signal } // 将 signal 传给 fetch
        );
        const data = await response.json();

        // 只有当组件没有被卸载/请求没有被取消时，才更新状态
        setOptions(data.products || []);
      } catch (error) {
        // 如果是因为被取消而报错，忽略它
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 清理函数：
    // 如果 debouncedSearchTerm 变了（发起了新请求），
    // 这里的 controller.abort() 会取消掉上一次还在路上的请求！
    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm]);

  // ==========================================
  // 加分项 3: 关键词高亮
  // ==========================================
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    // 使用正则拆分，不区分大小写
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 text-black font-bold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">防抖搜索 + 关键词高亮</h1>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入 phone, laptop 等..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 shadow-sm"
        />
        {loading && (
          <div className="absolute right-3 top-3 text-gray-400 text-sm">
            加载中...
          </div>
        )}
      </div>

      <ul className="mt-4 bg-white rounded-lg shadow-lg divide-y divide-gray-100 border border-gray-100">
        {options.map((item) => (
          <li
            key={item.id}
            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="font-medium text-gray-800">
              {/* 调用高亮函数 */}
              {highlightText(item.title, debouncedSearchTerm)}
            </div>
            <div className="text-xs text-gray-500 mt-1 truncate">
              {item.description}
            </div>
          </li>
        ))}
        {options.length === 0 && debouncedSearchTerm && !loading && (
          <li className="p-3 text-gray-400 text-center">无搜索结果</li>
        )}
      </ul>
    </div>
  );
}
