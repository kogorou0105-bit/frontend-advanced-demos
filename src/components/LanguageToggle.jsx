import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    // 简单判断：如果是中文就切英文，否则切中文
    // i18next 的 language 可能会是 'zh-CN'，所以用 startsWith 保险
    const nextLang = currentLang.startsWith("zh") ? "en" : "zh";
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      title="Switch Language / 切换语言"
    >
      <Languages size={20} />
      {/* 如果想显示当前语言文字，可以加一个 span */}
      {/* <span className="ml-2 text-xs font-bold">{i18n.language === 'zh' ? 'EN' : '中'}</span> */}
    </button>
  );
}
