import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function ciaWeight(cia: string) {
  const v = String(cia || "").toLowerCase();
  if (v === "high") return 3;
  if (v === "medium") return 2;
  if (v === "low") return 1;
  return 2;
}

function criticalityFrom(exposureScore: number, cia: string) {
  const score = Number(exposureScore || 0) + ciaWeight(cia) * 2;
  const level = score >= 9 ? "HIGH" : score >= 6 ? "MEDIUM" : "LOW";
  return { score, level };
}

async function main() {
  const assets = await prisma.asset.findMany({
    include: { organization: true },
  });

  for (const a of assets) {
    const exposureScore = (a.organization as any)?.exposureScore ?? 0;
    const { score, level } = criticalityFrom(exposureScore, a.cia);

    await prisma.asset.update({
      where: { id: a.id },
      data: { criticalityScore: score, criticalityLevel: level },
    });
  }

  console.log(`✅ Backfilled ${assets.length} assets`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });