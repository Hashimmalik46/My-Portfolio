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
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
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
  compressPdfDocument,
  PDF_COMPRESSION_PRESETS,
  convertPdfToDocx,
  convertDocxToPdf,
} from "../services/imageProcessor";
import { triggerFileDownload } from "../services/mediaDownloader";

export default function OmniMediaStudio() {
  // Progressive Navigation: 'hub' (Level 1: 2 main cards) | 'suite' (Level 2: suite tools grid) | 'tool' (Level 3: focused workspace)
  const [currentView, setCurrentView] = useState("hub");

  // Main Suite Switcher: 'image' | 'pdf'
  const [activeSuite, setActiveSuite] = useState("image");

  // Sub-tabs for Image Suite: 'compressor' | 'converter' | 'resizer'
  const [activeImageTab, setActiveImageTab] = useState("compressor");

  // Sub-tabs for PDF Suite: 'compressPdf' | 'pdfToDocx' | 'docxToPdf' | 'pdfToImg' | 'imgToPdf' | 'mergePdf' | 'splitPdf'
  const [activePdfTab, setActivePdfTab] = useState("compressPdf");

  const handleOpenSuite = (suiteId) => {
    setActiveSuite(suiteId);
    setCurrentView("suite");
  };

  const handleOpenTool = (suiteId, toolId) => {
    setActiveSuite(suiteId);
    if (suiteId === "image") {
      setActiveImageTab(toolId);
    } else {
      setActivePdfTab(toolId);
    }
    setCurrentView("tool");
  };

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
  // 4. PDF COMPRESSOR STATE (NEW FEATURE)
  // =========================================================================
  const [compressPdfFile, setCompressPdfFile] = useState(null);
  const [pdfCompressPreset, setPdfCompressPreset] = useState("balanced"); // 'extreme' | 'balanced' | 'light' | 'target' | 'custom'
  const [pdfTargetMaxKb, setPdfTargetMaxKb] = useState(0); // 0 = standard presets, >0 = strict KB limit
  const [pdfCustomQuality, setPdfCustomQuality] = useState(70); // 10% - 95%
  const [pdfCustomScale, setPdfCustomScale] = useState(1.2); // 0.5x - 2.0x
  const [pdfCompressResult, setPdfCompressResult] = useState(null);
  const [isCompressingPdfDoc, setIsCompressingPdfDoc] = useState(false);
  const [pdfCompressProgress, setPdfCompressProgress] = useState(null);
  const [pdfCompressError, setPdfCompressError] = useState("");
  const [pdfPreviewActiveIndex, setPdfPreviewActiveIndex] = useState(0);
  const compressPdfInputRef = useRef(null);

  const executePdfCompression = async (fileToCompress, customOpts = {}) => {
    const targetFile = fileToCompress || compressPdfFile;
    if (!targetFile) return;

    setIsCompressingPdfDoc(true);
    setPdfCompressError("");
    setPdfCompressProgress({
      currentPage: 1,
      totalPages: 1,
      percent: 10,
      status: "Analyzing PDF structure...",
    });

    try {
      const preset =
        customOpts.presetId !== undefined
          ? customOpts.presetId
          : pdfCompressPreset;
      const targetKb =
        customOpts.targetMaxKb !== undefined
          ? customOpts.targetMaxKb
          : pdfTargetMaxKb;
      const isCustom = preset === "custom";
      const qualityVal = isCustom
        ? customOpts.quality !== undefined
          ? customOpts.quality
          : pdfCustomQuality / 100
        : null;
      const scaleVal = isCustom
        ? customOpts.scale !== undefined
          ? customOpts.scale
          : pdfCustomScale
        : null;

      const result = await compressPdfDocument(targetFile, {
        presetId: preset,
        targetMaxKb: targetKb > 0 ? targetKb : null,
        quality: qualityVal,
        scale: scaleVal,
        progressCallback: (p) => setPdfCompressProgress(p),
      });

      setPdfCompressResult(result);
      setPdfPreviewActiveIndex(0);
    } catch (err) {
      console.error("PDF compression error:", err);
      setPdfCompressError(
        err.message || "Failed to compress PDF. Please verify the document."
      );
    } finally {
      setIsCompressingPdfDoc(false);
      setPdfCompressProgress(null);
    }
  };

  const handleCompressPdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressPdfFile(file);
    setPdfCompressResult(null);
    setPdfCompressError("");
    setPdfPreviewActiveIndex(0);

    // Trigger initial compression immediately
    executePdfCompression(file, {
      presetId: pdfCompressPreset,
      targetMaxKb: pdfTargetMaxKb,
    });
  };

  const handleDownloadCompressedPdf = () => {
    if (!pdfCompressResult?.blob) return;
    triggerFileDownload(
      pdfCompressResult.blob,
      pdfCompressResult.filename ||
        `compressed_${compressPdfFile?.name || "document.pdf"}`
    );
  };

  // =========================================================================
  // 5. PDF TO DOCX STATE (NEW FEATURE)
  // =========================================================================
  const [pdfToDocxFile, setPdfToDocxFile] = useState(null);
  const [pdfToDocxMode, setPdfToDocxMode] = useState("smartText"); // 'smartText' | 'visualLayout' | 'hybrid'
  const [pdfToDocxResult, setPdfToDocxResult] = useState(null);
  const [isConvertingPdfToDocx, setIsConvertingPdfToDocx] = useState(false);
  const [pdfToDocxProgress, setPdfToDocxProgress] = useState(null);
  const [pdfToDocxError, setPdfToDocxError] = useState("");
  const pdfToDocxInputRef = useRef(null);

  const executePdfToDocx = async (fileToConvert, modeToUse) => {
    const target = fileToConvert || pdfToDocxFile;
    if (!target) return;

    const effectiveMode = modeToUse || pdfToDocxMode;
    setIsConvertingPdfToDocx(true);
    setPdfToDocxError("");
    setPdfToDocxProgress({
      currentPage: 1,
      totalPages: 1,
      percent: 10,
      status: "Initializing conversion...",
    });

    try {
      const result = await convertPdfToDocx(target, {
        mode: effectiveMode,
        progressCallback: (p) => setPdfToDocxProgress(p),
      });
      setPdfToDocxResult(result);
    } catch (err) {
      console.error("PDF to DOCX error:", err);
      setPdfToDocxError(
        err.message || "Failed to convert PDF to DOCX format."
      );
    } finally {
      setIsConvertingPdfToDocx(false);
      setPdfToDocxProgress(null);
    }
  };

  const handlePdfToDocxUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfToDocxFile(file);
    setPdfToDocxResult(null);
    setPdfToDocxError("");
    executePdfToDocx(file, pdfToDocxMode);
  };

  const handleDownloadPdfToDocx = () => {
    if (!pdfToDocxResult?.blob) return;
    triggerFileDownload(
      pdfToDocxResult.blob,
      pdfToDocxResult.filename ||
        `${pdfToDocxFile?.name?.replace(/\.[^/.]+$/, "") || "document"}.docx`
    );
  };

  // =========================================================================
  // 6. DOCX TO PDF STATE (NEW FEATURE)
  // =========================================================================
  const [docxToPdfFile, setDocxToPdfFile] = useState(null);
  const [docxToPdfOrientation, setDocxToPdfOrientation] = useState("portrait");
  const [docxToPdfResult, setDocxToPdfResult] = useState(null);
  const [isConvertingDocxToPdf, setIsConvertingDocxToPdf] = useState(false);
  const [docxToPdfProgress, setDocxToPdfProgress] = useState(null);
  const [docxToPdfError, setDocxToPdfError] = useState("");
  const docxToPdfInputRef = useRef(null);

  const executeDocxToPdf = async (fileToConvert, orient) => {
    const target = fileToConvert || docxToPdfFile;
    if (!target) return;

    setIsConvertingDocxToPdf(true);
    setDocxToPdfError("");
    setDocxToPdfProgress({
      percent: 15,
      status: "Unpacking Word document...",
    });

    try {
      const result = await convertDocxToPdf(target, {
        orientation: orient || docxToPdfOrientation,
        progressCallback: (p) => setDocxToPdfProgress(p),
      });
      setDocxToPdfResult(result);
    } catch (err) {
      console.error("DOCX to PDF error:", err);
      setDocxToPdfError(
        err.message || "Failed to convert DOCX document to PDF."
      );
    } finally {
      setIsConvertingDocxToPdf(false);
      setDocxToPdfProgress(null);
    }
  };

  const handleDocxToPdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocxToPdfFile(file);
    setDocxToPdfResult(null);
    setDocxToPdfError("");
    executeDocxToPdf(file, docxToPdfOrientation);
  };

  const handleDownloadDocxToPdf = () => {
    if (!docxToPdfResult?.blob) return;
    triggerFileDownload(
      docxToPdfResult.blob,
      docxToPdfResult.filename ||
        `${docxToPdfFile?.name?.replace(/\.[^/.]+$/, "") || "document"}.pdf`
    );
  };

  // =========================================================================
  // 7. PDF TO IMAGES STATE
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

  // Tools Configurations with soft pastel / neutral themes
  const imageToolsConfig = [
    {
      id: "compressor",
      label: "Image Compressor",
      shortLabel: "Compressor",
      tag: "Size Limit",
      icon: Minimize2,
      description: "Reduce image file size with quality sliders or strict target KB limits.",
      cardBg:
        "bg-[#f4f9f6] dark:bg-[#111915] border-emerald-200/60 dark:border-emerald-900/30 hover:border-emerald-400/60 dark:hover:border-emerald-700/50",
      iconBg:
        "bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300",
      tagBg:
        "bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300",
    },
    {
      id: "converter",
      label: "Format Converter",
      shortLabel: "Converter",
      tag: "Multi-Format",
      icon: RefreshCw,
      description: "Convert images between WebP, PNG, and JPG in seconds.",
      cardBg:
        "bg-[#f3f8fc] dark:bg-[#111722] border-sky-200/60 dark:border-sky-900/30 hover:border-sky-400/60 dark:hover:border-sky-700/50",
      iconBg:
        "bg-sky-100/80 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300",
      tagBg:
        "bg-sky-100/70 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300",
    },
    {
      id: "resizer",
      label: "Passport & Photo Resizer",
      shortLabel: "Passport & Resizer",
      tag: "Visa / ID",
      icon: Camera,
      description: "Create US, Schengen, and Indian passport photos with printable 4x6 sheet.",
      cardBg:
        "bg-[#f8f5fc] dark:bg-[#181324] border-purple-200/60 dark:border-purple-900/30 hover:border-purple-400/60 dark:hover:border-purple-700/50",
      iconBg:
        "bg-purple-100/80 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300",
      tagBg:
        "bg-purple-100/70 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300",
    },
  ];

  const pdfToolsConfig = [
    {
      id: "compressPdf",
      label: "PDF Compressor",
      shortLabel: "Compress PDF",
      tag: "Size Limit",
      icon: Minimize2,
      description: "Compress PDF documents up to 90% with custom target KB limits.",
      cardBg:
        "bg-[#f4f9f6] dark:bg-[#111915] border-emerald-200/60 dark:border-emerald-900/30 hover:border-emerald-400/60 dark:hover:border-emerald-700/50",
      iconBg:
        "bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300",
      tagBg:
        "bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300",
    },
    {
      id: "pdfToDocx",
      label: "PDF to Word (.docx)",
      shortLabel: "PDF to DOCX",
      tag: "Word Export",
      icon: FileText,
      description: "Convert PDF documents into editable Microsoft Word (.docx) files.",
      cardBg:
        "bg-[#f3f7fc] dark:bg-[#111622] border-blue-200/60 dark:border-blue-900/30 hover:border-blue-400/60 dark:hover:border-blue-700/50",
      iconBg:
        "bg-blue-100/80 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300",
      tagBg:
        "bg-blue-100/70 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300",
    },
    {
      id: "docxToPdf",
      label: "Word (.docx) to PDF",
      shortLabel: "DOCX to PDF",
      tag: "Word to PDF",
      icon: FilePlus2,
      description: "Convert Microsoft Word (.docx) files into clean, standard A4 PDFs.",
      cardBg:
        "bg-[#f5f4fb] dark:bg-[#151324] border-indigo-200/60 dark:border-indigo-900/30 hover:border-indigo-400/60 dark:hover:border-indigo-700/50",
      iconBg:
        "bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300",
      tagBg:
        "bg-indigo-100/70 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300",
    },
    {
      id: "pdfToImg",
      label: "PDF to High-Res Images",
      shortLabel: "PDF to Images",
      tag: "High-Res",
      icon: Grid,
      description: "Extract every page of a PDF into PNG or JPG with 1-click ZIP export.",
      cardBg:
        "bg-[#fbf7f0] dark:bg-[#1c1710] border-amber-200/60 dark:border-amber-900/30 hover:border-amber-400/60 dark:hover:border-amber-700/50",
      iconBg:
        "bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300",
      tagBg:
        "bg-amber-100/70 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300",
    },
    {
      id: "imgToPdf",
      label: "Photos to PDF Document",
      shortLabel: "Images to PDF",
      tag: "Compile",
      icon: FilePlus2,
      description: "Combine multiple photos or document scans into a single A4 PDF.",
      cardBg:
        "bg-[#faf4f6] dark:bg-[#1c1319] border-rose-200/60 dark:border-rose-900/30 hover:border-rose-400/60 dark:hover:border-rose-700/50",
      iconBg:
        "bg-rose-100/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300",
      tagBg:
        "bg-rose-100/70 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300",
    },
    {
      id: "mergePdf",
      label: "Merge Multiple PDFs",
      shortLabel: "Merge PDFs",
      tag: "Combine",
      icon: Layers,
      description: "Combine two or more separate PDF files into a seamless document.",
      cardBg:
        "bg-[#f2f8f8] dark:bg-[#11191a] border-teal-200/60 dark:border-teal-900/30 hover:border-teal-400/60 dark:hover:border-teal-700/50",
      iconBg:
        "bg-teal-100/80 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300",
      tagBg:
        "bg-teal-100/70 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300",
    },
    {
      id: "splitPdf",
      label: "Split & Extract Pages",
      shortLabel: "Split Pages",
      tag: "Extract",
      icon: Scissors,
      description: "Extract specific page numbers or page ranges into a separate PDF.",
      cardBg:
        "bg-[#f6f7f9] dark:bg-[#15171d] border-slate-200/60 dark:border-slate-800/30 hover:border-slate-400/60 dark:hover:border-slate-700/50",
      iconBg:
        "bg-slate-200/80 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300",
      tagBg:
        "bg-slate-200/70 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300",
    },
  ];

  return (
    <div className="relative w-full max-w-5xl min-h-0 sm:min-h-[580px] lg:min-h-[620px] my-auto flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-[#11131b] border border-gray-200 dark:border-white/[0.08] overflow-hidden z-10 font-jakarta shadow-2xl transition-colors duration-200">
      {/* ===================================================================
          LEVEL 1: MAIN STUDIO HUB (2 SLEEK PASTEL / NEUTRAL CARDS)
      =================================================================== */}
      {currentView === "hub" && (
        <div className="flex-1 flex flex-col justify-between p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2 sm:space-y-3 pt-2 sm:pt-4 pb-1">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-[10.5px] sm:text-[11px] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              <ShieldCheck size={13} className="text-gray-700 dark:text-gray-300 shrink-0 inline-block align-middle -mt-[1px]" />
              <span className="inline-block align-middle">100% Private • Runs On Your Device</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-clash tracking-tight">
              Image & PDF Studio
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
              Fast, private media optimizer and document workstation.
            </p>
          </div>

          {/* 2 Simple Minimal Pastel Cards - Optimized Spacing & Padding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-7 max-w-3xl mx-auto w-full my-auto">
            {/* 1. Image Studio Card (Warm Amber / Sand Pastel) */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18 }}
              onClick={() => handleOpenSuite("image")}
              className="group relative rounded-2xl sm:rounded-3xl bg-[#faf6f0] dark:bg-[#1a1612] hover:bg-[#f6eee3] dark:hover:bg-[#201a15] border border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600/50 p-5 sm:p-7 md:p-8 flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200 min-h-0 sm:min-h-[230px] md:min-h-[250px]"
            >
              <div className="space-y-3.5 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 flex items-center justify-center shadow-2xs">
                    <ImageIcon size={20} className="sm:w-[22px] sm:h-[22px]" />
                  </div>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-[11px] sm:text-xs font-bold">
                    3 Tools
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white font-clash flex items-center gap-1.5">
                    <span>Image Studio</span>
                    <ArrowUpRight
                      size={15}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-amber-900 dark:text-amber-300"
                    />
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                    Compress images with target KB limits, convert between WebP/PNG/JPG, and resize passport photos.
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-7 pt-3 sm:pt-4 border-t border-amber-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                <span className="group-hover:underline">Open Image Studio ➔</span>
                <span className="text-[10.5px] sm:text-[11px] text-amber-800/60 dark:text-amber-400/60 font-mono">100% In-Browser</span>
              </div>
            </motion.div>

            {/* 2. PDF Suite Card (Cool Indigo / Lavender Pastel) */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18 }}
              onClick={() => handleOpenSuite("pdf")}
              className="group relative rounded-2xl sm:rounded-3xl bg-[#f4f5fb] dark:bg-[#131522] hover:bg-[#ebedf8] dark:hover:bg-[#171a2a] border border-indigo-200/80 dark:border-indigo-900/40 hover:border-indigo-400 dark:hover:border-indigo-600/50 p-5 sm:p-7 md:p-8 flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200 min-h-0 sm:min-h-[230px] md:min-h-[250px]"
            >
              <div className="space-y-3.5 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-300 flex items-center justify-center shadow-2xs">
                    <FileText size={20} className="sm:w-[22px] sm:h-[22px]" />
                  </div>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-indigo-100/90 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 text-[11px] sm:text-xs font-bold">
                    7 Tools
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white font-clash flex items-center gap-1.5">
                    <span>PDF Suite</span>
                    <ArrowUpRight
                      size={15}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-indigo-900 dark:text-indigo-300"
                    />
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                    Compress PDFs, convert to & from Word (.docx), extract high-res images, merge, and split.
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-7 pt-3 sm:pt-4 border-t border-indigo-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300">
                <span className="group-hover:underline">Open PDF Suite ➔</span>
                <span className="text-[10.5px] sm:text-[11px] text-indigo-800/60 dark:text-indigo-400/60 font-mono">100% In-Browser</span>
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 pt-3 sm:pt-4 border-t border-gray-100 dark:border-white/[0.04] leading-relaxed max-w-md mx-auto">
            <ShieldCheck size={13} className="inline-block -mt-0.5 mr-1 text-emerald-600 dark:text-emerald-400 shrink-0 align-middle" />
            <span className="align-middle">Your files stay on your device and are never uploaded to any server.</span>
          </p>
        </div>
      )}

      {/* ===================================================================
          LEVEL 2: SUITE HUB (MINIMAL PASTEL CARDS GRID)
      =================================================================== */}
      {currentView === "suite" && (
        <div className="flex-1 flex flex-col p-5 sm:p-6 space-y-5">
          {/* Suite Top Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setCurrentView("hub")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.08] dark:hover:bg-white/15 text-xs font-semibold text-gray-800 dark:text-white transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft size={13} />
                <span>Studio Hub</span>
              </button>
              <span className="text-gray-300 dark:text-white/20">/</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-clash truncate">
                {activeSuite === "image" ? "Image Studio" : "PDF Suite"}
              </span>
            </div>

            {/* Switch Suite Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-white/[0.06] p-1 rounded-xl border border-gray-200 dark:border-white/10 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveSuite("image")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeSuite === "image"
                    ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                Image Studio (3)
              </button>
              <button
                type="button"
                onClick={() => setActiveSuite("pdf")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeSuite === "pdf"
                    ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                PDF Suite (7)
              </button>
            </div>
          </div>

          {/* Simple Minimal Pastel Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-start content-start auto-rows-max overflow-y-auto pr-1 py-1">
            {(activeSuite === "image" ? imageToolsConfig : pdfToolsConfig).map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.16 }}
                  onClick={() => handleOpenTool(activeSuite, tool.id)}
                  className={`group rounded-2xl border p-4 sm:p-5 flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200 h-auto ${tool.cardBg}`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs ${tool.iconBg}`}
                      >
                        <Icon size={17} />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${tool.tagBg}`}
                      >
                        {tool.tag}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash flex items-center justify-between">
                        <span>{tool.label}</span>
                        <ArrowUpRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 dark:text-gray-400"
                        />
                      </h4>
                      <p className="text-[11.5px] text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between text-[11px] font-semibold text-gray-800 dark:text-gray-200 group-hover:underline">
                    <span>Open Tool ➔</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================
          LEVEL 3: FOCUSED TOOL WORKSPACE (ACTIVE TOOL CANVAS)
      =================================================================== */}
      {currentView === "tool" && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tool Workspace Top Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#11131b] shrink-0 transition-colors duration-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setCurrentView("suite")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.08] dark:hover:bg-white/15 text-xs font-semibold text-gray-800 dark:text-white transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft size={13} />
                <span>Back to {activeSuite === "image" ? "Image Studio" : "PDF Suite"}</span>
              </button>

              <span className="text-gray-300 dark:text-white/20">/</span>

              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-clash truncate">
                {activeSuite === "image"
                  ? imageToolsConfig.find((t) => t.id === activeImageTab)?.label || "Image Tool"
                  : pdfToolsConfig.find((t) => t.id === activePdfTab)?.label || "PDF Tool"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView("hub")}
              className="text-xs text-gray-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer hidden sm:inline"
            >
              Studio Hub
            </button>
          </div>

          {/* Active Tool Canvas */}
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

                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCompressorFile(null);
                      setCompressResult(null);
                    }}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer shrink-0"
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
                    className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
                  >
                    <Download size={13} className="shrink-0" />
                    <span>
                      Download <span className="hidden sm:inline">Compressed</span>{" "}
                      <span className="font-mono opacity-90">({compressResult ? formatBytes(compressResult.size) : "..."})</span>
                    </span>
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
                      <span>Printable 4x6"<span className="hidden sm:inline"> Sheet</span></span>
                    </button>

                    {/* Single Photo Download */}
                    <button
                      type="button"
                      onClick={handleDownloadResizedSingle}
                      className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download <span className="hidden sm:inline">Single</span> Photo</span>
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
            PDF SUITE: TAB 1 - PDF COMPRESSOR (NEW FEATURE)
        =================================================================== */}
        {activeSuite === "pdf" && activePdfTab === "compressPdf" && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-clash">
                      Precision PDF Compressor
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      Up to 90% Reduction
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Reduce PDF file size with live byte reduction metrics, quality presets, or strict portal limits.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={compressPdfInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCompressPdfUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => compressPdfInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>{compressPdfFile ? "Change PDF" : "Select PDF Document"}</span>
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                {/* Mode / Preset / Target KB */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Compression Mode / Limit
                    </label>
                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {pdfTargetMaxKb > 0 ? `< ${pdfTargetMaxKb} KB` : pdfCompressPreset.toUpperCase()}
                    </span>
                  </div>
                  <select
                    value={pdfTargetMaxKb > 0 ? `target_${pdfTargetMaxKb}` : pdfCompressPreset}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith("target_")) {
                        const kb = Number(val.replace("target_", ""));
                        setPdfTargetMaxKb(kb);
                        setPdfCompressPreset("target");
                        if (compressPdfFile) {
                          executePdfCompression(compressPdfFile, { presetId: "target", targetMaxKb: kb });
                        }
                      } else if (val === "custom") {
                        setPdfTargetMaxKb(0);
                        setPdfCompressPreset("custom");
                        if (compressPdfFile) {
                          executePdfCompression(compressPdfFile, {
                            presetId: "custom",
                            quality: pdfCustomQuality / 100,
                            scale: pdfCustomScale,
                          });
                        }
                      } else {
                        setPdfTargetMaxKb(0);
                        setPdfCompressPreset(val);
                        if (compressPdfFile) {
                          executePdfCompression(compressPdfFile, { presetId: val, targetMaxKb: 0 });
                        }
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value="balanced">⚖️ Recommended (~60-80% Reduction)</option>
                    <option value="extreme">⚡ Extreme Compression (~85-95% Reduction)</option>
                    <option value="light">💎 Light Compression (~40-60% Reduction)</option>
                    <option value="target_100">🎯 Strict &lt; 100 KB (Govt Strict Limit)</option>
                    <option value="target_200">🎯 Strict &lt; 200 KB (Passport & Visa Portal)</option>
                    <option value="target_500">🎯 Strict &lt; 500 KB (Job Application Portal)</option>
                    <option value="target_1000">🎯 Strict &lt; 1 MB (Email Standard)</option>
                    <option value="target_2000">🎯 Strict &lt; 2 MB (Web Portal Standard)</option>
                    <option value="custom">🛠️ Custom (Manual Sliders Mode)</option>
                  </select>
                </div>

                {/* Quality Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Quality: {pdfCompressPreset === "custom" ? `${pdfCustomQuality}%` : pdfCompressPreset === "extreme" ? "35% (Lowest)" : pdfCompressPreset === "light" ? "70% (High)" : "48% (Balanced)"}
                    </label>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="95"
                    disabled={pdfCompressPreset !== "custom"}
                    value={pdfCustomQuality}
                    onChange={(e) => setPdfCustomQuality(Number(e.target.value))}
                    onPointerUp={(e) => {
                      if (compressPdfFile && pdfCompressPreset === "custom") {
                        executePdfCompression(compressPdfFile, {
                          presetId: "custom",
                          quality: Number(e.target.value) / 100,
                          scale: pdfCustomScale,
                        });
                      }
                    }}
                    className="w-full accent-black dark:accent-white cursor-pointer disabled:opacity-40"
                  />
                </div>

                {/* Resolution Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Scale Resolution: {pdfCompressPreset === "custom" ? `${Math.round(pdfCustomScale * 100)}%` : pdfCompressPreset === "extreme" ? "72%" : pdfCompressPreset === "light" ? "110%" : "88%"}
                    </label>
                    {compressPdfFile && (
                      <button
                        type="button"
                        onClick={() => executePdfCompression()}
                        disabled={isCompressingPdfDoc}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer disabled:opacity-40"
                      >
                        Re-Compress
                      </button>
                    )}
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="1.8"
                    step="0.05"
                    disabled={pdfCompressPreset !== "custom"}
                    value={pdfCustomScale}
                    onChange={(e) => setPdfCustomScale(Number(e.target.value))}
                    onPointerUp={(e) => {
                      if (compressPdfFile && pdfCompressPreset === "custom") {
                        executePdfCompression(compressPdfFile, {
                          presetId: "custom",
                          quality: pdfCustomQuality / 100,
                          scale: Number(e.target.value),
                        });
                      }
                    }}
                    className="w-full accent-black dark:accent-white cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            {compressPdfFile ? (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                {/* Result Top Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="font-bold text-xs text-gray-900 dark:text-white truncate max-w-[200px]">
                      {compressPdfFile.name}
                    </span>
                    {pdfCompressResult && (
                      <>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-bold">
                          {pdfCompressResult.numPages} {pdfCompressResult.numPages === 1 ? "Page" : "Pages"}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="text-gray-400 line-through">
                            {formatBytes(pdfCompressResult.originalSize)}
                          </span>
                          <span className="text-black dark:text-white font-bold">➔</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {formatBytes(pdfCompressResult.compressedSize)}
                          </span>
                          {pdfCompressResult.reductionPercent > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                              -{pdfCompressResult.reductionPercent}% Saved
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {pdfCompressResult && (
                    <button
                      type="button"
                      onClick={handleDownloadCompressedPdf}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <Download size={13} />
                      <span>Download PDF</span>
                    </button>
                  )}
                </div>

                {/* Compressing State or Page Preview */}
                {isCompressingPdfDoc ? (
                  <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center space-y-3 p-6 text-center">
                    <Loader2 size={36} className="animate-spin text-emerald-600" />
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {pdfCompressProgress?.status || "Compressing PDF Document..."}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {pdfCompressProgress?.percent ? `${pdfCompressProgress.percent}% completed` : "Optimizing streams & embedded graphics..."}
                      </p>
                    </div>
                    {/* Progress Track */}
                    <div className="w-full max-w-xs bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-200 rounded-full"
                        style={{ width: `${pdfCompressProgress?.percent || 20}%` }}
                      />
                    </div>
                  </div>
                ) : pdfCompressError ? (
                  <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center space-y-2 p-6 text-center text-red-500">
                    <AlertCircle size={32} />
                    <span className="text-xs font-bold">{pdfCompressError}</span>
                  </div>
                ) : pdfCompressResult?.previewPages && pdfCompressResult.previewPages.length > 0 ? (
                  <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                    {/* Left Thumbnail Strip */}
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-44 max-h-[300px] p-2 bg-gray-50 dark:bg-[#0c0e14] rounded-xl border border-gray-200 dark:border-white/10 shrink-0">
                      {pdfCompressResult.previewPages.map((page, idx) => (
                        <button
                          key={page.pageNum}
                          type="button"
                          onClick={() => setPdfPreviewActiveIndex(idx)}
                          className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer shrink-0 md:shrink flex md:flex-row items-center gap-2 ${
                            pdfPreviewActiveIndex === idx
                              ? "bg-white dark:bg-white/[0.14] border-emerald-500 shadow-xs"
                              : "bg-white dark:bg-[#161922] border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="w-12 h-14 bg-gray-100 dark:bg-black/40 rounded overflow-hidden flex items-center justify-center shrink-0">
                            <img
                              src={page.dataUrl}
                              alt={`Page ${page.pageNum}`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="hidden md:block min-w-0">
                            <span className="text-[11px] font-bold text-gray-900 dark:text-white block">
                              Page {page.pageNum}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {page.width}×{page.height}px
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Right Active Page Full-View Canvas */}
                    <div className="flex-1 bg-gray-100 dark:bg-black/40 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-200 dark:border-white/10 relative overflow-hidden min-h-[220px]">
                      {pdfCompressResult.previewPages[pdfPreviewActiveIndex] && (
                        <>
                          <img
                            src={pdfCompressResult.previewPages[pdfPreviewActiveIndex].dataUrl}
                            alt={`Preview Page ${pdfPreviewActiveIndex + 1}`}
                            className="max-h-[260px] max-w-full object-contain rounded shadow-md"
                          />
                          <div className="absolute bottom-2 left-3 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                            Inspecting Page {pdfPreviewActiveIndex + 1} of {pdfCompressResult.numPages}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setCompressPdfFile(null);
                      setPdfCompressResult(null);
                      setPdfCompressError("");
                    }}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer"
                  >
                    Clear Document
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isCompressingPdfDoc || !compressPdfFile}
                      onClick={() => executePdfCompression()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-900 dark:text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-40"
                    >
                      <RefreshCw size={12} className={isCompressingPdfDoc ? "animate-spin" : ""} />
                      <span>Re-Compress</span>
                    </button>

                    <button
                      type="button"
                      disabled={!pdfCompressResult?.blob || isCompressingPdfDoc}
                      onClick={handleDownloadCompressedPdf}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-40"
                    >
                      <Download size={13} />
                      <span>
                        Download Compressed PDF
                        {pdfCompressResult ? ` (${formatBytes(pdfCompressResult.compressedSize)})` : ""}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => compressPdfInputRef.current?.click()}
                className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Minimize2 size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Select PDF Document to Compress
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                  100% Client-Side In-Browser Compression. Reduce file size up to 90% for Govt Portals, Visa applications, and email limits.
                </p>
                <div className="mt-4 flex items-center gap-2 flex-wrap justify-center text-[10.5px] font-semibold text-gray-600 dark:text-gray-400">
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    ⚡ Up to 90% Reduction
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    🔒 Zero Uploads / Private
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    🏛️ Govt & Job Portal Ready
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PDF SUITE: TAB 2 - PDF TO DOCX (NEW FEATURE)
        =================================================================== */}
        {activeSuite === "pdf" && activePdfTab === "pdfToDocx" && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-clash">
                      PDF to Editable Word (.docx)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                      Editable Paragraphs
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Extract structured paragraphs, headings, bullet points, and text into a Microsoft Word document.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={pdfToDocxInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfToDocxUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => pdfToDocxInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>{pdfToDocxFile ? "Change PDF" : "Select PDF Document"}</span>
                  </button>
                </div>
              </div>

              {/* Conversion Mode Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Word Conversion Mode
                  </label>
                  <select
                    value={pdfToDocxMode}
                    onChange={(e) => {
                      const newMode = e.target.value;
                      setPdfToDocxMode(newMode);
                      if (pdfToDocxFile) {
                        executePdfToDocx(pdfToDocxFile, newMode);
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value="smartText">📝 Smart Editable Text (Reconstructed Flow)</option>
                    <option value="visualLayout">🌟 Exact Visual Layout (Pixel-Perfect Match)</option>
                    <option value="hybrid">⚡ Hybrid Pro (Visual Pages + Editable Text)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 truncate">
                      {pdfToDocxMode === "visualLayout"
                        ? "Preserves tables, graphics & fonts identically"
                        : pdfToDocxMode === "hybrid"
                        ? "Visual replica with editable text stream"
                        : "Accurate character spacing & headings"}
                    </span>
                  </div>
                  {pdfToDocxFile && (
                    <button
                      type="button"
                      onClick={() => executePdfToDocx()}
                      disabled={isConvertingPdfToDocx}
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer disabled:opacity-40 shrink-0 ml-2"
                    >
                      Re-Convert
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            {pdfToDocxFile ? (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="font-bold text-xs text-gray-900 dark:text-white truncate max-w-[220px]">
                      {pdfToDocxFile.name}
                    </span>
                    {pdfToDocxResult && (
                      <>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10.5px] font-bold">
                          {pdfToDocxResult.numPages} Pages Extracted
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-bold">
                          {pdfToDocxResult.mode === "visualLayout"
                            ? "Exact Layout"
                            : `${pdfToDocxResult.totalParagraphs} Paragraphs`}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          Output: {formatBytes(pdfToDocxResult.docxSize)}
                        </span>
                      </>
                    )}
                  </div>

                  {pdfToDocxResult && (
                    <button
                      type="button"
                      onClick={handleDownloadPdfToDocx}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <Download size={13} />
                      <span>Download .DOCX</span>
                    </button>
                  )}
                </div>

                {/* State: Processing, Error, or Preview */}
                {isConvertingPdfToDocx ? (
                  <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center space-y-3 p-6 text-center">
                    <Loader2 size={36} className="animate-spin text-blue-600" />
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {pdfToDocxProgress?.status || "Converting PDF to Word (.docx)..."}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {pdfToDocxProgress?.percent ? `${pdfToDocxProgress.percent}% completed` : "Reconstructing layout and typography..."}
                      </p>
                    </div>
                    <div className="w-full max-w-xs bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-200 rounded-full"
                        style={{ width: `${pdfToDocxProgress?.percent || 25}%` }}
                      />
                    </div>
                  </div>
                ) : pdfToDocxError ? (
                  <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center space-y-2 p-6 text-center text-red-500">
                    <AlertCircle size={32} />
                    <span className="text-xs font-bold">{pdfToDocxError}</span>
                  </div>
                ) : pdfToDocxResult ? (
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Document Content Preview
                      </span>
                      <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {pdfToDocxMode === "visualLayout"
                          ? "✓ High-Fidelity Page Layout Packaged"
                          : "✓ Formatted Text Ready for Word"}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#0c0e14] rounded-xl border border-gray-200 dark:border-white/10 max-h-[240px] overflow-y-auto text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
                      {pdfToDocxResult.textPreview || "Visual document layout packaged into Microsoft Word format with pixel-perfect fidelity."}
                    </div>
                  </div>
                ) : null}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setPdfToDocxFile(null);
                      setPdfToDocxResult(null);
                      setPdfToDocxError("");
                    }}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer"
                  >
                    Clear Document
                  </button>

                  <button
                    type="button"
                    disabled={!pdfToDocxResult?.blob || isConvertingPdfToDocx}
                    onClick={handleDownloadPdfToDocx}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-40"
                  >
                    <Download size={13} />
                    <span>Download Word Document (.docx)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => pdfToDocxInputRef.current?.click()}
                className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <FileText size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Select PDF Document to Convert to Word (.docx)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                  Converts PDF pages into editable Microsoft Word (.docx) documents with extracted headings, paragraphs, and formatting.
                </p>
                <div className="mt-4 flex items-center gap-2 flex-wrap justify-center text-[10.5px] font-semibold text-gray-600 dark:text-gray-400">
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    📝 Editable Text Runs
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    🔒 Zero Uploads / Private
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    💼 MS Word & Google Docs Compatible
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PDF SUITE: TAB 3 - DOCX TO PDF (NEW FEATURE)
        =================================================================== */}
        {activeSuite === "pdf" && activePdfTab === "docxToPdf" && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-clash">
                      Word (.docx) to PDF Converter
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold">
                      Standard A4 PDF
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Convert Microsoft Word (.docx) files into clean, shareable standard PDF documents.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={docxToPdfInputRef}
                    type="file"
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleDocxToPdfUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => docxToPdfInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <UploadCloud size={13} />
                    <span>{docxToPdfFile ? "Change DOCX" : "Select Word Document"}</span>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Page Orientation
                  </label>
                  <select
                    value={docxToPdfOrientation}
                    onChange={(e) => {
                      setDocxToPdfOrientation(e.target.value);
                      if (docxToPdfFile) {
                        executeDocxToPdf(docxToPdfFile, e.target.value);
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value="portrait">📄 Portrait (Standard Letter / A4)</option>
                    <option value="landscape">📑 Landscape (Wide Format)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                      Standard Print Typography & Margins
                    </span>
                  </div>
                  {docxToPdfFile && (
                    <button
                      type="button"
                      onClick={() => executeDocxToPdf()}
                      disabled={isConvertingDocxToPdf}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer disabled:opacity-40"
                    >
                      Re-Convert
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            {docxToPdfFile ? (
              <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="font-bold text-xs text-gray-900 dark:text-white truncate max-w-[220px]">
                      {docxToPdfFile.name}
                    </span>
                    {docxToPdfResult && (
                      <>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-bold">
                          {docxToPdfResult.pageCount} {docxToPdfResult.pageCount === 1 ? "Page" : "Pages"} Generated
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          PDF Size: {formatBytes(docxToPdfResult.pdfSize)}
                        </span>
                      </>
                    )}
                  </div>

                  {docxToPdfResult && (
                    <button
                      type="button"
                      onClick={handleDownloadDocxToPdf}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <Download size={13} />
                      <span>Download PDF</span>
                    </button>
                  )}
                </div>

                {isConvertingDocxToPdf ? (
                  <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center space-y-3 p-6 text-center">
                    <Loader2 size={36} className="animate-spin text-indigo-600" />
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {docxToPdfProgress?.status || "Converting Word Document to PDF..."}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {docxToPdfProgress?.percent ? `${docxToPdfProgress.percent}% completed` : "Parsing Word OpenXML body..."}
                      </p>
                    </div>
                    <div className="w-full max-w-xs bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full transition-all duration-200 rounded-full"
                        style={{ width: `${docxToPdfProgress?.percent || 30}%` }}
                      />
                    </div>
                  </div>
                ) : docxToPdfError ? (
                  <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center space-y-2 p-6 text-center text-red-500">
                    <AlertCircle size={32} />
                    <span className="text-xs font-bold">{docxToPdfError}</span>
                  </div>
                ) : docxToPdfResult ? (
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Extracted Document Text
                      </span>
                      <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                        ✓ Formatted for PDF
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#0c0e14] rounded-xl border border-gray-200 dark:border-white/10 max-h-[240px] overflow-y-auto text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
                      {docxToPdfResult.textPreview || "Word document paragraphs successfully formatted into PDF."}
                    </div>
                  </div>
                ) : null}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setDocxToPdfFile(null);
                      setDocxToPdfResult(null);
                      setDocxToPdfError("");
                    }}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer"
                  >
                    Clear Document
                  </button>

                  <button
                    type="button"
                    disabled={!docxToPdfResult?.blob || isConvertingDocxToPdf}
                    onClick={handleDownloadDocxToPdf}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-40"
                  >
                    <Download size={13} />
                    <span>Download PDF ({docxToPdfResult ? formatBytes(docxToPdfResult.pdfSize) : ""})</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => docxToPdfInputRef.current?.click()}
                className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white/50 bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <FilePlus2 size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-clash">
                  Select Word Document (.docx) to Convert to PDF
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                  100% Client-Side In-Browser Conversion. Converts Microsoft Word documents into clean, standard A4 PDF files.
                </p>
                <div className="mt-4 flex items-center gap-2 flex-wrap justify-center text-[10.5px] font-semibold text-gray-600 dark:text-gray-400">
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    📄 Standard A4 Layout
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    🔒 Zero Uploads / Private
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                    ✨ Clean Font Typography
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PDF SUITE: TAB 4 - PDF TO IMAGES
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
      )}
    </div>
  );
}
