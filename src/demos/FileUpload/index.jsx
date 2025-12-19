import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  X,
  Play,
  Pause,
  CheckCircle,
  Video,
  Image as ImageIcon,
  FileText,
  Monitor,
  Info,
  Server,
  Database,
} from "lucide-react";

const CHUNK_SIZE = 50 * 1024; // 50KB

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState("other");
  const [chunks, setChunks] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [_isPaused, setIsPaused] = useState(false);
  const [mediaDimensions, setMediaDimensions] = useState(null);

  const abortRef = useRef(false);

  // --- 工具函数 ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    resetState();
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setFileType("image");
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else if (selectedFile.type.startsWith("video/")) {
      setFileType("video");
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFileType("other");
    }
  };

  const createFileChunks = (file, size = CHUNK_SIZE) => {
    const fileChunks = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunks.push({
        index: fileChunks.length,
        file: file.slice(cur, cur + size),
        uploaded: false,
      });
      cur += size;
    }
    return fileChunks;
  };

  const mockUploadRequest = (chunk) => {
    return new Promise((resolve, reject) => {
      // 模拟网络抖动
      const isFastNetwork = Math.random() > 0.1;
      const delay = isFastNetwork
        ? Math.random() * 80 + 20
        : Math.random() * 300 + 200;

      setTimeout(() => {
        if (abortRef.current) {
          reject("paused");
        } else {
          resolve(chunk.index);
        }
      }, delay);
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setIsPaused(false);
    abortRef.current = false;

    let currentChunks = chunks;
    if (currentChunks.length === 0) {
      currentChunks = createFileChunks(file);
      setChunks(currentChunks);
    }

    const pendingChunks = currentChunks.filter((c) => !c.uploaded);

    try {
      for (const chunk of pendingChunks) {
        if (abortRef.current) break;
        await mockUploadRequest(chunk);
        setChunks((prev) => {
          const newChunks = [...prev];
          newChunks[chunk.index] = {
            ...newChunks[chunk.index],
            uploaded: true,
          };
          return newChunks;
        });
      }
    } catch {
      console.log("Upload paused");
    } finally {
      if (!abortRef.current) setIsUploading(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsUploading(false);
    abortRef.current = true;
  };

  const handleMediaLoad = (e) => {
    const target = e.target;
    const width = target.videoWidth || target.naturalWidth;
    const height = target.videoHeight || target.naturalHeight;
    if (width && height) {
      setMediaDimensions(`${width} × ${height}`);
    }
  };

  useEffect(() => {
    if (chunks.length === 0) return;
    const uploadedCount = chunks.filter((c) => c.uploaded).length;
    const progress = Math.ceil((uploadedCount / chunks.length) * 100);
    setUploadProgress(progress);
  }, [chunks]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetState = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileType("other");
    setChunks([]);
    setUploadProgress(0);
    setIsUploading(false);
    setIsPaused(false);
    setMediaDimensions(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 h-[calc(100vh-88px)]">
      <header className="mb-4 flex justify-center items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
            文件传输控制台
            <span className="text-xs font-mono font-normal text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            大文件分片并行上传演示 / 实时监控 / 自适应预览
          </p>
        </div>
      </header>

      <div className="lg:grid-cols-12 gap-6 max-h-[600px]">
        <div className="lg:col-span-5 flex gap-4">
          {/* 1. 拖拽上传区 */}
          {!file && (
            <div className="w-[600px] h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 text-center bg-gray-50 dark:bg-gray-800 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer relative group flex flex-col items-center justify-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                点击或拖拽文件上传
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                支持超大视频、高清图片
              </p>
            </div>
          )}
          {/* 2. 文件信息卡片 */}
          {file && (
            <div className="w-[600px] h-[300px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0 text-blue-600 border border-blue-100 dark:border-blue-800">
                  {fileType === "video" ? (
                    <Video size={32} />
                  ) : fileType === "image" ? (
                    <ImageIcon size={32} />
                  ) : (
                    <FileText size={32} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight break-all">
                        {file.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-mono">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Database size={12} />
                          {chunks.length} Chunks
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={resetState}
                      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300">
                  <span>
                    {isUploading
                      ? "传输中..."
                      : uploadProgress === 100
                      ? "传输完成"
                      : "就绪"}
                  </span>
                  <span className="font-mono text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div
                    className={`h-full transition-all duration-300 ease-out shadow-sm relative overflow-hidden ${
                      uploadProgress === 100 ? "bg-green-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] skew-x-[-20deg]" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {uploadProgress < 100 ? (
                  !isUploading ? (
                    <button
                      onClick={handleUpload}
                      className="col-span-2 flex justify-center items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Play size={20} fill="currentColor" />
                      {uploadProgress > 0 ? "继续上传" : "开始极速上传"}
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="col-span-2 flex justify-center items-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Pause size={20} fill="currentColor" />
                      暂停上传
                    </button>
                  )
                ) : (
                  <div className="col-span-2 flex justify-center items-center gap-2 px-6 py-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-base font-bold border border-green-200 dark:border-green-800">
                    <CheckCircle size={24} />
                    校验完成
                  </div>
                )}
              </div>
            </div>
          )}
          {/* 3. 切片地图 (保持 flex-1 撑满高度 + 滚动) */}
          <div className="flex-1 h-[300px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-3 flex-shrink-0">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Server size={14} />
                Chunk Map
              </h4>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {chunks.filter((c) => c.uploaded).length} / {chunks.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(10px,1fr))] gap-1">
                {chunks.map((chunk) => (
                  <div
                    key={chunk.index}
                    title={`Chunk #${chunk.index}`}
                    className={`aspect-square rounded-[2px] transition-colors duration-200 ${
                      chunk.uploaded
                        ? "bg-green-500"
                        : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 h-full flex flex-col items-center justify-center p-4 relative mt-10">
          {previewUrl ? (
            <div className="relative shadow-2xl rounded-lg overflow-hidden bg-black max-w-full border border-gray-800">
              {/* 悬浮分辨率标签 (加回这里) */}
              {mediaDimensions && (
                <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-black/70 backdrop-blur-md rounded text-[10px] text-white/90 font-mono flex items-center gap-1 border border-white/10 shadow-lg">
                  <Info size={10} />
                  {mediaDimensions}
                </div>
              )}

              {fileType === "video" ? (
                <video
                  src={previewUrl}
                  controls
                  className="max-h-[calc(100vh-140px)] w-auto max-w-full block"
                  onLoadedMetadata={handleMediaLoad}
                />
              ) : fileType === "image" ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[calc(100vh-140px)] w-auto max-w-full block object-contain"
                  onLoad={handleMediaLoad}
                />
              ) : (
                <div className="w-96 h-64 flex flex-col items-center justify-center text-gray-500 bg-white dark:bg-gray-800">
                  <FileText size={64} className="mb-4 opacity-30" />
                  <p>不支持预览</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 opacity-50">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
                <Monitor size={48} className="opacity-40" />
              </div>
              <p className="text-lg font-medium">等待文件输入...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
