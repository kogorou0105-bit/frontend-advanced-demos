import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle"; // 引入组件
import { useTranslation } from "react-i18next"; // 引入 Hook
import LanguageToggle from "../components/LanguageToggle"; // 引入组件

const DemoLayout = ({ title, children }) => {
  const { t } = useTranslation(); // 获取 t 函数
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="h-14 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center px-4 sticky top-0 z-10 shadow-sm justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 flex items-center text-sm font-medium transition-colors"
          >
            ← {t("nav.back")}
          </Link>
          <div className="w-px h-4 bg-gray-300 dark:bg-slate-700 mx-4"></div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {t(title)}
          </h1>
        </div>

        {/*在此处放置按钮*/}
        <div>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full dark:text-gray-200">
        {children}
      </main>
    </div>
  );
};

export default DemoLayout;
