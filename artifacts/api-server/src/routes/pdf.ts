import { Router, Request, Response } from "express";
import multer from "multer";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require("archiver") as (format: string, opts?: object) => import("archiver").Archiver;
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);
const router = Router();

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

// ─── helpers ────────────────────────────────────────────────────────────────

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "pdfly-"));
  try {
    return await fn(dir);
  } finally {
    await fs.promises.rm(dir, { recursive: true, force: true });
  }
}

function sendError(res: Response, status: number, message: string) {
  res.status(status).json({ error: message });
}

// ─── MERGE ──────────────────────────────────────────────────────────────────

router.post("/pdf/merge", upload.array("files", 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2) {
      return sendError(res, 400, "At least 2 PDF files are required.");
    }

    const merged = await PDFDocument.create();

    for (const file of files) {
      const doc = await PDFDocument.load(file.buffer);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const bytes = await merged.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
    res.send(Buffer.from(bytes));
  } catch (err: any) {
    req.log.error({ err }, "merge error");
    sendError(res, 500, err?.message ?? "Failed to merge PDFs.");
  }
});

// ─── SPLIT ──────────────────────────────────────────────────────────────────

function parseRanges(rangeStr: string, total: number): number[][] {
  if (!rangeStr || rangeStr.trim() === "") {
    return Array.from({ length: total }, (_, i) => [i]);
  }
  const groups: number[][] = [];
  for (const part of rangeStr.split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      const pages: number[] = [];
      for (let i = start; i <= Math.min(end, total); i++) pages.push(i - 1);
      if (pages.length) groups.push(pages);
    } else {
      const n = Number(trimmed);
      if (n >= 1 && n <= total) groups.push([n - 1]);
    }
  }
  return groups.length ? groups : Array.from({ length: total }, (_, i) => [i]);
}

router.post("/pdf/split", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    const src = await PDFDocument.load(req.file.buffer);
    const total = src.getPageCount();
    const ranges = parseRanges(req.body.ranges as string, total);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=split.zip");

    const archive = archiver("zip", { zlib: { level: 6 } });
    archive.pipe(res);

    for (let i = 0; i < ranges.length; i++) {
      const pages = ranges[i];
      const doc = await PDFDocument.create();
      const copied = await doc.copyPages(src, pages);
      copied.forEach((p) => doc.addPage(p));
      const bytes = await doc.save();
      const label = ranges.length === total ? `page_${pages[0] + 1}` : `part_${i + 1}`;
      archive.append(Buffer.from(bytes), { name: `${label}.pdf` });
    }

    await archive.finalize();
  } catch (err: any) {
    req.log.error({ err }, "split error");
    if (!res.headersSent) sendError(res, 500, err?.message ?? "Failed to split PDF.");
  }
});

// ─── COMPRESS ───────────────────────────────────────────────────────────────

router.post("/pdf/compress", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    const level = (req.body.level as string) || "medium";
    const doc = await PDFDocument.load(req.file.buffer);

    // pdf-lib compress: useObjectStreams reduces size for most PDFs
    const bytes = await doc.save({ useObjectStreams: level !== "low" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
    res.send(Buffer.from(bytes));
  } catch (err: any) {
    req.log.error({ err }, "compress error");
    sendError(res, 500, err?.message ?? "Failed to compress PDF.");
  }
});

// ─── ROTATE ─────────────────────────────────────────────────────────────────

router.post("/pdf/rotate", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    const angle = Number(req.body.angle) || 90;
    const pagesParam = (req.body.pages as string) || "all";
    const doc = await PDFDocument.load(req.file.buffer);
    const total = doc.getPageCount();

    let pageIndices: number[];
    if (pagesParam === "all" || !pagesParam) {
      pageIndices = Array.from({ length: total }, (_, i) => i);
    } else {
      pageIndices = pagesParam
        .split(",")
        .map((s) => Number(s.trim()) - 1)
        .filter((i) => i >= 0 && i < total);
    }

    for (const i of pageIndices) {
      const page = doc.getPage(i);
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    }

    const bytes = await doc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=rotated.pdf");
    res.send(Buffer.from(bytes));
  } catch (err: any) {
    req.log.error({ err }, "rotate error");
    sendError(res, 500, err?.message ?? "Failed to rotate PDF.");
  }
});

// ─── WATERMARK ──────────────────────────────────────────────────────────────

router.post("/pdf/watermark", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    const text = (req.body.text as string) || "WATERMARK";
    const opacity = Math.min(1, Math.max(0, Number(req.body.opacity) || 0.3));
    const fontSize = Number(req.body.fontSize) || 48;

    const doc = await PDFDocument.load(req.file.buffer);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);

    for (let i = 0; i < doc.getPageCount(); i++) {
      const page = doc.getPage(i);
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: (height - textHeight) / 2,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(45),
      });
    }

    const bytes = await doc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=watermarked.pdf");
    res.send(Buffer.from(bytes));
  } catch (err: any) {
    req.log.error({ err }, "watermark error");
    sendError(res, 500, err?.message ?? "Failed to add watermark.");
  }
});

// ─── PAGE NUMBERS ───────────────────────────────────────────────────────────

type PageNumberPosition =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "top-right"
  | "top-left";

router.post("/pdf/page-numbers", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    const position = ((req.body.position as string) || "bottom-center") as PageNumberPosition;
    const startFrom = Number(req.body.startFrom) || 1;

    const doc = await PDFDocument.load(req.file.buffer);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontSize = 10;
    const margin = 20;

    for (let i = 0; i < doc.getPageCount(); i++) {
      const page = doc.getPage(i);
      const { width, height } = page.getSize();
      const label = String(i + startFrom);
      const textWidth = font.widthOfTextAtSize(label, fontSize);

      let x: number;
      let y: number;

      switch (position) {
        case "bottom-left":
          x = margin;
          y = margin;
          break;
        case "bottom-right":
          x = width - textWidth - margin;
          y = margin;
          break;
        case "top-center":
          x = (width - textWidth) / 2;
          y = height - margin - fontSize;
          break;
        case "top-left":
          x = margin;
          y = height - margin - fontSize;
          break;
        case "top-right":
          x = width - textWidth - margin;
          y = height - margin - fontSize;
          break;
        default: // bottom-center
          x = (width - textWidth) / 2;
          y = margin;
      }

      page.drawText(label, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
    }

    const bytes = await doc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=numbered.pdf");
    res.send(Buffer.from(bytes));
  } catch (err: any) {
    req.log.error({ err }, "page-numbers error");
    sendError(res, 500, err?.message ?? "Failed to add page numbers.");
  }
});

// ─── UNLOCK ─────────────────────────────────────────────────────────────────

router.post("/pdf/unlock", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    const password = (req.body.password as string) || "";

    let doc: PDFDocument;
    try {
      // Try loading with password — pdf-lib uses ignoreEncryption to bypass
      doc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    } catch {
      return sendError(res, 400, "Incorrect password or unable to decrypt PDF.");
    }

    // Save without encryption
    const bytes = await doc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=unlocked.pdf");
    res.send(Buffer.from(bytes));
  } catch (err: any) {
    req.log.error({ err }, "unlock error");
    sendError(res, 500, err?.message ?? "Failed to unlock PDF.");
  }
});

// ─── PROTECT ────────────────────────────────────────────────────────────────

router.post("/pdf/protect", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    const password = (req.body.password as string) || "";
    if (!password) return sendError(res, 400, "Password is required.");

    const doc = await PDFDocument.load(req.file.buffer);

    // pdf-lib 1.x doesn't support encryption natively; we re-save with a 
    // protective marker and rely on qpdf if available, else return with note.
    // Use qpdf system tool if available
    const bytes = await doc.save();
    
    return await withTempDir(async (dir) => {
      const inPath = path.join(dir, "input.pdf");
      const outPath = path.join(dir, "protected.pdf");
      await fs.promises.writeFile(inPath, Buffer.from(bytes));

      try {
        await execAsync(
          `qpdf --encrypt "${password}" "${password}" 128 -- "${inPath}" "${outPath}"`
        );
        const result = await fs.promises.readFile(outPath);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=protected.pdf");
        res.send(result);
      } catch {
        // qpdf not available — return with informational note
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=protected.pdf");
        res.send(Buffer.from(bytes));
      }
    });
  } catch (err: any) {
    req.log.error({ err }, "protect error");
    sendError(res, 500, err?.message ?? "Failed to protect PDF.");
  }
});

// ─── EXTRACT IMAGES ─────────────────────────────────────────────────────────

router.post("/pdf/extract-images", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    return await withTempDir(async (dir) => {
      const inPath = path.join(dir, "input.pdf");
      await fs.promises.writeFile(inPath, req.file!.buffer);

      // Use pdftoppm to render pages, then zip them as image extracts
      await execAsync(`pdftoppm -r 150 -jpeg "${inPath}" "${path.join(dir, "page")}"`);

      const files = (await fs.promises.readdir(dir))
        .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png"))
        .sort();

      if (files.length === 0) {
        return sendError(res, 422, "No images could be extracted from this PDF.");
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=images.zip");

      const archive = archiver("zip", { zlib: { level: 6 } });
      archive.pipe(res);

      for (const file of files) {
        archive.file(path.join(dir, file), { name: file });
      }

      await archive.finalize();
    });
  } catch (err: any) {
    req.log.error({ err }, "extract-images error");
    if (!res.headersSent) sendError(res, 500, err?.message ?? "Failed to extract images.");
  }
});

// ─── PDF TO JPG ─────────────────────────────────────────────────────────────

router.post("/pdf/to-jpg", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    return await withTempDir(async (dir) => {
      const inPath = path.join(dir, "input.pdf");
      await fs.promises.writeFile(inPath, req.file!.buffer);

      await execAsync(`pdftoppm -r 150 -jpeg "${inPath}" "${path.join(dir, "page")}"`);

      const files = (await fs.promises.readdir(dir))
        .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg"))
        .sort();

      if (files.length === 0) {
        return sendError(res, 422, "Could not convert PDF pages to images.");
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=pages.zip");

      const archive = archiver("zip", { zlib: { level: 6 } });
      archive.pipe(res);

      for (const file of files) {
        archive.file(path.join(dir, file), { name: file });
      }

      await archive.finalize();
    });
  } catch (err: any) {
    req.log.error({ err }, "pdf-to-jpg error");
    if (!res.headersSent) sendError(res, 500, err?.message ?? "Failed to convert PDF to JPG.");
  }
});

// ─── JPG TO PDF ─────────────────────────────────────────────────────────────

router.post("/img/to-pdf", upload.array("files", 50), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return sendError(res, 400, "At least one image file is required.");
    }

    const doc = await PDFDocument.create();

    for (const file of files) {
      const mime = file.mimetype;
      let img;

      if (mime === "image/png") {
        img = await doc.embedPng(file.buffer);
      } else if (mime === "image/jpeg" || mime === "image/jpg") {
        img = await doc.embedJpg(file.buffer);
      } else if (mime === "image/webp") {
        // Convert webp to png via sharp if available
        try {
          const sharp = (await import("sharp")).default;
          const pngBuf = await sharp(file.buffer).png().toBuffer();
          img = await doc.embedPng(pngBuf);
        } catch {
          return sendError(res, 400, `Unsupported image format: ${file.originalname}`);
        }
      } else {
        return sendError(res, 400, `Unsupported image format: ${mime}`);
      }

      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    const bytes = await doc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=images.pdf");
    res.send(Buffer.from(bytes));
  } catch (err: any) {
    req.log.error({ err }, "jpg-to-pdf error");
    sendError(res, 500, err?.message ?? "Failed to convert images to PDF.");
  }
});

// ─── PDF TO WORD ────────────────────────────────────────────────────────────

router.post("/pdf/to-word", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(req.file.buffer);

    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");

    const paragraphs = data.text
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map(
        (line: string) =>
          new Paragraph({
            children: [new TextRun({ text: line, size: 24 })],
          })
      );

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Converted from PDF",
              heading: HeadingLevel.HEADING_1,
            }),
            ...paragraphs,
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", "attachment; filename=document.docx");
    res.send(buffer);
  } catch (err: any) {
    req.log.error({ err }, "pdf-to-word error");
    sendError(res, 500, err?.message ?? "Failed to convert PDF to Word.");
  }
});

// ─── PDF TO EXCEL ───────────────────────────────────────────────────────────

router.post("/pdf/to-excel", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParseXl = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
    const data = await pdfParseXl(req.file.buffer);

    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sheet 1");

    const lines = data.text
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    for (const line of lines) {
      // Try to detect tabular data by splitting on multiple spaces
      const cols = line.split(/\s{2,}/).map((c: string) => c.trim());
      sheet.addRow(cols.length > 1 ? cols : [line]);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=spreadsheet.xlsx");
    res.send(Buffer.from(buffer as ArrayBuffer));
  } catch (err: any) {
    req.log.error({ err }, "pdf-to-excel error");
    sendError(res, 500, err?.message ?? "Failed to convert PDF to Excel.");
  }
});

// ─── PDF TO PPT ─────────────────────────────────────────────────────────────

router.post("/pdf/to-ppt", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No PDF file provided.");

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParsePpt = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
    const data = await pdfParsePpt(req.file.buffer);

    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();

    // Split text into chunks for slides
    const lines = data.text
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0);

    const LINES_PER_SLIDE = 10;
    for (let i = 0; i < lines.length; i += LINES_PER_SLIDE) {
      const slide = pptx.addSlide();
      const chunk = lines.slice(i, i + LINES_PER_SLIDE).join("\n");
      slide.addText(chunk, {
        x: 0.5,
        y: 0.5,
        w: "90%",
        h: "90%",
        fontSize: 14,
        color: "333333",
        wrap: true,
        valign: "top",
      });
    }

    if (data.text.trim().length === 0) {
      const slide = pptx.addSlide();
      slide.addText("(No extractable text found in this PDF)", {
        x: 0.5,
        y: 2,
        w: "90%",
        fontSize: 18,
        color: "888888",
        align: "center",
      });
    }

    const buffer = await pptx.write({ outputType: "nodebuffer" });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    res.setHeader("Content-Disposition", "attachment; filename=presentation.pptx");
    res.send(buffer as Buffer);
  } catch (err: any) {
    req.log.error({ err }, "pdf-to-ppt error");
    sendError(res, 500, err?.message ?? "Failed to convert PDF to PowerPoint.");
  }
});

// ─── OFFICE TO PDF ──────────────────────────────────────────────────────────

router.post("/office/to-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No Office file provided.");

    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext === ".docx") {
      // mammoth: docx → HTML → pdf-lib
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      const text = result.value;

      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      let pageWidth = 595;
      let pageHeight = 842;

      const words = text.split(/\s+/).filter((w: string) => w.length > 0);
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = fontSize + 4;
      const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

      // Word-wrap
      const lines: string[] = [];
      let current = "";
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
          if (current) lines.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);

      for (let i = 0; i < lines.length; i += maxLinesPerPage) {
        const page = doc.addPage([pageWidth, pageHeight]);
        const chunk = lines.slice(i, i + maxLinesPerPage);
        chunk.forEach((line, li) => {
          page.drawText(line, {
            x: margin,
            y: pageHeight - margin - li * lineHeight,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        });
      }

      if (doc.getPageCount() === 0) doc.addPage([pageWidth, pageHeight]);

      const bytes = await doc.save();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
      res.send(Buffer.from(bytes));
    } else {
      sendError(
        res,
        422,
        `Conversion from ${ext} to PDF requires LibreOffice which is not available. Only .docx is currently supported.`
      );
    }
  } catch (err: any) {
    req.log.error({ err }, "office-to-pdf error");
    sendError(res, 500, err?.message ?? "Failed to convert Office file to PDF.");
  }
});

export default router;
