import { Link } from "react-router-dom";
import { demos } from "../demos";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 relative min-h-screen">
      {/* 顶部工具栏：调整了位置，使其在宽屏下更协调 */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* 标题区域：增加了底部间距 */}
      <div className="text-center mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
          {t("app.title")}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {t("app.subtitle")}
        </p>
      </div>

      {/* 核心修改：Grid 布局 
         1. grid-cols-1: 手机端 1 列
         2. md:grid-cols-2: 平板及以上 2 列 (8个demo正好4行)
         3. gap-6: 增加间距，减少拥挤感
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {demos.map((demo) => (
          <Link
            key={demo.path}
            to={`/demo/${demo.path}`}
            className="block group h-full" // 关键：h-full 确保 Link 撑满格子高度
          >
            <div
              className="
                h-full flex flex-col p-6 rounded-2xl transition-all duration-300
                bg-white dark:bg-slate-800 
                border border-gray-200 dark:border-slate-700
                shadow-sm hover:shadow-xl hover:shadow-blue-500/10 
                hover:border-blue-500 dark:hover:border-blue-400
                hover:-translate-y-1
              "
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                  {t(demo.title)}
                </h2>
                {/* 路径标签：稍微调小了一点，加了 shrink-0 防止被标题挤压 */}
                <span className="shrink-0 text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded ml-3">
                  /{demo.path}
                </span>
              </div>

              {/* 描述文字：flex-1 会自动占据剩余空间，保证卡片底部对齐 */}
              <p className="flex-1 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {t(demo.description)}
              </p>

              {/* 装饰性箭头（可选）：增加“去这里”的暗示 */}
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                Try Demo →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
