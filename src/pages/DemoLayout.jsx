import { Link } from "react-router-dom";

const DemoLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="h-14 bg-white border-b flex items-center px-4 sticky top-0 z-10 shadow-sm">
        <Link
          to="/"
          className="text-gray-500 hover:text-blue-600 flex items-center text-sm font-medium transition-colors"
        >
          ← 返回列表
        </Link>
        <div className="w-px h-4 bg-gray-300 mx-4"></div>
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      </header>

      {/* Demo 内容区 */}
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">{children}</main>
    </div>
  );
};

export default DemoLayout;
