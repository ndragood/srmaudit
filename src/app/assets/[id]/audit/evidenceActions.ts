"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadEvidence(assetId: string, controlId: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return;

  // ✅ batasi tipe file (biar aman)
  const allowed = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  ];
  if (!allowed.includes(file.type)) {
    throw new Error("File type not allowed. Use PNG/JPG/PDF/DOCX.");
  }

  // convert File -> Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // path penyimpanan
  const ts = Date.now();
  const original = safeName(file.name);
  const dir = path.join(process.cwd(), "public", "uploads", assetId, controlId);
  await fs.mkdir(dir, { recursive: true });

  const filename = `${ts}_${original}`;
  const fullPath = path.join(dir, filename);

  await fs.writeFile(fullPath, buffer);

  // URL publik untuk file
  const publicPath = `/uploads/${assetId}/${controlId}/${filename}`;

  await prisma.evidence.create({
    data: {
      assetId,
      controlId,
      fileName: file.name,
      filePath: publicPath,
    
    },
  });

  revalidatePath(`/assets/${assetId}/audit`);
}