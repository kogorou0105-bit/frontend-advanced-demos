import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DemoLayout from "./pages/DemoLayout";
import { demos } from "./demos";

function App() {
  return (
    // 使用 Suspense 处理懒加载时的 Loading 状态
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-400">Loading Demo...</div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 遍历配置表生成路由 */}
        {demos.map((demo) => {
          const Component = demo.component;
          return (
            <Route
              key={demo.path}
              path={`/demo/${demo.path}`}
              element={
                <DemoLayout title={demo.title}>
                  <Component />
                </DemoLayout>
              }
            />
          );
        })}

        {/* 404 跳转 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
