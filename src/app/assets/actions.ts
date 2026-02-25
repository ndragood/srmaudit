"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAsset(formData: FormData) {
  const name = String(formData.get("name") || "");
  const owner = String(formData.get("owner") || "");
  const location = String(formData.get("location") || "");
  const type = String(formData.get("type") || "");
  const cia = String(formData.get("cia") || "Medium");

  if (!name.trim()) throw new Error("Asset name is required");

  // QUICK HACK: pakai 1 organization default dulu biar cepat
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Demo Organization",
        sector: "Education",
        employees: 200,
        systemType: "Web",
      },
    });
  }

  await prisma.asset.create({
    data: {
      organizationId: org.id,
      name,
      owner,
      location,
      type,
      cia,
    },
  });

  revalidatePath("/assets");
}

export async function deleteAsset(id: string) {
  // hapus semua child records dulu biar ga kena foreign key constraint
  await prisma.$transaction([
    prisma.assetVulnerability.deleteMany({ where: { assetId: id } }),
    prisma.auditResult.deleteMany({ where: { assetId: id } }),
    prisma.finding.deleteMany({ where: { assetId: id } }),
    prisma.evidence.deleteMany({ where: { assetId: id } }),

    prisma.asset.delete({ where: { id } }),
  ]);

  revalidatePath("/assets");
}