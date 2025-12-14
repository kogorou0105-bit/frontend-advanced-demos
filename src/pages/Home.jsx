import { Link } from "react-router-dom";
import { demos } from "../demos";

const Home = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
          Frontend Lab
        </h1>
        <p className="text-slate-500">React 前端难点与实验性功能展示仓库</p>
      </div>

      <div className="grid gap-4">
        {demos.map((demo) => (
          <Link
            key={demo.path}
            to={`/demo/${demo.path}`}
            className="block group"
          >
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600">
                  {demo.title}
                </h2>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  /{demo.path}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {demo.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
