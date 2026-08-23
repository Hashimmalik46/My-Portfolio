import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Image as ImageIcon,
  FileText,
  UploadCloud,
  Loader2,
  Trash2,
  FileDown,
  Layers,
  Scissors,
  FilePlus2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  loadImageFromFile,
  compressAndConvertImage,
  formatBytes,
  compileImagesToPdf,
  mergePdfFiles,
  splitPdfFile,
  getPdfPageCount,
} from "../services/imageProcessor";

export default function OmniMediaStudio() {
  const [activeTab, setActiveTab] = useState("image"); // 'image' | 'doc'

  // =========================================================================
  // 1. IMAGE COMPRESSOR & CONVERTER STATE (100% CLIENT-SIDE)
  // =========================================================================
  const [compressorFiles, setCompressorFiles] = useState([]);
  const [activeCompressorIdx, setActiveCompressorIdx] = useState(0);
  const [targetFormat, setTargetFormat] = useState("image/jpeg");
  const [imageQuality, setImageQuality] = useState(82); // 10 - 100
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [compressedResult, setCompressedResult] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const compressorInputRef = useRef(null);

  const currentCompressorItem = compressorFiles[activeCompressorIdx] || null;

  useEffect(() => {
    if (!currentCompressorItem) {
      setCompressedResult(null);
      return;
    }

    let isMounted = true;
    const process = async () => {
      setIsProcessingImage(true);
      try {
        const width = targetWidth > 0 ? targetWidth : currentCompressorItem.width;
        const height = targetHeight > 0 ? targetHeight : currentCompressorItem.height;

        const res = await compressAndConvertImage(currentCompressorItem.img, {
          format: targetFormat,
          quality: imageQuality / 100,
          width,
          height,
        });

        if (isMounted) {
          setCompressedResult(res);
        }
      } catch (err) {
        console.error("Compression error:", err);
      } finally {
        if (isMounted) setIsProcessingImage(false);
      }
    };

    const timer = setTimeout(process, 80);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentCompressorItem, targetFormat, imageQuality, targetWidth, targetHeight]);

  const handleCompressorUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const loaded = await Promise.all(files.map((file) => loadImageFromFile(file)));
      setCompressorFiles((prev) => [...prev, ...loaded]);
      if (compressorFiles.length === 0 && loaded.length > 0) {
        setActiveCompressorIdx(0);
        setTargetWidth(loaded[0].width);
        setTargetHeight(loaded[0].height);
      }
    } catch (err) {
      console.error("Failed to load image:", err);
    }
  };

  const handleWidthChange = (w) => {
    setTargetWidth(w);
    if (lockAspectRatio && currentCompressorItem && currentCompressorItem.width > 0) {
      const ratio = currentCompressorItem.height / currentCompressorItem.width;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h) => {
    setTargetHeight(h);
    if (lockAspectRatio && currentCompressorItem && currentCompressorItem.height > 0) {
      const ratio = currentCompressorItem.width / currentCompressorItem.height;
      setTargetWidth(Math.round(h * ratio));
    }
  };

  const handleDownloadCompressed = () => {
    if (!compressedResult || !currentCompressorItem) return;
    const ext =
      targetFormat === "image/webp"
        ? "webp"
        : targetFormat === "image/jpeg"
        ? "jpg"
        : targetFormat === "image/png"
        ? "png"
        : "bin";

    const a = document.createElement("a");
    const href = URL.createObjectURL(compressedResult.blob);
    a.href = href;
    a.download = `${currentCompressorItem.name}_converted.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(href), 30000);
  };

  // =========================================================================
  // 2. PDF DOCUMENT STUDIO STATE (100% CLIENT-SIDE)
  // =========================================================================
  const [pdfToolMode, setPdfToolMode] = useState("imgToPdf"); // 'imgToPdf' | 'mergePdf' | 'splitPdf'

  // Subtool 1: Images to PDF
  const [pdfImages, setPdfImages] = useState([]);
  const [pdfOrientation, setPdfOrientation] = useState("portrait");
  const [isCompilingPdf, setIsCompilingPdf] = useState(false);
  const pdfImageInputRef = useRef(null);

  // Subtool 2: Merge Multiple PDFs
  const [mergeFiles, setMergeFiles] = useState([]);
  const [isMergingPdf, setIsMergingPdf] = useState(false);
  const mergeInputRef = useRef(null);

  // Subtool 3: Split / Extract PDF Pages
  const [splitFile, setSplitFile] = useState(null);
  const [splitTotalPages, setSplitTotalPages] = useState(0);
  const [splitPageRange, setSplitPageRange] = useState("1");
  const [isSplittingPdf, setIsSplittingPdf] = useState(false);
  const [splitError, setSplitError] = useState("");
  const splitInputRef = useRef(null);

  // Handlers for Images to PDF
  const handlePdfImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const loaded = await Promise.all(files.map((file) => loadImageFromFile(file)));
      setPdfImages((prev) => [...prev, ...loaded]);
    } catch (err) {
      console.error("Failed to load PDF images:", err);
    }
  };

  const handleCompilePdf = async () => {
    if (pdfImages.length === 0) return;
    setIsCompilingPdf(true);
    try {
      await compileImagesToPdf(pdfImages, {
        orientation: pdfOrientation,
        filename: `compiled_document_${Date.now()}.pdf`,
      });
    } catch (err) {
      console.error("PDF compile error:", err);
    } finally {
      setIsCompilingPdf(false);
    }
  };

  // Handlers for Merge PDFs
  const handleMergeUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const items = files.map((file) => ({
      file,
      name: file.name,
      size: file.size,
    }));
    setMergeFiles((prev) => [...prev, ...items]);
  };

  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) {
      alert("Please upload at least 2 PDF documents to merge.");
      return;
    }
    setIsMergingPdf(true);
    try {
      await mergePdfFiles(mergeFiles, `merged_document_${Date.now()}.pdf`);
    } catch (err) {
      alert("Failed to merge PDF files. Please ensure files are valid PDFs.");
      console.error(err);
    } finally {
      setIsMergingPdf(false);
    }
  };

  // Handlers for Split PDF
  const handleSplitUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSplitFile(file);
    setSplitError("");
    try {
      const pages = await getPdfPageCount(file);
      setSplitTotalPages(pages);
      if (pages > 0) {
        setSplitPageRange(pages > 1 ? `1-${Math.min(pages, 3)}` : "1");
      }
    } catch {
      setSplitTotalPages(0);
    }
  };

  const handleExecuteSplit = async () => {
    if (!splitFile) return;
    if (!splitPageRange.trim()) {
      setSplitError("Please enter page numbers (e.g. 1, 3-5)");
      return;
    }
    setIsSplittingPdf(true);
    setSplitError("");
    try {
      await splitPdfFile(splitFile, splitPageRange, `extracted_${splitFile.name}`);
    } catch (err) {
      setSplitError(err.message || "Failed to split PDF. Please check page range.");
    } finally {
      setIsSplittingPdf(false);
    }
  };

  const tabs = [
    { id: "image", label: "Image Compressor", shortLabel: "Compressor", icon: ImageIcon },
    { id: "doc", label: "PDF Document Studio", shortLabel: "PDF Studio", icon: FileText },
  ];

  return (
    <div className="relative w-full max-w-4xl h-[680px] sm:h-[720px] max-h-[90dvh] mx-auto my-auto flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-[#11131b] border border-gray-200 dark:border-white/[0.08] overflow-hidden z-10 font-jakarta shadow-2xl selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transform-gpu transition-colors duration-200">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#11131b] shrink-0 gap-2 transition-colors duration-200">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
            <ImageIcon size={13} />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 font-jakarta min-w-0">
            <span className="text-xs font-bold text-gray-900 dark:text-white tracking-wide truncate">
              Image & PDF
            </span>
            <span className="text-gray-300 dark:text-gray-700 hidden md:inline">|</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden md:inline truncate">
              Compressor & Document Suite
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-gray-100 dark:bg-white/[0.06] p-0.5 rounded-lg border border-gray-200 dark:border-white/10 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white font-semibold shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                }`}
              >
                <Icon size={12} className="shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Studio Canvas Area */}
      <div className="flex-1 bg-[#f8f7f3]/50 dark:bg-[#090b10] p-3.5 sm:p-6 overflow-y-auto min-h-0 flex flex-col transition-colors duration-200">
        {/* ===================================================================
            TAB 1: IMAGE COMPRESSOR & FORMAT CONVERTER
        =================================================================== */}
        {activeTab === "image" && (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Top Toolbar & Upload */}
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-clash">
                    Instant Image Compression & Format Converter
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Compress, resize, and convert formats with instant live preview.
                  </p>
                </div>

                {/* Upload Button */}
                <div>
                  <input
                    ref={compressorInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCompressorUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => compressorInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>Select Images</span>
                  </button>
                </div>
              </div>

              {/* Settings Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs">
                {/* Target Format */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Target Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white/40"
                  >
                    <option value="image/jpeg" className="dark:bg-[#161922]">JPEG (Universal / Default)</option>
                    <option value="image/webp" className="dark:bg-[#161922]">WebP (Modern & Lightweight)</option>
                    <option value="image/png" className="dark:bg-[#161922]">PNG (Lossless Quality)</option>
                  </select>
                </div>

                {/* Quality Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Quality: {imageQuality}%
                    </label>
                    <span className="text-[10.5px] text-gray-400 dark:text-gray-500 font-medium">
                      {imageQuality > 80 ? "High" : imageQuality > 50 ? "Balanced" : "Max Small"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={imageQuality}
                    onChange={(e) => setImageQuality(Number(e.target.value))}
                    className="w-full accent-black dark:accent-white cursor-pointer"
                  />
                </div>

                {/* Dimension Scaling */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Dimensions (px)
                    </label>
                    <button
                      type="button"
                      onClick={() => setLockAspectRatio(!lockAspectRatio)}
                      className={`text-[10.5px] font-semibold cursor-pointer ${
                        lockAspectRatio ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {lockAspectRatio ? "🔒 Lock Ratio" : "🔓 Free Ratio"}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={targetWidth || ""}
                      placeholder="W"
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-900 dark:text-white"
                    />
                    <span className="text-gray-400 dark:text-gray-600">×</span>
                    <input
                      type="number"
                      value={targetHeight || ""}
                      placeholder="H"
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Image Compression Preview */}
            {currentCompressorItem ? (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                      {currentCompressorItem.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      ({currentCompressorItem.width}×{currentCompressorItem.height}px)
                    </span>
                  </div>

                  {/* Savings Comparison Badge */}
                  {compressedResult && (
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-gray-400 dark:text-gray-500 line-through">
                        {formatBytes(currentCompressorItem.originalSize)}
                      </span>
                      <span className="text-black dark:text-white font-bold">➔</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {formatBytes(compressedResult.size)}
                      </span>
                      {currentCompressorItem.originalSize > compressedResult.size && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-bold">
                          -
                          {Math.round(
                            ((currentCompressorItem.originalSize - compressedResult.size) /
                              currentCompressorItem.originalSize) *
                              100
                          )}
                          %
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Visual Image Preview */}
                <div className="flex-1 min-h-[160px] max-h-[260px] rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 flex items-center justify-center p-3 overflow-hidden relative">
                  {compressedResult ? (
                    <img
                      src={compressedResult.dataUrl}
                      alt="Compressed Preview"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-xs"
                    />
                  ) : (
                    <Loader2 size={24} className="animate-spin text-gray-400" />
                  )}
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setCompressorFiles([]);
                      setCompressedResult(null);
                    }}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold cursor-pointer"
                  >
                    Clear Images
                  </button>

                  <button
                    type="button"
                    disabled={!compressedResult || isProcessingImage}
                    onClick={handleDownloadCompressed}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download Converted Image</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone Placeholder */
              <div
                onClick={() => compressorInputRef.current?.click()}
                className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.05] flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.06] group-hover:bg-gray-200 dark:group-hover:bg-white/[0.12] flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white mb-3 transition-colors">
                  <ImageIcon size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  <span className="sm:hidden">Tap to Select Images</span>
                  <span className="hidden sm:inline">Drag & Drop Images or Click to Upload</span>
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  Supports PNG, JPG, WebP, SVG, AVIF. Instant in-browser compression & conversion.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: PDF DOCUMENT STUDIO (100% CLIENT-SIDE)
        =================================================================== */}
        {activeTab === "doc" && (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-white/[0.08] pb-2.5 overflow-x-auto">
              <div className="flex items-center gap-1.5 flex-nowrap sm:flex-wrap">
                {[
                  { id: "imgToPdf", label: "Images to PDF", shortLabel: "To PDF", icon: FilePlus2 },
                  { id: "mergePdf", label: "Merge PDFs", shortLabel: "Merge", icon: Layers },
                  { id: "splitPdf", label: "Split / Extract Pages", shortLabel: "Split Pages", icon: Scissors },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSel = pdfToolMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPdfToolMode(mode.id)}
                      className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isSel
                          ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-xs"
                          : "bg-white dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-white/10"
                      }`}
                    >
                      <Icon size={12} className="shrink-0" />
                      <span className="hidden sm:inline">{mode.label}</span>
                      <span className="sm:hidden">{mode.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtool 1: Images to PDF */}
            {pdfToolMode === "imgToPdf" && (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                      Compile Images to A4 PDF Document
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Combines uploaded photos or scanned receipts into a clean standard `.pdf` document.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={pdfOrientation}
                      onChange={(e) => setPdfOrientation(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-800 dark:text-gray-200"
                    >
                      <option value="portrait" className="dark:bg-[#161922]">📄 Portrait A4</option>
                      <option value="landscape" className="dark:bg-[#161922]">📑 Landscape A4</option>
                    </select>

                    <input
                      ref={pdfImageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePdfImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => pdfImageInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111827] dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-black dark:hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <UploadCloud size={12} />
                      <span>Add Photos</span>
                    </button>
                  </div>
                </div>

                {/* PDF Images Grid */}
                {pdfImages.length > 0 ? (
                  <div className="flex-1 overflow-y-auto max-h-[260px] p-2 bg-gray-50/50 dark:bg-[#0c0e14] rounded-xl border border-gray-200 dark:border-white/10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {pdfImages.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative p-2 rounded-xl bg-white dark:bg-[#161922] border border-gray-200 dark:border-white/10 shadow-2xs flex flex-col items-center group"
                        >
                          <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-black/40 flex items-center justify-center mb-1.5">
                            <img
                              src={item.dataUrl}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <span className="text-[10.5px] font-bold text-gray-800 dark:text-gray-200 truncate w-full text-center">
                            Page {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setPdfImages((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 dark:bg-black/80 shadow-xs border border-gray-200 dark:border-white/15 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove page"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => pdfImageInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <UploadCloud size={28} className="text-gray-400 mb-2" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      <span className="sm:hidden">Tap to Select Photos</span>
                      <span className="hidden sm:inline">Click or Drop Photos to Compile</span>
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Combine multiple images into a clean single PDF
                    </span>
                  </div>
                )}

                {/* Bottom Compile Action */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    disabled={pdfImages.length === 0}
                    onClick={() => setPdfImages([])}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold cursor-pointer disabled:opacity-30"
                  >
                    Clear All
                  </button>

                  <button
                    type="button"
                    disabled={pdfImages.length === 0 || isCompilingPdf}
                    onClick={handleCompilePdf}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isCompilingPdf ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Compiling PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileDown size={13} />
                        <span>Download PDF ({pdfImages.length} Pages)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Subtool 2: Merge Multiple PDFs */}
            {pdfToolMode === "mergePdf" && (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                      Merge Multiple PDF Documents into One
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Combine 2 or more PDF files in seconds with zero uploads.
                    </p>
                  </div>

                  <input
                    ref={mergeInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={handleMergeUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => mergeInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-black dark:hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>Add PDF Files</span>
                  </button>
                </div>

                {mergeFiles.length > 0 ? (
                  <div className="flex-1 overflow-y-auto max-h-[260px] p-2 bg-gray-50/50 dark:bg-[#0c0e14] rounded-xl border border-gray-200 dark:border-white/10 space-y-2">
                    {mergeFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#161922] border border-gray-200 dark:border-white/10 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-gray-900 dark:text-white truncate block">
                              {item.name}
                            </span>
                            <span className="text-[10.5px] text-gray-500 dark:text-gray-400">
                              {formatBytes(item.size)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setMergeFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => mergeInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <Layers size={28} className="text-gray-400 mb-2" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      <span className="sm:hidden">Tap to Select PDF Documents</span>
                      <span className="hidden sm:inline">Click or Drop 2+ PDF Documents</span>
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Combines all pages into a single unified file
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    disabled={mergeFiles.length === 0}
                    onClick={() => setMergeFiles([])}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold cursor-pointer disabled:opacity-30"
                  >
                    Clear All
                  </button>

                  <button
                    type="button"
                    disabled={mergeFiles.length < 2 || isMergingPdf}
                    onClick={handleExecuteMerge}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isMergingPdf ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Merging PDFs...</span>
                      </>
                    ) : (
                      <>
                        <Layers size={13} />
                        <span>Merge & Download ({mergeFiles.length} PDFs)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Subtool 3: Split / Extract PDF Pages */}
            {pdfToolMode === "splitPdf" && (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4 transition-colors duration-200">
                <div className="pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                    Split & Extract PDF Pages
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Extract specific page numbers into a brand new PDF document.
                  </p>
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <input
                    ref={splitInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleSplitUpload}
                    className="hidden"
                  />

                  {splitFile ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900 dark:text-white truncate block">
                                {splitFile.name}
                              </span>
                              {splitTotalPages > 0 && (
                                <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-bold shrink-0">
                                  {splitTotalPages} {splitTotalPages === 1 ? "Page" : "Total Pages"}
                                </span>
                              )}
                            </div>
                            <span className="text-[10.5px] text-gray-500 dark:text-gray-400">
                              {formatBytes(splitFile.size)} • PDF Document
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => splitInputRef.current?.click()}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-pointer"
                        >
                          Change File
                        </button>
                      </div>

                      {/* Quick Page Presets */}
                      {splitTotalPages > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                            Quick Select:
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setSplitPageRange(`1-${splitTotalPages}`)}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12] text-[11px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              All (1-{splitTotalPages})
                            </button>
                            <button
                              type="button"
                              onClick={() => setSplitPageRange("1")}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12] text-[11px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              Page 1
                            </button>
                            {splitTotalPages > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setSplitPageRange(`1-${Math.ceil(splitTotalPages / 2)}`)}
                                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12] text-[11px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                                >
                                  First Half (1-{Math.ceil(splitTotalPages / 2)})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSplitPageRange(`${splitTotalPages}`)}
                                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12] text-[11px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                                >
                                  Last Page ({splitTotalPages})
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => splitInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <Scissors size={28} className="text-gray-400 mb-2" />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        <span className="sm:hidden">Tap to Select PDF Document</span>
                        <span className="hidden sm:inline">Select or Drop a PDF File</span>
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Extract individual pages or custom ranges
                      </span>
                    </div>
                  )}

                  {/* Page Range Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Pages to Extract
                      </label>
                      {splitTotalPages > 0 && (
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                          Range: 1 to {splitTotalPages}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={splitPageRange}
                      onChange={(e) => {
                        setSplitPageRange(e.target.value);
                        setSplitError("");
                      }}
                      placeholder={splitTotalPages > 0 ? `e.g. 1, 3-${Math.min(splitTotalPages, 5)}` : "e.g. 1, 3-5, 8"}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-[#0c0e14]"
                    />
                  </div>

                  {splitError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                      <AlertCircle size={13} />
                      <span>{splitError}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                    100% Client-Side Processing
                  </span>

                  <button
                    type="button"
                    disabled={!splitFile || isSplittingPdf}
                    onClick={handleExecuteSplit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSplittingPdf ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Extracting Pages...</span>
                      </>
                    ) : (
                      <>
                        <Scissors size={13} />
                        <span>Extract & Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
