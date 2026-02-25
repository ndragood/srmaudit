-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NON_COMPLIANT',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditResult_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditResult_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AuditResult" ("assetId", "controlId", "createdAt", "id", "notes", "status") SELECT "assetId", "controlId", "createdAt", "id", "notes", "status" FROM "AuditResult";
DROP TABLE "AuditResult";
ALTER TABLE "new_AuditResult" RENAME TO "AuditResult";
CREATE UNIQUE INDEX "AuditResult_assetId_controlId_key" ON "AuditResult"("assetId", "controlId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
