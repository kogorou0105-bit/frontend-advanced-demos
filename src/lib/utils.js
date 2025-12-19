export const formatHTML = (html) => {
  if (!html) return "";

  // 1. 定义块级元素（只有这些标签会触发换行和缩进）
  const blockTags = new Set([
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "dd",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "li",
    "main",
    "nav",
    "noscript",
    "ol",
    "p",
    "pre",
    "section",
    "table",
    "tfoot",
    "ul",
    "video",
    "body",
    "html",
    "head",
  ]);

  const tab = "  "; // 缩进单位
  let result = "";
  let indent = 0;

  // 辅助函数：检查是否为块级标签
  const isBlock = (str) => {
    // 提取标签名，例如 "<div class='...'>" -> "div"
    const match = str.match(/^<\/?([a-z0-9]+)/i);
    return match && blockTags.has(match[1].toLowerCase());
  };

  // 2. 预处理：
  //    去掉标签之间多余的空白(>\s+<)，但保留标签内的属性空格
  const cleanHtml = html.replace(/>\s+</g, "><").trim();

  // 3. 拆分：按标签拆分，保留标签本身
  //    例如: "<p>text</p>" -> ["<p>", "text", "</p>"]
  const parts = cleanHtml.split(/(<[^>]+>)/g).filter(Boolean);

  parts.forEach((part, index) => {
    // 获取上一个 token，用于判断是否需要换行
    const prev = parts[index - 1];

    // A. 闭合标签 (</...>)
    if (part.match(/^<\//)) {
      if (isBlock(part)) {
        indent = Math.max(0, indent - 1); // 块级闭合，减少缩进
        // 如果上一个元素也是块级(闭合或自闭合)，说明内容换行了，这个闭合标签也要换行
        // 例如: <div><p>...</p></div> -> </div> 需要换行
        // 但如果是 <p>text</p> -> </p> 不需要换行
        if (prev && (isBlock(prev) || prev.match(/>$/))) {
          // 这里做一个简单判断：如果上一个是闭合标签，或者上一个是块级开始标签但被换行了，
          // 为了简化，通常规则是：如果在这个块里我们曾经换行过，那闭合时也要换行。
          // 简单策略：只要上一个不是纯文本，且是块级相关的，就换行。
          // 更简单的视觉策略：如果上一个 token 是 闭合的块级标签 (</div>, </p>)，则换行。
          if (prev.match(/^<\//) && isBlock(prev)) {
            result += "\n" + tab.repeat(indent) + part;
          } else {
            // 上一个是文本或行内标签，直接跟在后面
            result += part;
          }
        } else {
          result += part;
        }
      } else {
        // 行内标签闭合 (</u>, </span>)，直接拼接
        result += part;
      }
    }

    // B. 开始标签 (<...>) 或 自闭合 (<br/>)
    else if (part.match(/^<[^]/)) {
      if (isBlock(part)) {
        // 块级元素：先换行(除非是第一个)，再输出
        if (result.length > 0) result += "\n";
        result += tab.repeat(indent) + part;

        // 如果不是自闭合标签(<img/>, <hr>, <br>)，则增加缩进
        // 注意：HTML5 中 <br> <hr> <img> 等通常没有 /
        const isSelfClosing =
          part.match(/\/>$/) || part.match(/^<(br|hr|img|input|meta|link)/i);
        if (!isSelfClosing) {
          indent++;
        }
      } else {
        // 行内元素 (<b>, <span>, <u>)：直接拼接，不换行
        result += part;
      }
    }

    // C. 文本内容
    else {
      result += part;
    }
  });

  return result.trim();
};
