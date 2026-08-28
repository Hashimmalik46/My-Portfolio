/**
 * Client-Side Image Processor & PDF Studio Engine
 * Zero-upload, 100% private, browser-based image conversions, compression,
 * passport resizing, AI background removal, and PDF operations.
 */
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
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
