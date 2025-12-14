import LazyImage from "./LazyImage";
// ==========================================
// 2. 主页面 Demo
// ==========================================
// 生成一些高质量随机图片用于测试
const mockImages = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  // 使用 picsum 获取不同尺寸的图片，更容易看出加载效果
  src: `https://picsum.photos/seed/${i + 100}/800/600`,
  desc: `Photo by Picsum ${i + 1}`,
}));

export default function LazyImageDemo() {
  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">图片懒加载 + 渐变过渡 Demo</h1>
      <p className="mb-8 text-gray-600">
        向下滚动查看效果。图片进入视口前显示骨架屏，进入后开始请求，加载完成后平滑过渡显示。
        <br />
        (建议在 Chrome DevTools 的 Network 中开启 "Slow 3G"
        模拟慢网速来观察明显效果)
      </p>

      <div className="space-y-12">
        {/* 为了让页面足够长，先放一些占位文本 */}
        <div className="h-64 bg-blue-50 rounded p-4 mb-8 flex items-center justify-center text-blue-800 font-medium">
          ↓ 向下滚动开始加载图片 ↓
        </div>
        <div className="space-y-4">
          {mockImages.map((img) => (
            <div
              key={img.id}
              className="bg-white p-4 shadow-sm rounded-xl border border-gray-100"
            >
              {/* 使用封装好的 LazyImage 组件 */}
              <LazyImage
                src={img.src}
                alt={img.desc}
                // 传入宽高比，防止布局抖动 (CLS)
                aspectRatio="75%" // 800x600 -> 3:4 -> 75%
              />
              <p className="mt-3 text-sm text-gray-500">{img.desc}</p>
            </div>
          ))}

          <div className="h-32 bg-gray-50 rounded p-4 flex items-center justify-center text-gray-400">
            到底了
          </div>
        </div>
      </div>
    </div>
  );
}
