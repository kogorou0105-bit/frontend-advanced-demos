import React, { useState, useRef, useEffect } from "react";
// 1. 引入新图标
import {
  Bold,
  Italic,
  Underline,
  List,
  Type,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { formatHTML } from "@/lib/utils.js";

const ToolbarButton = ({ onClick, isActive, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
      isActive ? "bg-gray-200 text-blue-600" : "text-gray-600"
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor() {
  const editorRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState("<p><br/></p>");
  const [activeFormats, setActiveFormats] = useState({});

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "<p><br/></p>";
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
      checkActiveFormats();
    }
  };

  const execCommand = (command, value = null) => {
    // @ts-ignore
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      checkActiveFormats();
      handleInput();
    }
  };

  const toggleCodeBlock = () => {
    if (activeFormats.block === "pre") {
      execCommand("formatBlock", "P");
    } else {
      execCommand("formatBlock", "PRE");
    }
  };

  // 2. 新增：插入链接
  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  // 3. 新增：插入图片
  const addImage = () => {
    const url = window.prompt("Enter Image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const checkActiveFormats = () => {
    const formats = {};
    // @ts-ignore
    if (document.queryCommandState("bold")) formats.bold = true;
    // @ts-ignore
    if (document.queryCommandState("italic")) formats.italic = true;
    // @ts-ignore
    if (document.queryCommandState("underline")) formats.underline = true;
    // @ts-ignore
    if (document.queryCommandState("insertUnorderedList")) formats.list = true;
    // @ts-ignore
    const blockValue = document.queryCommandValue("formatBlock");
    formats.block = blockValue ? blockValue.toLowerCase() : "";

    setActiveFormats(formats);
  };

  useEffect(() => {
    const handleSelectionChange = () => checkActiveFormats();
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* 工具栏 */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50 flex-wrap">
          {/* 撤销/重做组 */}
          <ToolbarButton
            onClick={() => execCommand("undo")}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => execCommand("redo")}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={18} />
          </ToolbarButton>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <ToolbarButton
            onClick={() => execCommand("formatBlock", "H2")}
            isActive={activeFormats.block === "h2"}
            title="Heading"
          >
            <Type size={18} />
          </ToolbarButton>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <ToolbarButton
            onClick={() => execCommand("bold")}
            isActive={activeFormats.bold}
            title="Bold"
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => execCommand("italic")}
            isActive={activeFormats.italic}
            title="Italic"
          >
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => execCommand("underline")}
            isActive={activeFormats.underline}
            title="Underline"
          >
            <Underline size={18} />
          </ToolbarButton>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <ToolbarButton
            onClick={() => execCommand("insertUnorderedList")}
            isActive={activeFormats.list}
            title="List"
          >
            <List size={18} />
          </ToolbarButton>

          <ToolbarButton
            onClick={toggleCodeBlock}
            isActive={activeFormats.block === "pre"}
            title="Code Block"
          >
            <Code size={18} />
          </ToolbarButton>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* 插入对象组 */}
          <ToolbarButton onClick={addLink} title="Insert Link">
            <LinkIcon size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Insert Image">
            <ImageIcon size={18} />
          </ToolbarButton>
        </div>

        {/* 编辑区域 */}
        <div
          ref={editorRef}
          // 增加 [&_a]:text-blue-600 [&_a]:underline 样式让链接显色
          // 增加 [&_img]:max-w-full [&_img]:rounded-lg 样式让图片自适应
          className="p-6 min-h-[300px] outline-none max-w-none rich-editor-content [&_a]:text-blue-600 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4"
          contentEditable
          onInput={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              execCommand("insertText", "    ");
            }
            if (e.key === "Enter" && activeFormats.block === "pre") {
              if (e.shiftKey) return;
              e.preventDefault();
              execCommand("insertText", "\n");
            }
          }}
          suppressContentEditableWarning
        />
      </div>

      {/* HTML 预览区域 */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-inner text-gray-300 font-mono text-sm overflow-x-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-500 uppercase text-xs font-bold tracking-wider">
            HTML Output (Formatted)
          </div>
          <div className="text-xs text-gray-600">
            {htmlContent.length} chars
          </div>
        </div>
        <div className="whitespace-pre">{formatHTML(htmlContent)}</div>
      </div>
    </div>
  );
}
