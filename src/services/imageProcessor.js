/**
 * Client-Side Image Processor & PDF Studio Engine
 * Zero-upload, 100% private, browser-based image conversions, compression,
 * passport resizing, AI background removal, and PDF operations.
 */
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { triggerFileDownload } from "./mediaDownloader";

// Configure PDF.js Worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    pdfWorkerUrl ||
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "4.10.38"}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn("PDF.js worker fallback initialization:", e);
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
}

/**
 * Standard Passport, ID, and Social Media Resizer Presets
 */
export const PASSPORT_PRESETS = [
  {
    id: "us-passport",
    category: "passport",
    name: "US Passport / Visa",
    country: "🇺🇸 United States",
    widthMm: 51,
    heightMm: 51,
    widthIn: 2,
    heightIn: 2,
    px300Dpi: { width: 600, height: 600 },
    aspectRatio: "1:1",
    description: "2 x 2 inches (51 x 51 mm) @ 300 DPI",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "india-passport",
    category: "passport",
    name: "Indian Passport / Visa / OCI",
    country: "🇮🇳 India",
    widthMm: 35,
    heightMm: 45,
    widthIn: 1.38,
    heightIn: 1.77,
    px300Dpi: { width: 413, height: 531 },
    aspectRatio: "35:45",
    description: "35 x 45 mm @ 300 DPI, White background",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "india-pan",
    category: "passport",
    name: "Indian PAN Card / Govt Photo",
    country: "🇮🇳 India",
    widthMm: 25,
    heightMm: 35,
    widthIn: 0.98,
    heightIn: 1.38,
    px300Dpi: { width: 295, height: 413 },
    aspectRatio: "25:35",
    description: "2.5 x 3.5 cm (295 x 413 px) standard ID",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "india-signature",
    category: "passport",
    name: "Govt Signature / Stamp Card",
    country: "🇮🇳 India",
    widthMm: 20,
    heightMm: 45,
    widthIn: 0.79,
    heightIn: 1.77,
    px300Dpi: { width: 236, height: 531 },
    aspectRatio: "20:45",
    description: "2 x 4.5 cm (Govt portals & exams)",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "eu-schengen",
    category: "passport",
    name: "Schengen / EU / UK Passport",
    country: "🇪🇺 Europe / UK",
    widthMm: 35,
    heightMm: 45,
    widthIn: 1.38,
    heightIn: 1.77,
    px300Dpi: { width: 413, height: 531 },
    aspectRatio: "35:45",
    description: "35 x 45 mm @ 300 DPI, Light Gray/White BG",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "canada-passport",
    category: "passport",
    name: "Canadian Passport / Visa",
    country: "🇨🇦 Canada",
    widthMm: 50,
    heightMm: 70,
    widthIn: 1.97,
    heightIn: 2.76,
    px300Dpi: { width: 590, height: 826 },
    aspectRatio: "5:7",
    description: "50 x 70 mm @ 300 DPI",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "australia-passport",
    category: "passport",
    name: "Australian Passport",
    country: "🇦🇺 Australia",
    widthMm: 35,
    heightMm: 45,
    widthIn: 1.38,
    heightIn: 1.77,
    px300Dpi: { width: 413, height: 531 },
    aspectRatio: "35:45",
    description: "35 x 45 mm @ 300 DPI",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "stamp-photo",
    category: "passport",
    name: "Stamp Size Photo",
    country: "🌐 Universal",
    widthMm: 25,
    heightMm: 30,
    widthIn: 0.98,
    heightIn: 1.18,
    px300Dpi: { width: 295, height: 354 },
    aspectRatio: "25:30",
    description: "25 x 30 mm (Stamp size photo)",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "square-id",
    category: "passport",
    name: "1.5 x 1.5 inch ID Photo",
    country: "🌐 Universal",
    widthMm: 38,
    heightMm: 38,
    widthIn: 1.5,
    heightIn: 1.5,
    px300Dpi: { width: 450, height: 450 },
    aspectRatio: "1:1",
    description: "1.5 x 1.5 inches @ 300 DPI",
    recommendedBg: "#FFFFFF",
  },
];

export const SOCIAL_PRESETS = [
  {
    id: "ig-square",
    category: "social",
    name: "Instagram Post (Square 1:1)",
    platform: "Instagram",
    width: 1080,
    height: 1080,
    description: "1080 x 1080 px",
  },
  {
    id: "ig-portrait",
    category: "social",
    name: "Instagram Post (Portrait 4:5)",
    platform: "Instagram",
    width: 1080,
    height: 1350,
    description: "1080 x 1350 px",
  },
  {
    id: "ig-story",
    category: "social",
    name: "Instagram Story / Reel (9:16)",
    platform: "Instagram",
    width: 1080,
    height: 1920,
    description: "1080 x 1920 px",
  },
  {
    id: "linkedin-pfp",
    category: "social",
    name: "LinkedIn Profile Avatar",
    platform: "LinkedIn",
    width: 400,
    height: 400,
    description: "400 x 400 px",
  },
  {
    id: "linkedin-banner",
    category: "social",
    name: "LinkedIn Cover Banner",
    platform: "LinkedIn",
    width: 1584,
    height: 396,
    description: "1584 x 396 px",
  },
  {
    id: "yt-thumb",
    category: "social",
    name: "YouTube HD Thumbnail",
    platform: "YouTube",
    width: 1280,
    height: 720,
    description: "1280 x 720 px (16:9)",
  },
  {
    id: "twitter-header",
    category: "social",
    name: "Twitter / X Banner Header",
    platform: "Twitter / X",
    width: 1500,
    height: 500,
    description: "1500 x 500 px (3:1)",
  },
];

/**
 * Reads a File object and returns an Image element and its metadata
 */
export const loadImageFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          img,
          dataUrl: e.target.result,
          file,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: file.type,
          originalSize: file.size,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Compresses and converts an image using HTML5 Canvas with quality and size target
 */
export const compressAndConvertImage = async (img, options = {}) => {
  const {
    format = "image/jpeg",
    quality = 0.82,
    width = img.naturalWidth || img.width,
    height = img.naturalHeight || img.height,
    targetMaxKb = null, // e.g. 50 or 100 (for strict government portal file limits)
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not initialize 2D canvas context");
  }

  if (format === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // If no target KB is set, perform standard single-pass export
  if (!targetMaxKb || targetMaxKb <= 0 || format === "image/png") {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image conversion failed"));
            return;
          }
          const dataUrl = canvas.toDataURL(format, quality);
          resolve({
            blob,
            dataUrl,
            size: blob.size,
            width: canvas.width,
            height: canvas.height,
          });
        },
        format,
        quality
      );
    });
  }

  // Iterative binary search for target file size
  const maxBytes = targetMaxKb * 1024;
  let minQ = 0.05;
  let maxQ = Math.min(quality, 0.98);
  let bestBlob = null;
  let bestDataUrl = "";
  let bestQuality = maxQ;

  for (let iter = 0; iter < 7; iter++) {
    const testQ = (minQ + maxQ) / 2;
    const blob = await new Promise((res) => canvas.toBlob(res, format, testQ));
    if (!blob) break;

    if (blob.size <= maxBytes) {
      bestBlob = blob;
      bestQuality = testQ;
      minQ = testQ; // try higher quality while staying under limit
    } else {
      maxQ = testQ; // reduce quality
    }
  }

  if (!bestBlob) {
    bestBlob = await new Promise((res) => canvas.toBlob(res, format, 0.1));
  }

  bestDataUrl = canvas.toDataURL(format, bestQuality);

  return {
    blob: bestBlob,
    dataUrl: bestDataUrl,
    size: bestBlob.size,
    width: canvas.width,
    height: canvas.height,
  };
};

/**
 * Resizes and crops image for Passport, ID, and Social presets with zoom, pan, and fill options
 */
export const resizeAndCropImage = async (img, options = {}) => {
  const {
    targetWidth = 600,
    targetHeight = 600,
    fitMode = "cover", // 'cover' | 'contain' | 'stretch'
    bgColor = "#FFFFFF",
    zoom = 1, // 1 to 3
    offsetX = 0, // -100 to 100 percentage
    offsetY = 0, // -100 to 100 percentage
    format = "image/jpeg",
    quality = 0.92,
    targetMaxKb = null,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Background Fill
  if (format === "image/png" && (bgColor === "transparent" || !bgColor)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = bgColor || "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  if (fitMode === "stretch") {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else if (fitMode === "contain") {
    const scale = Math.min(canvas.width / imgW, canvas.height / imgH) * zoom;
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const panX = (offsetX / 100) * (canvas.width / 2);
    const panY = (offsetY / 100) * (canvas.height / 2);
    const x = (canvas.width - drawW) / 2 + panX;
    const y = (canvas.height - drawH) / 2 + panY;
    ctx.drawImage(img, x, y, drawW, drawH);
  } else {
    // "cover" (Standard passport / portrait center crop)
    const scale = Math.max(canvas.width / imgW, canvas.height / imgH) * zoom;
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const panX = (offsetX / 100) * (canvas.width / 2);
    const panY = (offsetY / 100) * (canvas.height / 2);
    const x = (canvas.width - drawW) / 2 + panX;
    const y = (canvas.height - drawH) / 2 + panY;
    ctx.drawImage(img, x, y, drawW, drawH);
  }

  // Handle target file size constraint
  if (targetMaxKb && targetMaxKb > 0 && format !== "image/png") {
    const maxBytes = targetMaxKb * 1024;
    let minQ = 0.05;
    let maxQ = Math.min(quality, 0.95);
    let bestBlob = null;
    let bestQuality = maxQ;

    for (let iter = 0; iter < 7; iter++) {
      const testQ = (minQ + maxQ) / 2;
      const blob = await new Promise((res) => canvas.toBlob(res, format, testQ));
      if (!blob) break;
      if (blob.size <= maxBytes) {
        bestBlob = blob;
        bestQuality = testQ;
        minQ = testQ;
      } else {
        maxQ = testQ;
      }
    }

    if (!bestBlob) {
      bestBlob = await new Promise((res) => canvas.toBlob(res, format, 0.1));
    }

    return {
      blob: bestBlob,
      dataUrl: canvas.toDataURL(format, bestQuality),
      size: bestBlob.size,
      width: canvas.width,
      height: canvas.height,
    };
  }

  const blob = await new Promise((res, rej) => {
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Canvas export failed"))), format, quality);
  });

  return {
    blob,
    dataUrl: canvas.toDataURL(format, quality),
    size: blob.size,
    width: canvas.width,
    height: canvas.height,
  };
};

/**
 * Generates a standard printable 4x6" or A4 sheet with multiple tiled passport photos and cutting lines
 */
export const generatePrintablePassportSheet = async (
  photoDataUrl,
  options = {}
) => {
  const {
    sheetFormat = "4x6", // '4x6' (1200x1800 @ 300dpi) or 'a4' (2480x3508 @ 300dpi)
    photoWidthMm = 35,
    photoHeightMm = 45,
  } = options;

  const sheetCanvas = document.createElement("canvas");
  const dpi = 300;
  const mmToPx = (mm) => Math.round((mm / 25.4) * dpi);

  const sheetW = sheetFormat === "4x6" ? 1800 : 2480; // 6x4" horizontal or A4 vertical
  const sheetH = sheetFormat === "4x6" ? 1200 : 3508;

  sheetCanvas.width = sheetW;
  sheetCanvas.height = sheetH;

  const ctx = sheetCanvas.getContext("2d");
  if (!ctx) throw new Error("Sheet canvas failed");

  // Pure White Photo Paper Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, sheetW, sheetH);

  // Load single cropped photo
  const photoImg = new Image();
  await new Promise((resolve, reject) => {
    photoImg.onload = resolve;
    photoImg.onerror = reject;
    photoImg.src = photoDataUrl;
  });

  const pW = mmToPx(photoWidthMm);
  const pH = mmToPx(photoHeightMm);
  const margin = mmToPx(6);
  const gap = mmToPx(4);

  const cols = Math.floor((sheetW - margin * 2 + gap) / (pW + gap));
  const rows = Math.floor((sheetH - margin * 2 + gap) / (pH + gap));

  const totalGridW = cols * pW + (cols - 1) * gap;
  const totalGridH = rows * pH + (rows - 1) * gap;
  const startX = (sheetW - totalGridW) / 2;
  const startY = (sheetH - totalGridH) / 2;

  // Render Grid with Subtle Cutting Lines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (pW + gap);
      const y = startY + r * (pH + gap);

      // Draw Photo
      ctx.drawImage(photoImg, x, y, pW, pH);

      // Draw Thin Cutting Border Line
      ctx.strokeStyle = "#D1D5DB";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(x - 0.5, y - 0.5, pW + 1, pH + 1);
    }
  }

  // Header attribution on bottom edge
  ctx.setLineDash([]);
  ctx.fillStyle = "#9CA3AF";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    `Printable Passport Sheet (${sheetFormat.toUpperCase()}) • 300 DPI High-Res Print`,
    sheetW / 2,
    sheetH - 18
  );

  const blob = await new Promise((res) => sheetCanvas.toBlob(res, "image/jpeg", 0.95));
  triggerFileDownload(
    blob,
    `passport_sheet_${sheetFormat}_${Date.now()}.jpg`
  );
  return true;
};

/**
 * Converts a PDF Document into an array of high-resolution images (PNG, JPEG, WebP)
 */
export const convertPdfToImages = async (file, options = {}) => {
  const {
    format = "image/png", // 'image/png' | 'image/jpeg' | 'image/webp'
    scale = 2.0, // 1.0 (72-96 dpi), 2.0 (150-200 dpi), 3.0 (300 dpi print quality)
    quality = 0.92,
    progressCallback = null,
  } = options;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const pages = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (progressCallback) {
      progressCallback({
        currentPage: pageNum,
        totalPages: numPages,
        percent: Math.round((pageNum / numPages) * 100),
      });
    }

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not initialize page canvas");

    // White background for JPEG / universal display
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error(`Page ${pageNum} render failed`))),
        format,
        quality
      );
    });

    const dataUrl = canvas.toDataURL(format, quality);

    pages.push({
      pageNum,
      blob,
      dataUrl,
      size: blob.size,
      width: canvas.width,
      height: canvas.height,
      ext: format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg",
    });
  }

  return {
    numPages,
    pages,
    filename: file.name.replace(/\.[^/.]+$/, ""),
  };
};

/**
 * Packages all rendered PDF page images into a single ZIP archive
 */
export const downloadAllPagesAsZip = async (
  pagesList,
  zipBaseFilename = "pdf_pages"
) => {
  if (!pagesList || pagesList.length === 0) return false;

  const zip = new JSZip();
  const folderName = zipBaseFilename.replace(/[^a-zA-Z0-9_-]/g, "_");
  const folder = zip.folder(folderName) || zip;

  pagesList.forEach((page) => {
    const ext = page.ext || "png";
    const filename = `page_${String(page.pageNum).padStart(3, "0")}.${ext}`;
    folder.file(filename, page.blob);
  });

  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  triggerFileDownload(zipBlob, `${folderName}_images.zip`);
  return true;
};

/**
 * Formats bytes to human-readable size string
 */
export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Compiles a list of images into a single real PDF document using jsPDF
 */
export const compileImagesToPdf = async (imagesList, options = {}) => {
  if (!imagesList || imagesList.length === 0) return false;

  const { orientation = "portrait", filename = `document_${Date.now()}.pdf` } = options;

  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;

  imagesList.forEach((item, index) => {
    if (index > 0) {
      doc.addPage("a4", orientation);
    }

    const imgWidth = item.width || 800;
    const imgHeight = item.height || 600;
    const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    const posX = margin + (maxWidth - finalWidth) / 2;
    const posY = margin + (maxHeight - finalHeight) / 2;

    doc.addImage(item.dataUrl, "JPEG", posX, posY, finalWidth, finalHeight, undefined, "FAST");
  });

  const pdfBlob = doc.output("blob");
  triggerFileDownload(pdfBlob, filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  return true;
};

/**
 * Merges multiple PDF files into a single unified PDF document
 */
export const mergePdfFiles = async (
  pdfFilesList,
  filename = `merged_document_${Date.now()}.pdf`
) => {
  if (!pdfFilesList || pdfFilesList.length === 0) return false;

  const mergedPdf = await PDFDocument.create();

  for (const item of pdfFilesList) {
    const arrayBuffer = await item.file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(arrayBuffer);
    const pageIndices = sourcePdf.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
  triggerFileDownload(blob, filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  return true;
};

/**
 * Splits / Extracts specific pages from a PDF file
 */
export const splitPdfFile = async (
  file,
  pageRangeStr,
  filename = `extracted_${Date.now()}.pdf`
) => {
  if (!file || !pageRangeStr) return false;

  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();

  const pageIndices = [];
  const parts = pageRangeStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          if (!pageIndices.includes(i - 1)) pageIndices.push(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        if (!pageIndices.includes(pageNum - 1)) pageIndices.push(pageNum - 1);
      }
    }
  }

  if (pageIndices.length === 0) throw new Error("No valid page numbers found");

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  triggerFileDownload(blob, filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  return true;
};

/**
 * Standard PDF Compression Presets
 */
export const PDF_COMPRESSION_PRESETS = [
  {
    id: "extreme",
    name: "Extreme Compression",
    badge: "Max Savings (~75-90%)",
    description: "Lowest file size, ideal for strict portals (< 200 KB) and email limits.",
    scale: 0.85,
    quality: 0.45,
    recommendedFor: "Govt portals, SMS/Email limits, low bandwidth",
  },
  {
    id: "balanced",
    name: "Recommended (Balanced)",
    badge: "Balanced (~50-75%)",
    description: "Optimal balance between small file size and sharp readable text.",
    scale: 1.25,
    quality: 0.68,
    recommendedFor: "Job resumes, portfolios, general documents",
  },
  {
    id: "light",
    name: "Light Compression",
    badge: "High Quality (~30-50%)",
    description: "Preserves high-fidelity text, sharp photos, and detailed graphics.",
    scale: 1.6,
    quality: 0.85,
    recommendedFor: "Design decks, high-res prints, presentations",
  },
  {
    id: "target",
    name: "Target File Size Limit",
    badge: "Strict Target KB",
    description: "Automatically optimizes compression to stay under an exact KB limit.",
    scale: 1.0,
    quality: 0.6,
    recommendedFor: "Strict application thresholds (e.g., < 100 KB, < 500 KB)",
  },
];

/**
 * Compresses a PDF Document client-side with quality presets or strict target size
 */
export const compressPdfDocument = async (file, options = {}) => {
  const {
    presetId = "balanced", // 'extreme' | 'balanced' | 'light' | 'target' | 'custom'
    quality = null, // 0.1 - 1.0
    scale = null, // 0.4 - 2.5
    targetMaxKb = null, // e.g. 200 (for 200 KB)
    progressCallback = null,
    filename = null,
  } = options;

  if (!file) throw new Error("No PDF file provided for compression");

  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  if (numPages === 0) throw new Error("PDF document has 0 pages");

  // Calculate per-page byte budget from original file with safety headroom
  const originalBytesPerPage = originalSize / numPages;
  let targetBytesPerPage = 45 * 1024; // Default balanced ~45 KB / page

  if (targetMaxKb && targetMaxKb > 0) {
    // 15% safety buffer so final output strictly stays below the hard threshold
    const targetBytes = targetMaxKb * 1024 * 0.85;
    targetBytesPerPage = targetBytes / numPages;
  } else if (presetId === "extreme") {
    // Extreme: ~85-95% reduction, capped at max 20KB/page or 400KB total
    targetBytesPerPage = Math.min(originalBytesPerPage * 0.1, 20 * 1024);
  } else if (presetId === "balanced") {
    // Balanced / Recommended: ~60-75% reduction, capped at max 48KB/page or 1.2MB total
    targetBytesPerPage = Math.min(originalBytesPerPage * 0.3, 48 * 1024);
  } else if (presetId === "light") {
    // Light: ~35-50% reduction, capped at max 90KB/page or 2.0MB total
    targetBytesPerPage = Math.min(originalBytesPerPage * 0.5, 90 * 1024);
  }

  // Derive optimal scale and quality based on the target byte budget
  let effectiveScale = 0.82;
  let effectiveQuality = 0.42;

  if (targetBytesPerPage <= 8 * 1024) {
    // Ultra small: < 8 KB / page (Strict < 100 KB on multi-page)
    effectiveScale = 0.35;
    effectiveQuality = 0.12;
  } else if (targetBytesPerPage <= 15 * 1024) {
    // 8 - 15 KB / page (Strict < 100 KB - 200 KB)
    effectiveScale = 0.48;
    effectiveQuality = 0.18;
  } else if (targetBytesPerPage <= 30 * 1024) {
    // 15 - 30 KB / page (Strict < 200 KB - 500 KB)
    effectiveScale = 0.62;
    effectiveQuality = 0.28;
  } else if (targetBytesPerPage <= 60 * 1024) {
    // 30 - 60 KB / page (Strict < 500 KB - 1 MB)
    effectiveScale = 0.78;
    effectiveQuality = 0.40;
  } else if (targetBytesPerPage <= 120 * 1024) {
    // 60 - 120 KB / page (Strict < 1 MB - 2 MB)
    effectiveScale = 0.92;
    effectiveQuality = 0.52;
  } else {
    effectiveScale = 1.15;
    effectiveQuality = 0.68;
  }

  // Override if custom scale or quality is explicitly provided
  if (scale !== null && scale !== undefined) effectiveScale = Number(scale);
  if (quality !== null && quality !== undefined) effectiveQuality = Number(quality);

  // Safety clamps
  effectiveScale = Math.max(0.18, Math.min(2.5, effectiveScale));
  effectiveQuality = Math.max(0.06, Math.min(0.92, effectiveQuality));

  const renderAndBuildPdf = async (renderScale, renderQuality) => {
    const outPdf = await PDFDocument.create();
    const previewPages = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (progressCallback) {
        progressCallback({
          currentPage: pageNum,
          totalPages: numPages,
          percent: Math.round((pageNum / numPages) * 100),
          status: `Compressing page ${pageNum} of ${numPages}...`,
        });
      }

      const page = await pdfDoc.getPage(pageNum);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const ptWidth = unscaledViewport.width;
      const ptHeight = unscaledViewport.height;

      const renderViewport = page.getViewport({ scale: renderScale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(renderViewport.width);
      canvas.height = Math.round(renderViewport.height);

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context for PDF compression");

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport: renderViewport,
      }).promise;

      const imgBytes = await new Promise((resolve) => {
        canvas.toBlob(
          async (blob) => {
            if (!blob) return resolve(null);
            const buf = await blob.arrayBuffer();
            resolve(new Uint8Array(buf));
          },
          "image/jpeg",
          renderQuality
        );
      });

      if (imgBytes) {
        const embeddedJpg = await outPdf.embedJpg(imgBytes);
        const outPage = outPdf.addPage([ptWidth, ptHeight]);
        outPage.drawImage(embeddedJpg, {
          x: 0,
          y: 0,
          width: ptWidth,
          height: ptHeight,
        });
      }

      if (pageNum <= 8) {
        const compressedDataUrl = canvas.toDataURL("image/jpeg", renderQuality);
        previewPages.push({
          pageNum,
          dataUrl: compressedDataUrl,
          width: canvas.width,
          height: canvas.height,
          ptWidth,
          ptHeight,
        });
      }
    }

    const finalPdfBytes = await outPdf.save({ useObjectStreams: true });
    const pdfBlob = new Blob([finalPdfBytes], { type: "application/pdf" });
    return { pdfBlob, previewPages };
  };

  let currentScale = effectiveScale;
  let currentQuality = effectiveQuality;
  let { pdfBlob, previewPages } = await renderAndBuildPdf(currentScale, currentQuality);

  // Strict Target KB Enforcement Loop (Guarantee output is strictly < targetMaxKb * 1024)
  if (targetMaxKb && targetMaxKb > 0 && !scale && !quality) {
    const maxAllowedBytes = targetMaxKb * 1024;
    let attempts = 0;
    while (pdfBlob.size >= maxAllowedBytes && attempts < 4) {
      attempts++;
      const ratio = (maxAllowedBytes * 0.85) / pdfBlob.size;
      currentScale = Math.max(0.16, currentScale * Math.sqrt(ratio) * 0.82);
      currentQuality = Math.max(0.06, currentQuality * ratio * 0.80);
      const retryResult = await renderAndBuildPdf(currentScale, currentQuality);
      pdfBlob = retryResult.pdfBlob;
      previewPages = retryResult.previewPages;
    }
  } else if (pdfBlob.size >= originalSize && !scale && !quality) {
    // Guarantee: If output >= original, aggressively tighten
    currentScale = Math.max(0.35, currentScale * 0.65);
    currentQuality = Math.max(0.18, currentQuality * 0.60);
    const retryResult = await renderAndBuildPdf(currentScale, currentQuality);
    if (retryResult.pdfBlob.size < pdfBlob.size) {
      pdfBlob = retryResult.pdfBlob;
      previewPages = retryResult.previewPages;
    }
  }

  const compressedSize = pdfBlob.size;
  const reductionPercent =
    originalSize > compressedSize
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  const outputName =
    filename || `compressed_${file.name.replace(/\.[^/.]+$/, "")}.pdf`;

  return {
    blob: pdfBlob,
    originalSize,
    compressedSize,
    reductionPercent,
    numPages,
    previewPages,
    filename: outputName,
    scale: currentScale,
    quality: currentQuality,
  };
};

/**
 * Returns the total page count of a PDF file
 */
export const getPdfPageCount = async (file) => {
  if (!file) return 0;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.getPageCount();
  } catch (err) {
    console.error("Failed to read PDF page count:", err);
    return 0;
  }
};

/**
 * Converts a PDF Document into an editable Microsoft Word (.docx) file
 * Supports:
 * - 'smartText' (Default): Reconstructs coherent sentences, paragraphs, and headings with delta-X spacing and OCR fallback.
 * - 'visualLayout': Pixel-perfect visual replication preserving exact designs, tables, graphics, and forms.
 * - 'hybrid': High-res visual layout + editable formatted text.
 */
export const convertPdfToDocx = async (file, options = {}) => {
  const {
    mode = "smartText", // 'smartText' | 'visualLayout' | 'hybrid'
    progressCallback = null,
    filename = null,
  } = options;

  if (!file) throw new Error("No PDF file provided for DOCX conversion");

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  if (numPages === 0) throw new Error("PDF document has 0 pages");

  const docSections = [];
  const extractedTextPreview = [];
  let totalParagraphs = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (progressCallback) {
      progressCallback({
        currentPage: pageNum,
        totalPages: numPages,
        percent: Math.round((pageNum / numPages) * 100),
        status: `Converting page ${pageNum} of ${numPages} (${
          mode === "visualLayout"
            ? "Rendering high-res visual"
            : "Extracting structured text"
        })...`,
      });
    }

    const page = await pdfDoc.getPage(pageNum);
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const ptWidth = unscaledViewport.width;
    const ptHeight = unscaledViewport.height;

    const pageParagraphs = [];

    // 1. Visual Layout or Hybrid rendering: Generate high-res image
    if (mode === "visualLayout" || mode === "hybrid") {
      const renderScale = 2.0; // 150-200 DPI
      const viewport = page.getViewport({ scale: renderScale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise((res) =>
          canvas.toBlob(res, "image/jpeg", 0.92)
        );
        const imgBuffer = await blob.arrayBuffer();

        // Fit within standard Word page dimensions (max ~560pt wide)
        const targetWidth = Math.min(560, Math.round(ptWidth * 0.95));
        const targetHeight = Math.round(targetWidth * (ptHeight / ptWidth));

        const visualImageRun = new ImageRun({
          data: new Uint8Array(imgBuffer),
          transformation: {
            width: targetWidth,
            height: targetHeight,
          },
        });

        pageParagraphs.push(
          new Paragraph({
            children: [visualImageRun],
            spacing: { before: 0, after: mode === "hybrid" ? 200 : 0 },
            alignment: AlignmentType.CENTER,
          })
        );
        totalParagraphs++;
      }
    }

    // 2. Text Extraction & Structured Reconstruction
    if (mode === "smartText" || mode === "hybrid") {
      const textContent = await page.getTextContent();
      const rawItems = textContent.items || [];

      // Filter out empty items
      const validItems = rawItems.filter(
        (it) => it.str && it.str.trim() !== ""
      );

      // If page has no text layer, render visual snapshot fallback so it's not empty!
      if (validItems.length === 0 && mode === "smartText") {
        const renderScale = 2.0;
        const viewport = page.getViewport({ scale: renderScale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          const blob = await new Promise((res) =>
            canvas.toBlob(res, "image/jpeg", 0.92)
          );
          const imgBuffer = await blob.arrayBuffer();
          const targetWidth = Math.min(560, Math.round(ptWidth * 0.95));
          const targetHeight = Math.round(targetWidth * (ptHeight / ptWidth));

          pageParagraphs.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: new Uint8Array(imgBuffer),
                  transformation: {
                    width: targetWidth,
                    height: targetHeight,
                  },
                }),
              ],
              spacing: { before: 0, after: 0 },
              alignment: AlignmentType.CENTER,
            })
          );
          totalParagraphs++;
        }
      } else {
        // Group items into lines using precise Y-tolerance
        const lineMap = new Map();
        const lineTolerance = 3.5;

        for (const item of validItems) {
          const x = item.transform[4];
          const y = Math.round(item.transform[5]);
          const width = item.width || item.str.length * 6;
          const height = Math.round(item.height || item.transform[0] || 11);
          const fontName = item.fontName || "";
          const isBold =
            fontName.toLowerCase().includes("bold") ||
            fontName.toLowerCase().includes("heavy") ||
            fontName.toLowerCase().includes("black");
          const isItalic =
            fontName.toLowerCase().includes("italic") ||
            fontName.toLowerCase().includes("oblique");

          let matchedY = null;
          for (const existingY of lineMap.keys()) {
            if (Math.abs(existingY - y) <= lineTolerance) {
              matchedY = existingY;
              break;
            }
          }

          const keyY = matchedY !== null ? matchedY : y;
          if (!lineMap.has(keyY)) lineMap.set(keyY, []);

          lineMap.get(keyY).push({
            text: item.str,
            x,
            y,
            width,
            height,
            isBold,
            isItalic,
          });
        }

        // Sort lines top to bottom (Y descending in PDF)
        const sortedYKeys = Array.from(lineMap.keys()).sort((a, b) => b - a);

        if (pageNum > 1 && mode !== "hybrid") {
          pageParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `--- Page ${pageNum} ---`,
                  color: "888888",
                  size: 18,
                  italics: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            })
          );
        }

        let pendingRuns = [];
        let prevY = null;

        for (const y of sortedYKeys) {
          const lineItems = lineMap.get(y);
          // Sort items left to right
          lineItems.sort((a, b) => a.x - b.x);

          // Accurate line reconstruction with delta-X word spacing calculation
          const runs = [];
          let currentRunText = "";
          let currentRunBold = lineItems[0].isBold;
          let currentRunItalic = lineItems[0].isItalic;
          let currentRunHeight = lineItems[0].height;
          let prevItem = null;

          for (const it of lineItems) {
            let addSpace = false;
            if (prevItem) {
              const prevRight = prevItem.x + prevItem.width;
              const gap = it.x - prevRight;
              // If gap > 2.5px, it's a real space between words. If small, it's part of the same word!
              if (gap > 2.5) {
                addSpace = true;
              }
            }

            const textSegment = addSpace ? " " + it.text : it.text;
            const sameStyle =
              it.isBold === currentRunBold && it.isItalic === currentRunItalic;

            if (sameStyle) {
              currentRunText += textSegment;
            } else {
              if (currentRunText) {
                runs.push({
                  text: currentRunText,
                  isBold: currentRunBold,
                  isItalic: currentRunItalic,
                  height: currentRunHeight,
                });
              }
              currentRunText = textSegment;
              currentRunBold = it.isBold;
              currentRunItalic = it.isItalic;
              currentRunHeight = it.height;
            }
            prevItem = it;
          }

          if (currentRunText) {
            runs.push({
              text: currentRunText,
              isBold: currentRunBold,
              isItalic: currentRunItalic,
              height: currentRunHeight,
            });
          }

          const fullLineText = runs.map((r) => r.text).join("");
          if (!fullLineText.trim()) continue;

          if (extractedTextPreview.length < 35) {
            extractedTextPreview.push(fullLineText.trim());
          }

          const avgHeight =
            lineItems.reduce((acc, it) => acc + it.height, 0) /
            lineItems.length;
          const isHeading = avgHeight >= 15.5;
          const isSubHeading = avgHeight >= 13 && avgHeight < 15.5;

          const isParagraphBreak =
            prevY !== null && Math.abs(prevY - y) > avgHeight * 1.65;

          if ((isParagraphBreak || isHeading) && pendingRuns.length > 0) {
            pageParagraphs.push(
              new Paragraph({
                children: pendingRuns,
                spacing: { before: 60, after: 60 },
              })
            );
            totalParagraphs++;
            pendingRuns = [];
          }

          // Build Word TextRuns for current line
          runs.forEach((r, idx) => {
            const needLeadSpace =
              idx > 0 &&
              pendingRuns.length > 0 &&
              !r.text.startsWith(" ");
            const tText = needLeadSpace ? " " + r.text : r.text;

            pendingRuns.push(
              new TextRun({
                text: tText,
                bold: r.isBold || isHeading,
                italics: r.isItalic,
                size: isHeading ? 28 : isSubHeading ? 24 : 22,
                color: isHeading ? "111827" : "333333",
                font: "Calibri",
              })
            );
          });

          if (isHeading || isSubHeading) {
            pageParagraphs.push(
              new Paragraph({
                children: pendingRuns,
                spacing: { before: 160, after: 60 },
              })
            );
            totalParagraphs++;
            pendingRuns = [];
          }

          prevY = y;
        }

        if (pendingRuns.length > 0) {
          pageParagraphs.push(
            new Paragraph({
              children: pendingRuns,
              spacing: { before: 60, after: 60 },
            })
          );
          totalParagraphs++;
        }
      }
    }

    docSections.push({
      properties: {
        page: {
          margin: {
            top: 720,
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      children:
        pageParagraphs.length > 0
          ? pageParagraphs
          : [
              new Paragraph({
                children: [
                  new TextRun({ text: `Page ${pageNum}`, italics: true }),
                ],
              }),
            ],
    });
  }

  const doc = new Document({
    sections: docSections,
  });

  const docxBlob = await Packer.toBlob(doc);
  const outFilename = filename || `${file.name.replace(/\.[^/.]+$/, "")}.docx`;

  return {
    blob: docxBlob,
    filename: outFilename,
    originalSize: file.size,
    docxSize: docxBlob.size,
    numPages,
    totalParagraphs,
    mode,
    textPreview: extractedTextPreview.slice(0, 15).join("\n"),
  };
};

/**
 * Converts a Microsoft Word (.docx) document into a clean, formatted PDF file
 */
export const convertDocxToPdf = async (file, options = {}) => {
  const {
    orientation = "portrait",
    margin = 15, // in mm
    filename = null,
    progressCallback = null,
  } = options;

  if (!file) throw new Error("No DOCX file provided for PDF conversion");

  if (progressCallback) {
    progressCallback({
      percent: 20,
      status: "Unpacking Word document structure...",
    });
  }

  const zip = await JSZip.loadAsync(file);
  const documentXmlFile = zip.file("word/document.xml");

  if (!documentXmlFile) {
    throw new Error("Invalid .docx file: missing word/document.xml");
  }

  const xmlText = await documentXmlFile.async("string");
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  if (progressCallback) {
    progressCallback({
      percent: 50,
      status: "Parsing paragraphs and styles...",
    });
  }

  const paragraphNodes = Array.from(xmlDoc.getElementsByTagName("w:p"));
  const parsedParagraphs = [];
  const textPreview = [];

  paragraphNodes.forEach((pNode) => {
    const runNodes = Array.from(pNode.getElementsByTagName("w:r"));
    const runs = [];

    // Check style / heading
    const pStyleNode = pNode.getElementsByTagName("w:pStyle")[0];
    const styleVal = pStyleNode?.getAttribute("w:val") || "";
    const isHeading1 =
      styleVal.toLowerCase().includes("heading1") ||
      styleVal.toLowerCase().includes("title");
    const isHeading2 = styleVal.toLowerCase().includes("heading2");
    const isHeading3 = styleVal.toLowerCase().includes("heading3");

    // Check bullet list
    const numPrNode = pNode.getElementsByTagName("w:numPr")[0];
    const isBullet = !!numPrNode;

    runNodes.forEach((rNode) => {
      const tNode = rNode.getElementsByTagName("w:t")[0];
      if (!tNode) return;
      const text = tNode.textContent || "";
      if (!text) return;

      const isBold = rNode.getElementsByTagName("w:b").length > 0;
      const isItalic = rNode.getElementsByTagName("w:i").length > 0;
      const colorNode = rNode.getElementsByTagName("w:color")[0];
      const colorHex = colorNode?.getAttribute("w:val") || null;
      const szNode = rNode.getElementsByTagName("w:sz")[0];
      const szVal = szNode ? parseInt(szNode.getAttribute("w:val"), 10) : null;

      runs.push({
        text,
        isBold: isBold || isHeading1 || isHeading2,
        isItalic,
        colorHex: colorHex && colorHex !== "auto" ? `#${colorHex}` : null,
        fontSizePt: szVal
          ? szVal / 2
          : isHeading1
          ? 16
          : isHeading2
          ? 13
          : isHeading3
          ? 11.5
          : 10.5,
      });
    });

    const fullPText = runs.map((r) => r.text).join("");
    if (fullPText.trim()) {
      if (textPreview.length < 15) textPreview.push(fullPText.trim());
      parsedParagraphs.push({
        runs,
        fullText: fullPText,
        isHeading1,
        isHeading2,
        isHeading3,
        isBullet,
      });
    } else {
      // Empty line
      parsedParagraphs.push({
        runs: [],
        fullText: "",
        isEmpty: true,
      });
    }
  });

  if (progressCallback) {
    progressCallback({ percent: 75, status: "Formatting & compiling PDF..." });
  }

  // Generate jsPDF document
  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - margin - 10;

  let cursorY = margin + 5;
  let pageCount = 1;

  const checkPageBreak = (neededHeight) => {
    if (cursorY + neededHeight > bottomThreshold) {
      doc.addPage("a4", orientation);
      pageCount++;
      cursorY = margin + 5;
    }
  };

  parsedParagraphs.forEach((p) => {
    if (p.isEmpty) {
      cursorY += 4;
      return;
    }

    if (p.isHeading1) {
      checkPageBreak(12);
      cursorY += 3;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(17, 24, 39);
      const lines = doc.splitTextToSize(p.fullText, contentWidth);
      lines.forEach((line) => {
        checkPageBreak(7);
        doc.text(line, margin, cursorY);
        cursorY += 7;
      });
      cursorY += 2;
    } else if (p.isHeading2) {
      checkPageBreak(10);
      cursorY += 2;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(31, 41, 55);
      const lines = doc.splitTextToSize(p.fullText, contentWidth);
      lines.forEach((line) => {
        checkPageBreak(6);
        doc.text(line, margin, cursorY);
        cursorY += 6;
      });
      cursorY += 1.5;
    } else {
      const indent = p.isBullet ? 5 : 0;
      const isPureBold = p.runs.every((r) => r.isBold);
      const isPureItalic = p.runs.every((r) => r.isItalic);

      doc.setFont(
        "helvetica",
        isPureBold && isPureItalic
          ? "bolditalic"
          : isPureBold
          ? "bold"
          : isPureItalic
          ? "italic"
          : "normal"
      );
      doc.setFontSize(10.5);
      doc.setTextColor(55, 65, 81);

      const prefix = p.isBullet ? "• " : "";
      const textToSplit = prefix + p.fullText;
      const lines = doc.splitTextToSize(textToSplit, contentWidth);

      lines.forEach((line) => {
        checkPageBreak(5);
        doc.text(
          line,
          margin + (p.isBullet && line !== lines[0] ? indent : 0),
          cursorY
        );
        cursorY += 5;
      });
      cursorY += 2;
    }
  });

  const pdfBlob = doc.output("blob");
  const outFilename = filename || `${file.name.replace(/\.[^/.]+$/, "")}.pdf`;

  if (progressCallback) {
    progressCallback({ percent: 100, status: "Complete!" });
  }

  return {
    blob: pdfBlob,
    filename: outFilename,
    originalSize: file.size,
    pdfSize: pdfBlob.size,
    pageCount,
    paragraphCount: parsedParagraphs.length,
    textPreview: textPreview.join("\n"),
  };
};


