/*
  Warnings:

  - Added the required column `mimeType` to the `Evidence` table without a default value. This is not possible if the table is not empty.
  - Made the column `assetId` on table `Evidence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `controlId` on table `Evidence` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Evidence_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Evidence_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evidence" ("assetId", "controlId", "fileName", "filePath", "id", "uploadedAt") SELECT "assetId", "controlId", "fileName", "filePath", "id", "uploadedAt" FROM "Evidence";
DROP TABLE "Evidence";
ALTER TABLE "new_Evidence" RENAME TO "Evidence";
CREATE INDEX "Evidence_assetId_idx" ON "Evidence"("assetId");
CREATE INDEX "Evidence_controlId_idx" ON "Evidence"("controlId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
