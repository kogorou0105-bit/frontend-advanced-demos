import React, { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react"; // 假设你用了 lucide-react 图标库，没有的话用文字代替即可

// 1. 模拟嵌套数据 (类似文件夹结构)
const fileSystemData = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "1-1",
        name: "assets",
        type: "folder",
        children: [
          {
            id: "1-1-1",
            name: "images",
            type: "folder",
            children: [
              { id: "1-1-1-1", name: "logo.png", type: "file" },
              { id: "1-1-1-2", name: "bg.jpg", type: "file" },
            ],
          },
          {
            id: "1-1-2",
            name: "icons",
            type: "folder",
            children: [],
          },
        ],
      },
      {
        id: "1-2",
        name: "components",
        type: "folder",
        children: [
          {
            id: "1-2-1",
            name: "Button",
            type: "folder",
            children: [
              { id: "1-2-1-1", name: "index.tsx", type: "file" },
              { id: "1-2-1-2", name: "Button.tsx", type: "file" },
              { id: "1-2-1-3", name: "button.module.css", type: "file" },
              { id: "1-2-1-4", name: "types.ts", type: "file" },
            ],
          },
          {
            id: "1-2-2",
            name: "Modal",
            type: "folder",
            children: [
              { id: "1-2-2-1", name: "index.tsx", type: "file" },
              { id: "1-2-2-2", name: "useModal.ts", type: "file" },
            ],
          },
          {
            id: "1-2-3",
            name: "__tests__",
            type: "folder",
            children: [
              { id: "1-2-3-1", name: "Button.test.tsx", type: "file" },
            ],
          },
        ],
      },
      {
        id: "1-3",
        name: "hooks",
        type: "folder",
        children: [
          { id: "1-3-1", name: "useDebounce.ts", type: "file" },
          { id: "1-3-2", name: "useThrottle.ts", type: "file" },
          {
            id: "1-3-3",
            name: "experimental",
            type: "folder",
            // 故意不给 children，用来测试健壮性
          },
        ],
      },
      {
        id: "1-4",
        name: "pages",
        type: "folder",
        children: [
          {
            id: "1-4-1",
            name: "Home",
            type: "folder",
            children: [
              { id: "1-4-1-1", name: "index.tsx", type: "file" },
              { id: "1-4-1-2", name: "home.css", type: "file" },
            ],
          },
          {
            id: "1-4-2",
            name: "Profile",
            type: "folder",
            children: [
              { id: "1-4-2-1", name: "index.tsx", type: "file" },
              {
                id: "1-4-2-2",
                name: "components",
                type: "folder",
                children: [
                  { id: "1-4-2-2-1", name: "Avatar.tsx", type: "file" },
                  { id: "1-4-2-2-2", name: "EditProfile.tsx", type: "file" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "1-5",
        name: "store",
        type: "folder",
        children: [
          { id: "1-5-1", name: "index.ts", type: "file" },
          { id: "1-5-2", name: "user.slice.ts", type: "file" },
          { id: "1-5-3", name: "settings.slice.ts", type: "file" },
        ],
      },
      {
        id: "1-6",
        name: "utils",
        type: "folder",
        children: [
          { id: "1-6-1", name: "request.ts", type: "file" },
          { id: "1-6-2", name: "storage.ts", type: "file" },
          { id: "1-6-3", name: "format.ts", type: "file" },
        ],
      },
      { id: "1-7", name: "App.tsx", type: "file" },
      { id: "1-8", name: "main.tsx", type: "file" },
      { id: "1-9", name: "index.css", type: "file" },
    ],
  },
  {
    id: "2",
    name: "public",
    type: "folder",
    children: [
      { id: "2-1", name: "favicon.ico", type: "file" },
      { id: "2-2", name: "index.html", type: "file" },
    ],
  },
  {
    id: "3",
    name: "scripts",
    type: "folder",
    children: [
      { id: "3-1", name: "build.js", type: "file" },
      { id: "3-2", name: "deploy.js", type: "file" },
    ],
  },
  {
    id: "4",
    name: ".eslintrc.cjs",
    type: "file",
  },
  {
    id: "5",
    name: ".prettierrc",
    type: "file",
  },
  {
    id: "6",
    name: "package.json",
    type: "file",
  },
  {
    id: "7",
    name: "tsconfig.json",
    type: "file",
  },
  {
    id: "8",
    name: "README.md",
    type: "file",
  },
];

// ==========================================
// 核心组件: 递归节点
// ==========================================
const FileNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  // 缩进控制：每一层级缩进 16px
  const indent = level * 16;

  return (
    <div className="select-none">
      <div
        className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded transition-colors"
        style={{ paddingLeft: `${indent + 8}px` }} // 动态缩进
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {/* 图标区 */}
        <span className="mr-1 text-gray-500">
          {hasChildren ? (
            isOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
          ) : (
            <span className="w-4" /> // 占位，对齐
          )}
        </span>

        <span className="mr-2 text-blue-500">
          {node.type === "folder" ? (
            <Folder size={16} />
          ) : (
            <FileText size={16} className="text-gray-400" />
          )}
        </span>

        <span className="text-sm text-gray-700">{node.name}</span>
      </div>

      {/* 递归渲染区：如果有孩子，且当前是展开状态，就渲染孩子 */}
      {hasChildren && isOpen && (
        <div>
          {node.children.map((childNode) => (
            // 关键点：组件自己调用自己，并将 level + 1
            <FileNode key={childNode.id} node={childNode} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TreeViewDemo() {
  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">递归文件树 Demo</h1>
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        {fileSystemData.map((node) => (
          <FileNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
