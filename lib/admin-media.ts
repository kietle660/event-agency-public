import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export type MediaItem = {
  name: string;
  url: string;
  size: number;
  modifiedAt: string;
  isImage: boolean;
};

function sanitizeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function isImageFile(name: string) {
  return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(name);
}

export async function ensureUploadsDir() {
  await mkdir(uploadsDir, { recursive: true });
}

export async function listMedia(): Promise<MediaItem[]> {
  await ensureUploadsDir();
  const entries = await readdir(uploadsDir, { withFileTypes: true });

  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const filePath = path.join(uploadsDir, entry.name);
        const stats = await import("node:fs/promises").then((fs) => fs.stat(filePath));

        return {
          name: entry.name,
          url: `/uploads/${entry.name}`,
          size: stats.size,
          modifiedAt: stats.mtime.toISOString(),
          isImage: isImageFile(entry.name),
        };
      })
  );

  return files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

export async function saveMedia(file: File) {
  await ensureUploadsDir();

  const ext = path.extname(file.name) || "";
  const baseName = path.basename(file.name, ext);
  const safeName = sanitizeFileName(baseName) || "upload";
  const finalName = `${safeName}-${crypto.randomUUID().slice(0, 8)}${ext.toLowerCase()}`;
  const targetPath = path.join(uploadsDir, finalName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(targetPath, buffer);

  return {
    name: finalName,
    url: `/uploads/${finalName}`,
  };
}

export async function deleteMedia(fileName: string) {
  await ensureUploadsDir();
  const sanitized = path.basename(fileName);
  await rm(path.join(uploadsDir, sanitized), { force: true });
}
