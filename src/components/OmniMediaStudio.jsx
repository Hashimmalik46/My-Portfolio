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
  Minimize2,
  RefreshCw,
  Maximize2,
  Camera,
  Printer,
  Sliders,
  Archive,
  Eye,
  CheckCircle2,
  Grid,
  Move,
  RotateCcw,
} from "lucide-react";
import {
  loadImageFromFile,
  compressAndConvertImage,
  formatBytes,
  compileImagesToPdf,
  mergePdfFiles,
  splitPdfFile,
  getPdfPageCount,
  PASSPORT_PRESETS,
  SOCIAL_PRESETS,
  resizeAndCropImage,
  generatePrintablePassportSheet,
  convertPdfToImages,
  downloadAllPagesAsZip,
} from "../services/imageProcessor";
import { triggerFileDownload } from "../services/mediaDownloader";

export default function OmniMediaStudio() {
  // Main Suite Switcher: 'image' | 'pdf'
  const [activeSuite, setActiveSuite] = useState("image");

  // Sub-tabs for Image Suite: 'compressor' | 'converter' | 'resizer'
  const [activeImageTab, setActiveImageTab] = useState("compressor");

  // Sub-tabs for PDF Suite: 'pdfToImg' | 'imgToPdf' | 'mergePdf' | 'splitPdf'
  const [activePdfTab, setActivePdfTab] = useState("pdfToImg");

  // =========================================================================
  // 1. IMAGE COMPRESSOR STATE
  // =========================================================================
  const [compressorFile, setCompressorFile] = useState(null);
  const [compressQuality, setCompressQuality] = useState(75);
  const [targetMaxKb, setTargetMaxKb] = useState(0); // 0 = use quality slider, >0 = strict max KB
  const [compressDimensionScale, setCompressDimensionScale] = useState(100); // 10% - 100%
  const [compressResult, setCompressResult] = useState(null);
  const [compressViewMode, setCompressViewMode] = useState("compressed"); // 'compressed' | 'split' | 'original'
  const [isCompressing, setIsCompressing] = useState(false);
  const compressorInputRef = useRef(null);

  // Trigger compression
  useEffect(() => {
    if (!compressorFile) {
      setCompressResult(null);
      return;
    }

    let isMounted = true;
    const runCompression = async () => {
      setIsCompressing(true);
      try {
        const scaledWidth = Math.round(
          (compressorFile.width * compressDimensionScale) / 100
        );
        const scaledHeight = Math.round(
          (compressorFile.height * compressDimensionScale) / 100
        );

        const res = await compressAndConvertImage(compressorFile.img, {
          format: "image/jpeg",
          quality: compressQuality / 100,
          width: scaledWidth,
          height: scaledHeight,
          targetMaxKb: targetMaxKb > 0 ? targetMaxKb : null,
        });

        if (isMounted) setCompressResult(res);
      } catch (err) {
        console.error("Compression error:", err);
      } finally {
        if (isMounted) setIsCompressing(false);
      }
    };

    const timer = setTimeout(runCompression, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [compressorFile, compressQuality, targetMaxKb, compressDimensionScale]);

  const handleCompressorUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const loaded = await loadImageFromFile(file);
      setCompressorFile(loaded);
    } catch (err) {
      console.error("Failed to load compressor image:", err);
    }
  };

  // =========================================================================
  // 2. FORMAT CONVERTER STATE
  // =========================================================================
  const [converterFiles, setConverterFiles] = useState([]);
  const [converterTargetFormat, setConverterTargetFormat] = useState("image/webp");
  const [converterQuality, setConverterQuality] = useState(90);
  const [isConvertingBatch, setIsConvertingBatch] = useState(false);
  const [convertedBatchResults, setConvertedBatchResults] = useState([]);
  const converterInputRef = useRef(null);

  const handleConverterUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const loaded = await Promise.all(files.map((file) => loadImageFromFile(file)));
      setConverterFiles((prev) => [...prev, ...loaded]);
      setConvertedBatchResults([]);
    } catch (err) {
      console.error("Failed to load converter images:", err);
    }
  };

  const handleExecuteConversion = async () => {
    if (converterFiles.length === 0) return;
    setIsConvertingBatch(true);
    try {
      const results = await Promise.all(
        converterFiles.map(async (item) => {
          const res = await compressAndConvertImage(item.img, {
            format: converterTargetFormat,
            quality: converterQuality / 100,
            width: item.width,
            height: item.height,
          });
          const ext =
            converterTargetFormat === "image/webp"
              ? "webp"
              : converterTargetFormat === "image/png"
              ? "png"
              : "jpg";
          return {
            ...res,
            originalName: item.name,
            outputName: `${item.name}.${ext}`,
            ext,
          };
        })
      );
      setConvertedBatchResults(results);
    } catch (err) {
      console.error("Batch conversion error:", err);
    } finally {
      setIsConvertingBatch(false);
    }
  };

  // =========================================================================
  // 3. PASSPORT & PHOTO RESIZER STATE
  // =========================================================================
  const [resizerFile, setResizerFile] = useState(null);
  const [selectedPresetId, setSelectedPresetId] = useState("us-passport");
  const [customUnit, setCustomUnit] = useState("mm"); // 'mm' | 'px' | 'in' | 'cm'
  const [customWidth, setCustomWidth] = useState(35);
  const [customHeight, setCustomHeight] = useState(45);
  const [customDpi, setCustomDpi] = useState(300);
  const [fitMode, setFitMode] = useState("cover"); // 'cover' | 'contain' | 'stretch'
  const [resizerBgColor, setResizerBgColor] = useState("#FFFFFF");
  const [resizerZoom, setResizerZoom] = useState(1);
  const [resizerPanX, setResizerPanX] = useState(0);
  const [resizerPanY, setResizerPanY] = useState(0);
  const [showPassportGuide, setShowPassportGuide] = useState(true);
  const [resizerTargetKb, setResizerTargetKb] = useState(0); // 0 or KB limit
  const [resizerFormat, setResizerFormat] = useState("image/jpeg");
  const [resizerResult, setResizerResult] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizerInputRef = useRef(null);

  // Compute final pixel dimensions from preset or custom
  const getComputedDimensions = () => {
    if (selectedPresetId !== "custom") {
      const p =
        PASSPORT_PRESETS.find((x) => x.id === selectedPresetId) ||
        SOCIAL_PRESETS.find((x) => x.id === selectedPresetId);
      if (p) {
        if (p.px300Dpi) return p.px300Dpi;
        if (p.width && p.height) return { width: p.width, height: p.height };
      }
    }
    // Custom calculation
    const dpi = Number(customDpi) || 300;
    if (customUnit === "px") return { width: Number(customWidth), height: Number(customHeight) };
    if (customUnit === "in") {
      return {
        width: Math.round(Number(customWidth) * dpi),
        height: Math.round(Number(customHeight) * dpi),
      };
    }
    if (customUnit === "cm") {
      return {
        width: Math.round((Number(customWidth) / 2.54) * dpi),
        height: Math.round((Number(customHeight) / 2.54) * dpi),
      };
    }
    // mm default
    return {
      width: Math.round((Number(customWidth) / 25.4) * dpi),
      height: Math.round((Number(customHeight) / 25.4) * dpi),
    };
  };

  useEffect(() => {
    if (!resizerFile) {
      setResizerResult(null);
      return;
    }

    let isMounted = true;
    const runResizing = async () => {
      setIsResizing(true);
      try {
        const { width: targetW, height: targetH } = getComputedDimensions();
        const res = await resizeAndCropImage(resizerFile.img, {
          targetWidth: targetW,
          targetHeight: targetH,
          fitMode,
          bgColor: resizerBgColor,
          zoom: resizerZoom,
          offsetX: resizerPanX,
          offsetY: resizerPanY,
          format: resizerFormat,
          quality: 0.92,
          targetMaxKb: resizerTargetKb > 0 ? resizerTargetKb : null,
        });

        if (isMounted) setResizerResult(res);
      } catch (err) {
        console.error("Resizing error:", err);
      } finally {
        if (isMounted) setIsResizing(false);
      }
    };

    const timer = setTimeout(runResizing, 90);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    resizerFile,
    selectedPresetId,
    customUnit,
    customWidth,
    customHeight,
    customDpi,
    fitMode,
    resizerBgColor,
    resizerZoom,
    resizerPanX,
    resizerPanY,
    resizerFormat,
    resizerTargetKb,
  ]);

  const handleResizerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const loaded = await loadImageFromFile(file);
      setResizerFile(loaded);
      setResizerZoom(1);
      setResizerPanX(0);
      setResizerPanY(0);
    } catch (err) {
      console.error("Failed to load resizer image:", err);
    }
  };

  // Interactive Drag-to-Pan & Scroll-to-Zoom handlers for Framed Preview
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e) => {
    if (!resizerFile) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    isDraggingRef.current = true;
    setIsDraggingPhoto(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: resizerPanX,
      panY: resizerPanY,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    // Map screen pixel movement into pan percentage [-50, 50]
    const sensitivity = 0.35;
    const newPanX = Math.max(-50, Math.min(50, Math.round(dragStartRef.current.panX + dx * sensitivity)));
    const newPanY = Math.max(-50, Math.min(50, Math.round(dragStartRef.current.panY + dy * sensitivity)));
    setResizerPanX(newPanX);
    setResizerPanY(newPanY);
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      isDraggingRef.current = false;
      setIsDraggingPhoto(false);
    }
  };

  const resizerPreviewContainerRef = useRef(null);

  // Attach native non-passive wheel event listener to prevent window scrolling during zoom
  useEffect(() => {
    const el = resizerPreviewContainerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const step = e.deltaY < 0 ? 0.05 : -0.05;
      setResizerZoom((prev) => Math.max(1, Math.min(2.5, Number((prev + step).toFixed(2)))));
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [resizerFile, resizerResult]);

  const handleDownloadResizedSingle = () => {
    if (!resizerResult || !resizerFile) return;
    const ext = resizerFormat === "image/png" ? "png" : resizerFormat === "image/webp" ? "webp" : "jpg";
    triggerFileDownload(
      resizerResult.blob || resizerResult.dataUrl,
      `${resizerFile.name}_${selectedPresetId}.${ext}`
    );
  };

  const handleDownloadPrintSheet = async (sheetFormat = "4x6") => {
    if (!resizerResult) return;
    const preset = PASSPORT_PRESETS.find((x) => x.id === selectedPresetId);
    const pW = preset?.widthMm || (customUnit === "mm" ? customWidth : 35);
    const pH = preset?.heightMm || (customUnit === "mm" ? customHeight : 45);

    try {
      await generatePrintablePassportSheet(resizerResult.dataUrl, {
        sheetFormat,
        photoWidthMm: pW,
        photoHeightMm: pH,
      });
    } catch (err) {
      console.error("Printable sheet generation error:", err);
    }
  };

  // =========================================================================
  // 5. PDF TO IMAGES STATE (NEW FEATURE)
  // =========================================================================
  const [pdfToImgFile, setPdfToImgFile] = useState(null);
  const [pdfToImgFormat, setPdfToImgFormat] = useState("image/png");
  const [pdfToImgDpiScale, setPdfToImgDpiScale] = useState(2.0); // 1.0 = web, 2.0 = HD, 3.0 = Print (300dpi)
  const [renderedPdfPages, setRenderedPdfPages] = useState([]);
  const [isRenderingPdfPages, setIsRenderingPdfPages] = useState(false);
  const [pdfRenderProgress, setPdfRenderProgress] = useState(null);
  const pdfToImgInputRef = useRef(null);

  const handlePdfToImgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfToImgFile(file);
    setRenderedPdfPages([]);
    setIsRenderingPdfPages(true);
    setPdfRenderProgress({ currentPage: 1, totalPages: 1, percent: 10 });
    try {
      const result = await convertPdfToImages(file, {
        format: pdfToImgFormat,
        scale: Number(pdfToImgDpiScale),
        progressCallback: (p) => setPdfRenderProgress(p),
      });
      setRenderedPdfPages(result.pages);
    } catch (err) {
      console.error("PDF to Images error:", err);
      alert("Failed to render PDF pages. Please ensure file is a valid PDF.");
    } finally {
      setIsRenderingPdfPages(false);
      setPdfRenderProgress(null);
    }
  };

  const handleRerenderPdf = async () => {
    if (!pdfToImgFile) return;
    setIsRenderingPdfPages(true);
    try {
      const result = await convertPdfToImages(pdfToImgFile, {
        format: pdfToImgFormat,
        scale: Number(pdfToImgDpiScale),
        progressCallback: (p) => setPdfRenderProgress(p),
      });
      setRenderedPdfPages(result.pages);
    } catch (err) {
      console.error("Rerender error:", err);
    } finally {
      setIsRenderingPdfPages(false);
      setPdfRenderProgress(null);
    }
  };

  const handleDownloadAllPdfImagesZip = async () => {
    if (renderedPdfPages.length === 0 || !pdfToImgFile) return;
    await downloadAllPagesAsZip(renderedPdfPages, pdfToImgFile.name.replace(/\.[^/.]+$/, ""));
  };

  const handleDownloadSinglePdfPage = (page) => {
    triggerFileDownload(
      page.blob || page.dataUrl,
      `${pdfToImgFile?.name?.replace(/\.[^/.]+$/, "") || "document"}_page_${page.pageNum}.${page.ext}`
    );
  };

  // =========================================================================
  // 6. OTHER PDF TOOLS (Images to PDF, Merge, Split)
  // =========================================================================
  const [pdfImages, setPdfImages] = useState([]);
  const [pdfOrientation, setPdfOrientation] = useState("portrait");
  const [isCompilingPdf, setIsCompilingPdf] = useState(false);
  const pdfImageInputRef = useRef(null);

  const [mergeFiles, setMergeFiles] = useState([]);
  const [isMergingPdf, setIsMergingPdf] = useState(false);
  const mergeInputRef = useRef(null);

  const [splitFile, setSplitFile] = useState(null);
  const [splitTotalPages, setSplitTotalPages] = useState(0);
  const [splitPageRange, setSplitPageRange] = useState("1");
  const [isSplittingPdf, setIsSplittingPdf] = useState(false);
  const [splitError, setSplitError] = useState("");
  const splitInputRef = useRef(null);

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
    if (mergeFiles.length < 2) return;
    setIsMergingPdf(true);
    try {
      await mergePdfFiles(mergeFiles, `merged_document_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMergingPdf(false);
    }
  };

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
    if (!splitFile || !splitPageRange.trim()) return;
    setIsSplittingPdf(true);
    setSplitError("");
    try {
      await splitPdfFile(splitFile, splitPageRange, `extracted_${splitFile.name}`);
    } catch (err) {
      setSplitError(err.message || "Failed to split PDF");
    } finally {
      setIsSplittingPdf(false);
    }
  };

  // Master Suites Definition
  const suites = [
    { id: "image", label: "Image Suite", icon: ImageIcon, count: "3 Tools" },
    { id: "pdf", label: "PDF Suite", icon: FileText, count: "4 Tools" },
  ];

  const imageTabs = [
    { id: "compressor", label: "Compressor", icon: Minimize2, tag: "Size Limit" },
    { id: "converter", label: "Converter", icon: RefreshCw, tag: "Multi-Format" },
    { id: "resizer", label: "Passport & Resizer", icon: Camera, tag: "Visa / ID" },
  ];

  const pdfTabs = [
    { id: "pdfToImg", label: "PDF to Images", icon: Grid, tag: "High-Res" },
    { id: "imgToPdf", label: "Images to PDF", icon: FilePlus2, tag: "Compile" },
    { id: "mergePdf", label: "Merge PDFs", icon: Layers, tag: "Combine" },
    { id: "splitPdf", label: "Split Pages", icon: Scissors, tag: "Extract" },
  ];

  return (
    <div className="relative w-full max-w-5xl min-h-[700px] my-auto flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-[#11131b] border border-gray-200 dark:border-white/[0.08] overflow-hidden z-10 font-jakarta shadow-2xl transition-colors duration-200">
      {/* 1. Master Suite Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#11131b] shrink-0 gap-2.5 transition-colors duration-200">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
            {activeSuite === "image" ? <ImageIcon size={16} /> : <FileText size={16} />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-clash tracking-wide truncate">
                Image & PDF Studio
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                100% Private (No Upload)
              </span>
            </div>
          </div>
        </div>

        {/* Master Suite Switcher */}
        <div className="flex items-center bg-gray-100 dark:bg-white/[0.06] p-1 rounded-xl border border-gray-200 dark:border-white/10 shrink-0 self-start sm:self-auto">
          {suites.map((s) => {
            const Icon = s.icon;
            const isSel = activeSuite === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSuite(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSel
                    ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon size={13} className="shrink-0" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Sub-Tab Bar */}
      <div className="px-3.5 sm:px-6 py-2 bg-gray-50/80 dark:bg-[#0c0e14] border-b border-gray-200 dark:border-white/[0.08] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {(activeSuite === "image" ? imageTabs : pdfTabs).map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeSuite === "image"
              ? activeImageTab === tab.id
              : activePdfTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                activeSuite === "image"
                  ? setActiveImageTab(tab.id)
                  : setActivePdfTab(tab.id)
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-xs"
                  : "bg-white dark:bg-white/[0.05] text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-white/10"
              }`}
            >
              <Icon size={12} className="shrink-0" />
              <span>{tab.label}</span>
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? "bg-white/20 dark:bg-black/20 text-white dark:text-black"
                    : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                }`}
              >
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Studio Canvas Area */}
      <div className="flex-1 bg-[#f8f7f3]/50 dark:bg-[#090b10] p-3.5 sm:p-6 overflow-y-auto min-h-0 flex flex-col transition-colors duration-200">
        {/* ===================================================================
            IMAGE SUITE: TAB 1 - IMAGE COMPRESSOR
        =================================================================== */}
        {activeSuite === "image" && activeImageTab === "compressor" && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-clash">
                    Precision Image Compressor
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Reduce file size with live byte reduction comparison or set exact max KB limit.
                  </p>
                </div>

                <div>
                  <input
                    ref={compressorInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCompressorUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => compressorInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>{compressorFile ? "Change Photo" : "Select Photo"}</span>
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                {/* Max File Size Limit Preset */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Target Max File Size
                    </label>
                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {targetMaxKb > 0 ? `< ${targetMaxKb} KB` : "Auto Quality"}
                    </span>
                  </div>
                  <select
                    value={targetMaxKb}
                    onChange={(e) => setTargetMaxKb(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value={0}>Auto (Quality Slider Mode)</option>
                    <option value={20}>Strict &lt; 20 KB (Govt Portal)</option>
                    <option value={50}>Strict &lt; 50 KB (Passport/Visa)</option>
                    <option value={100}>Strict &lt; 100 KB (Job/Application)</option>
                    <option value={200}>Strict &lt; 200 KB (Web/Mobile)</option>
                    <option value={500}>Strict &lt; 500 KB (Email Attachment)</option>
                  </select>
                </div>

                {/* Quality Slider (Active when targetMaxKb === 0) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Quality: {compressQuality}%
                    </label>
                    <span className="text-[10.5px] text-gray-400">
                      {compressQuality > 80 ? "High" : compressQuality > 50 ? "Balanced" : "Max Compression"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    disabled={targetMaxKb > 0}
                    value={compressQuality}
                    onChange={(e) => setCompressQuality(Number(e.target.value))}
                    className="w-full accent-black dark:accent-white cursor-pointer disabled:opacity-40"
                  />
                </div>

                {/* Dimension Scaling Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Scale Resolution: {compressDimensionScale}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="100"
                    step="5"
                    value={compressDimensionScale}
                    onChange={(e) => setCompressDimensionScale(Number(e.target.value))}
                    className="w-full accent-black dark:accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Compressor Preview & Output */}
            {compressorFile ? (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                      {compressorFile.name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      ({compressorFile.width}×{compressorFile.height}px)
                    </span>
                    {compressResult && (
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-gray-400 line-through">
                          {formatBytes(compressorFile.originalSize)}
                        </span>
                        <span className="text-black dark:text-white font-bold">➔</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {formatBytes(compressResult.size)}
                        </span>
                        {compressorFile.originalSize > compressResult.size && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            -
                            {Math.round(
                              ((compressorFile.originalSize - compressResult.size) /
                                compressorFile.originalSize) *
                                100
                            )}
                            %
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* View Mode Switcher */}
                  {compressResult && (
                    <div className="flex items-center bg-gray-100 dark:bg-white/[0.06] p-0.5 rounded-lg border border-gray-200 dark:border-white/10 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setCompressViewMode("compressed")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          compressViewMode === "compressed"
                            ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-xs"
                            : "text-gray-500 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        🗜️ Compressed
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompressViewMode("split")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          compressViewMode === "split"
                            ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-xs"
                            : "text-gray-500 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        🌓 Compare
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompressViewMode("original")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          compressViewMode === "original"
                            ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-xs"
                            : "text-gray-500 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        👁️ Original
                      </button>
                    </div>
                  )}
                </div>

                {/* Viewport */}
                <div className="flex-1 min-h-[260px] max-h-[380px] rounded-2xl bg-gray-50/70 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 flex items-center justify-center p-3 sm:p-4 overflow-hidden relative shadow-inner">
                  {isCompressing ? (
                    <div className="flex flex-col items-center justify-center p-4">
                      <Loader2 size={28} className="animate-spin text-gray-400 mb-2" />
                      <span className="text-xs font-semibold text-gray-500">Compressing photo...</span>
                    </div>
                  ) : compressResult ? (
                    compressViewMode === "split" ? (
                      /* Side-by-Side Comparison */
                      <div className="grid grid-cols-2 gap-3 w-full h-full">
                        <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-[#161922] rounded-xl p-2 relative border border-gray-200 dark:border-white/10">
                          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white z-10">
                            Original ({formatBytes(compressorFile.originalSize)})
                          </span>
                          <img
                            src={compressorFile.dataUrl}
                            alt="Original"
                            className="max-h-[300px] max-w-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-[#161922] rounded-xl p-2 relative border border-gray-200 dark:border-white/10">
                          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white z-10">
                            Compressed ({formatBytes(compressResult.size)})
                          </span>
                          <img
                            src={compressResult.dataUrl}
                            alt="Compressed"
                            className="max-h-[300px] max-w-full object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    ) : compressViewMode === "original" ? (
                      <img
                        src={compressorFile.dataUrl}
                        alt="Original"
                        className="max-h-[330px] max-w-[85%] object-contain mx-auto rounded-xl shadow-md border border-gray-200/60 dark:border-white/10"
                      />
                    ) : (
                      <img
                        src={compressResult.dataUrl}
                        alt="Compressed Preview"
                        className="max-h-[330px] max-w-[85%] object-contain mx-auto rounded-xl shadow-md border border-gray-200/60 dark:border-white/10"
                      />
                    )
                  ) : null}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCompressorFile(null);
                      setCompressResult(null);
                    }}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer"
                  >
                    Clear Photo
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!compressResult || !compressorFile) return;
                      triggerFileDownload(
                        compressResult.blob || compressResult.dataUrl,
                        `${compressorFile.name}_compressed.jpg`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download Compressed ({compressResult ? formatBytes(compressResult.size) : "..."})</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => compressorInputRef.current?.click()}
                className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-gray-600 dark:text-gray-300 mb-3">
                  <Minimize2 size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Select Photo to Compress
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  Instant client-side compression with target KB limits for government portals.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            IMAGE SUITE: TAB 2 - FORMAT CONVERTER
        =================================================================== */}
        {activeSuite === "image" && activeImageTab === "converter" && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-clash">
                    Batch Multi-Format Converter
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Convert single or multiple images to WebP, JPEG, or PNG in 1-click.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={converterInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleConverterUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => converterInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>Upload Images</span>
                  </button>
                </div>
              </div>

              {/* Converter Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Target Output Format
                  </label>
                  <select
                    value={converterTargetFormat}
                    onChange={(e) => {
                      setConverterTargetFormat(e.target.value);
                      setConvertedBatchResults([]);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value="image/webp">WebP (Modern, 30% Smaller, High-Performance)</option>
                    <option value="image/jpeg">JPEG (Universal, Standard Compatibility)</option>
                    <option value="image/png">PNG (Lossless, Transparent Support)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Export Quality: {converterQuality}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={converterQuality}
                    onChange={(e) => {
                      setConverterQuality(Number(e.target.value));
                      setConvertedBatchResults([]);
                    }}
                    className="w-full accent-black dark:accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Converter File List */}
            {converterFiles.length > 0 ? (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {converterFiles.length} {converterFiles.length === 1 ? "Image" : "Images"} Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setConverterFiles([]);
                      setConvertedBatchResults([]);
                    }}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[240px] space-y-2 p-1">
                  {converterFiles.map((fileItem, idx) => {
                    const convertedItem = convertedBatchResults[idx];
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={fileItem.dataUrl}
                            alt={fileItem.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-200 dark:bg-black/40"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-gray-900 dark:text-white truncate block">
                              {fileItem.name}
                            </span>
                            <span className="text-[10.5px] text-gray-500 font-mono">
                              {formatBytes(fileItem.originalSize)} ({fileItem.width}×{fileItem.height}px)
                            </span>
                          </div>
                        </div>

                        {convertedItem ? (
                          <button
                            type="button"
                            onClick={() => {
                              triggerFileDownload(
                                convertedItem.blob || convertedItem.dataUrl,
                                convertedItem.outputName
                              );
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                          >
                            <Download size={11} />
                            <span>Download {convertedItem.ext.toUpperCase()} ({formatBytes(convertedItem.size)})</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setConverterFiles((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    disabled={isConvertingBatch}
                    onClick={handleExecuteConversion}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isConvertingBatch ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Converting {converterFiles.length} Photos...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={13} />
                        <span>Convert All to {converterTargetFormat.replace("image/", "").toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => converterInputRef.current?.click()}
                className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-gray-600 dark:text-gray-300 mb-3">
                  <RefreshCw size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Select Images to Convert Formats
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  Convert multiple PNG, JPG, WebP images instantly in bulk.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            IMAGE SUITE: TAB 3 - PASSPORT & PHOTO RESIZER (NEW FEATURE)
        =================================================================== */}
        {activeSuite === "image" && activeImageTab === "resizer" && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-clash">
                    Passport & Photo Resizer Studio
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Official passport & visa specifications (US 2x2", India 35x45mm, Schengen, Canada) + Social sizes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={resizerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleResizerUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => resizerInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>{resizerFile ? "Change Photo" : "Upload Passport Photo"}</span>
                  </button>
                </div>
              </div>

              {/* Preset Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Document / Country Preset
                  </label>
                  <select
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <optgroup label="🛂 Official Passport & Visa Sizes">
                      {PASSPORT_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.country} — {p.name} ({p.description})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="📱 Social Media Dimensions">
                      {SOCIAL_PRESETS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.platform} — {s.name} ({s.description})
                        </option>
                      ))}
                    </optgroup>
                    <option value="custom">🛠️ Custom Units (mm / cm / in / px)</option>
                  </select>
                </div>

                {/* Target File Size Constraint */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Govt Portal Max KB Limit
                  </label>
                  <select
                    value={resizerTargetKb}
                    onChange={(e) => setResizerTargetKb(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value={0}>No Size Limit (High Quality)</option>
                    <option value={20}>&lt; 20 KB (Strict Govt Portal)</option>
                    <option value={50}>&lt; 50 KB (Standard Passport Portal)</option>
                    <option value={100}>&lt; 100 KB (Visa Application)</option>
                    <option value={200}>&lt; 200 KB (Exam Registration)</option>
                  </select>
                </div>
              </div>

              {/* Custom Units Row (If Custom selected) */}
              {selectedPresetId === "custom" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs border-t border-gray-100 dark:border-white/[0.06]">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">Unit</label>
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                    >
                      <option value="mm">Millimeters (mm)</option>
                      <option value="cm">Centimeters (cm)</option>
                      <option value="in">Inches (in)</option>
                      <option value="px">Pixels (px)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">Width</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">Height</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">DPI</label>
                    <select
                      value={customDpi}
                      onChange={(e) => setCustomDpi(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                    >
                      <option value={300}>300 DPI (Standard Print)</option>
                      <option value={600}>600 DPI (Ultra HD)</option>
                      <option value={150}>150 DPI (Balanced)</option>
                      <option value={72}>72 DPI (Web)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Adjustments: Zoom, Pan X, Pan Y, Guide Overlay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1 text-xs">
                {/* Face Zoom */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      Face Zoom: {resizerZoom.toFixed(2)}x
                    </label>
                    <button
                      type="button"
                      onClick={() => setResizerZoom(1)}
                      className="text-[10px] text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      Reset (1x)
                    </button>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={resizerZoom}
                    onChange={(e) => setResizerZoom(Number(e.target.value))}
                    className="w-full accent-black dark:accent-white cursor-pointer"
                  />
                </div>

                {/* Horizontal Pan X */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      Horizontal (Pan X): {resizerPanX > 0 ? `+${resizerPanX}` : resizerPanX}%
                    </label>
                    <button
                      type="button"
                      onClick={() => setResizerPanX(0)}
                      className="text-[10px] text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      Center
                    </button>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={resizerPanX}
                    onChange={(e) => setResizerPanX(Number(e.target.value))}
                    className="w-full accent-black dark:accent-white cursor-pointer"
                  />
                </div>

                {/* Vertical Pan Y */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      Vertical (Pan Y): {resizerPanY > 0 ? `+${resizerPanY}` : resizerPanY}%
                    </label>
                    <button
                      type="button"
                      onClick={() => setResizerPanY(0)}
                      className="text-[10px] text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      Center
                    </button>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={resizerPanY}
                    onChange={(e) => setResizerPanY(Number(e.target.value))}
                    className="w-full accent-black dark:accent-white cursor-pointer"
                  />
                </div>

                {/* Reset & Biometric Guide */}
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setResizerZoom(1);
                      setResizerPanX(0);
                      setResizerPanY(0);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                    title="Reset Zoom & Alignment to center"
                  >
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPassportGuide(!showPassportGuide)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      showPassportGuide
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300"
                        : "bg-gray-50 dark:bg-[#0c0e14] border-gray-200 dark:border-white/10 text-gray-500"
                    }`}
                  >
                    <Eye size={12} />
                    <span>{showPassportGuide ? "Guide: ON" : "Guide: OFF"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Resizer Interactive Preview */}
            {resizerFile ? (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Framed Preview
                    </span>
                    {resizerResult && (
                      <span className="text-[11px] text-gray-400 font-mono">
                        ({resizerResult.width} × {resizerResult.height} px • {formatBytes(resizerResult.size)})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium hidden sm:flex">
                    <Move size={11} className="text-emerald-500" />
                    <span>Drag preview to pan (X/Y) • Scroll to zoom</span>
                  </div>
                </div>

                {/* Canvas Container with Biometric Guide Overlay & Drag/Wheel support */}
                <div
                  ref={resizerPreviewContainerRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`flex-1 min-h-[220px] max-h-[320px] rounded-xl bg-gray-100 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 flex items-center justify-center p-3 overflow-hidden relative select-none touch-none overscroll-contain transition-shadow ${
                    isDraggingPhoto
                      ? "cursor-grabbing ring-2 ring-emerald-500/50 shadow-inner"
                      : "cursor-grab hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                  title="Click & drag to reposition photo • Scroll to zoom"
                >
                  {resizerResult ? (
                    <div className="relative max-h-full max-w-full flex items-center justify-center shadow-lg rounded-md overflow-hidden pointer-events-none select-none">
                      <img
                        src={resizerResult.dataUrl}
                        alt="Passport Framed Preview"
                        className="max-h-[260px] object-contain rounded-md pointer-events-none select-none"
                        draggable={false}
                      />

                      {/* Biometric Oval Guide Overlay for Passport Face Framing */}
                      {showPassportGuide && (
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                          {/* Head Oval */}
                          <div className="w-[60%] h-[72%] border-2 border-dashed border-emerald-400/80 rounded-[50%] flex flex-col items-center justify-center relative">
                            {/* Eye Level Line */}
                            <div className="w-full border-t border-emerald-400/60 absolute top-[45%]" />
                            {/* Chin Level Line */}
                            <div className="w-[70%] border-t border-emerald-400/60 absolute bottom-[10%]" />
                          </div>
                          <span className="absolute top-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-white/80 dark:bg-black/80 px-1.5 py-0.5 rounded shadow-2xs">
                            Align Face within Oval
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Loader2 size={24} className="animate-spin text-gray-400" />
                  )}
                </div>

                {/* Download Actions */}
                <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setResizerFile(null);
                      setResizerResult(null);
                    }}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer"
                  >
                    Clear Photo
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Printable Sheet Generation */}
                    <button
                      type="button"
                      onClick={() => handleDownloadPrintSheet("4x6")}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-900 dark:text-white text-xs font-semibold shadow-xs cursor-pointer"
                      title="Print 6-8 photos on a single 4x6 photo paper"
                    >
                      <Printer size={13} />
                      <span>Printable 4x6" Sheet</span>
                    </button>

                    {/* Single Photo Download */}
                    <button
                      type="button"
                      onClick={handleDownloadResizedSingle}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download Single Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => resizerInputRef.current?.click()}
                className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-gray-600 dark:text-gray-300 mb-3">
                  <Camera size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Select Photo for Passport & Visa Resizing
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  US 2x2", Indian 35x45mm, Schengen, Stamp size with biometric alignment overlay and printable 4x6 sheet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PDF SUITE: TAB 1 - PDF TO IMAGES (NEW FEATURE)
        =================================================================== */}
        {activeSuite === "pdf" && activePdfTab === "pdfToImg" && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-clash">
                    PDF to High-Resolution Images
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Render all or individual PDF pages to crisp PNG/JPG with 1-click ZIP archive export.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={pdfToImgInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfToImgUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => pdfToImgInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>{pdfToImgFile ? "Change PDF" : "Select PDF Document"}</span>
                  </button>
                </div>
              </div>

              {/* Rendering Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Export Image Format
                  </label>
                  <select
                    value={pdfToImgFormat}
                    onChange={(e) => setPdfToImgFormat(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value="image/png">PNG (Crisp & Lossless Text)</option>
                    <option value="image/jpeg">JPEG (Compact File Size)</option>
                    <option value="image/webp">WebP (Lightweight & Modern)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Resolution / DPI Scale
                  </label>
                  <select
                    value={pdfToImgDpiScale}
                    onChange={(e) => setPdfToImgDpiScale(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value={1.0}>1.0x (Standard Web Display)</option>
                    <option value={2.0}>2.0x (150 DPI High Definition)</option>
                    <option value={3.0}>3.0x (300 DPI Ultra Sharp Print)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  {pdfToImgFile && (
                    <button
                      type="button"
                      onClick={handleRerenderPdf}
                      disabled={isRenderingPdfPages}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/15 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={12} className={isRenderingPdfPages ? "animate-spin" : ""} />
                      <span>Re-Render Pages</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* PDF Pages Grid */}
            {pdfToImgFile ? (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {pdfToImgFile.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-bold">
                      {renderedPdfPages.length} Pages Extracted
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={renderedPdfPages.length === 0}
                    onClick={handleDownloadAllPdfImagesZip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-40"
                  >
                    <Archive size={13} />
                    <span>Download All as ZIP</span>
                  </button>
                </div>

                {isRenderingPdfPages ? (
                  <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center space-y-3">
                    <Loader2 size={32} className="animate-spin text-indigo-600" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Rendering Page {pdfRenderProgress?.currentPage || 1} of {pdfRenderProgress?.totalPages || 1}...
                    </span>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto max-h-[300px] p-2 bg-gray-50 dark:bg-[#0c0e14] rounded-xl border border-gray-200 dark:border-white/10">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {renderedPdfPages.map((page) => (
                        <div
                          key={page.pageNum}
                          className="relative p-2.5 rounded-xl bg-white dark:bg-[#161922] border border-gray-200 dark:border-white/10 shadow-2xs flex flex-col items-center group"
                        >
                          <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-black/40 flex items-center justify-center mb-2 shadow-inner">
                            <img
                              src={page.dataUrl}
                              alt={`Page ${page.pageNum}`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <div className="w-full flex items-center justify-between text-[11px] font-bold text-gray-800 dark:text-gray-200">
                            <span>Page {page.pageNum}</span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {formatBytes(page.size)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadSinglePdfPage(page)}
                            className="mt-2 w-full inline-flex items-center justify-center gap-1 py-1 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] font-semibold hover:bg-black dark:hover:bg-gray-100 cursor-pointer"
                          >
                            <Download size={11} />
                            <span>Download {page.ext.toUpperCase()}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => pdfToImgInputRef.current?.click()}
                className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Grid size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Select PDF Document to Convert to Images
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  Render all pages to high-res PNG, JPG, or WebP with individual and ZIP download.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PDF SUITE: TAB 2 - IMAGES TO PDF
        =================================================================== */}
        {activeSuite === "pdf" && activePdfTab === "imgToPdf" && (
          <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Compile Photos to A4 PDF Document
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Combines uploaded photos or receipts into a clean standard `.pdf` document.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={pdfOrientation}
                  onChange={(e) => setPdfOrientation(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-800 dark:text-gray-200"
                >
                  <option value="portrait">📄 Portrait A4</option>
                  <option value="landscape">📑 Landscape A4</option>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111827] dark:bg-white text-white dark:text-black text-xs font-semibold cursor-pointer"
                >
                  <UploadCloud size={12} />
                  <span>Add Photos</span>
                </button>
              </div>
            </div>

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
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 dark:bg-black/80 shadow-xs border border-gray-200 text-red-600 flex items-center justify-center cursor-pointer"
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
                className="flex-1 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <UploadCloud size={28} className="text-gray-400 mb-2" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Click or Drop Photos to Compile
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
              <button
                type="button"
                disabled={pdfImages.length === 0}
                onClick={() => setPdfImages([])}
                className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer disabled:opacity-30"
              >
                Clear All
              </button>

              <button
                type="button"
                disabled={pdfImages.length === 0 || isCompilingPdf}
                onClick={handleCompilePdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
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

        {/* ===================================================================
            PDF SUITE: TAB 3 - MERGE PDFS
        =================================================================== */}
        {activeSuite === "pdf" && activePdfTab === "mergePdf" && (
          <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Merge Multiple PDF Documents
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-black text-xs font-semibold cursor-pointer"
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
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#161922] border border-gray-200 dark:border-white/10"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate block">
                          {item.name}
                        </span>
                        <span className="text-[10.5px] text-gray-500">
                          {formatBytes(item.size)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMergeFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => mergeInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <Layers size={28} className="text-gray-400 mb-2" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Click or Drop 2+ PDF Documents
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
              <button
                type="button"
                disabled={mergeFiles.length === 0}
                onClick={() => setMergeFiles([])}
                className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer disabled:opacity-30"
              >
                Clear All
              </button>

              <button
                type="button"
                disabled={mergeFiles.length < 2 || isMergingPdf}
                onClick={handleExecuteMerge}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
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

        {/* ===================================================================
            PDF SUITE: TAB 4 - SPLIT / EXTRACT PAGES
        =================================================================== */}
        {activeSuite === "pdf" && activePdfTab === "splitPdf" && (
          <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
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
                        <span className="text-[10.5px] text-gray-500">
                          {formatBytes(splitFile.size)} • PDF Document
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => splitInputRef.current?.click()}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer"
                    >
                      Change File
                    </button>
                  </div>

                  {splitTotalPages > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                        Quick Select:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setSplitPageRange(`1-${splitTotalPages}`)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] text-[11px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                          All (1-{splitTotalPages})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSplitPageRange("1")}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] text-[11px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                          Page 1
                        </button>
                        {splitTotalPages > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setSplitPageRange(`1-${Math.ceil(splitTotalPages / 2)}`)}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] text-[11px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              First Half (1-{Math.ceil(splitTotalPages / 2)})
                            </button>
                            <button
                              type="button"
                              onClick={() => setSplitPageRange(`${splitTotalPages}`)}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] text-[11px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
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
                  className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer"
                >
                  <Scissors size={28} className="text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    Select or Drop a PDF File
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Pages to Extract
                  </label>
                  {splitTotalPages > 0 && (
                    <span className="text-[11px] font-medium text-gray-400">
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
                  placeholder={splitTotalPages > 0 ? `e.g. 1, 3-${Math.min(splitTotalPages, 5)}` : "e.g. 1, 3-5"}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white"
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
              <span className="text-[11px] text-gray-400">100% Client-Side Processing</span>

              <button
                type="button"
                disabled={!splitFile || isSplittingPdf}
                onClick={handleExecuteSplit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
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
    </div>
  );
}
