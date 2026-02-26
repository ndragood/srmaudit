"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Role = "ADMIN" | "AUDITOR" | "AUDITEE";

async function requireRole(roles: Role[]) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as Role | undefined;

  if (!session?.user || !role || !roles.includes(role)) {
    throw new Error("Forbidden");
  }

  return session;
}

function ciaWeight(cia: string) {
  const v = String(cia || "").toLowerCase();
  if (v === "high") return 3;
  if (v === "medium") return 2;
  if (v === "low") return 1;
  return 2;
}

function criticalityFrom(exposureScore: number, cia: string) {
  // Rule sederhana & “defendable” di laporan:
  // score = exposureScore + (CIA * 2)
  const score = Number(exposureScore || 0) + ciaWeight(cia) * 2;

  // level threshold (boleh lo adjust)
  const level = score >= 9 ? "HIGH" : score >= 6 ? "MEDIUM" : "LOW";

  return { score, level };
}

export async function createAsset(formData: FormData) {
  await requireRole(["ADMIN"]);

  const organizationId = String(formData.get("organizationId") || "");
  const name = String(formData.get("name") || "").trim();
  const owner = String(formData.get("owner") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const cia = String(formData.get("cia") || "Medium");

  if (!organizationId) throw new Error("Organization is required");
  if (!name) throw new Error("Asset name is required");

  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!org) throw new Error("Organization not found");

  // ✅ ambil exposureScore dari module 2
  const exposureScore = (org as any).exposureScore ?? 0;

  const { score, level } = criticalityFrom(exposureScore, cia);

  await prisma.asset.create({
    data: {
      organizationId,
      name,
      owner,
      location,
      type,
      cia,
      criticalityScore: score,
      criticalityLevel: level,
    },
  });

  revalidatePath("/assets");
}

export async function deleteAsset(id: string) {
  await requireRole(["ADMIN"]);

  await prisma.$transaction([
    prisma.assetVulnerability.deleteMany({ where: { assetId: id } }),
    prisma.auditResult.deleteMany({ where: { assetId: id } }),
    prisma.finding.deleteMany({ where: { assetId: id } }),
    prisma.evidence.deleteMany({ where: { assetId: id } }),
    prisma.asset.delete({ where: { id } }),
  ]);

  revalidatePath("/assets");
}