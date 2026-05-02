-- CreateTable
CREATE TABLE "RepairRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicant" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "applicationTime" DATETIME NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expectedReturn" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
