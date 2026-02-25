"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Create manual finding
export async function createFinding(assetId: string, formData: FormData) {
  const issue = String(formData.get("issue") || "").trim();
  const risk = String(formData.get("risk") || "").trim();
  const recommendation = String(formData.get("recommendation") || "").trim();

  if (!issue) throw new Error("Issue is required");
  if (!risk) throw new Error("Risk is required");
  if (!recommendation) throw new Error("Recommendation is required");

  await prisma.finding.create({
    data: {
      assetId,
      issue,
      risk,
      recommendation,
    },
  });

  revalidatePath(`/assets/${assetId}/findings`);
}

// Delete finding
export async function deleteFinding(assetId: string, findingId: string) {
  await prisma.finding.delete({ where: { id: findingId } });
  revalidatePath(`/assets/${assetId}/findings`);
}