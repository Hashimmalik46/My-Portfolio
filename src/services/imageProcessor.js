/**
 * Client-Side Image Processor & PDF Studio Engine
 * Zero-upload, 100% private, browser-based image conversions, compression, and PDF operations.
 */
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import { triggerFileDownload } from "./mediaDownloader";

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
 * Compresses and converts an image using HTML5 Canvas
 */
export const compressAndConvertImage = (img, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        format = "image/jpeg",
        quality = 0.82,
        width = img.naturalWidth || img.width,
        height = img.naturalHeight || img.height,
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
    } catch (err) {
      reject(err);
    }
  });
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

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  return true;
};

/**
 * Merges multiple PDF files into a single unified PDF document
 */
export const mergePdfFiles = async (pdfFilesList, filename = `merged_document_${Date.now()}.pdf`) => {
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
export const splitPdfFile = async (file, pageRangeStr, filename = `extracted_${Date.now()}.pdf`) => {
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
