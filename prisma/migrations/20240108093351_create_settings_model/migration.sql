/*
  Warnings:

  - You are about to drop the column `st_approved` on the `Group` table. All the data in the column will be lost.
  - Made the column `userIdCreated` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "option" TEXT NOT NULL,
    "valOption" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "stApproved" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER,
    "userIdApproved" INTEGER,
    "userIdCreated" INTEGER NOT NULL
);
INSERT INTO "new_Group" ("categoryId", "description", "id", "link", "title", "userIdApproved", "userIdCreated") SELECT "categoryId", "description", "id", "link", "title", "userIdApproved", "userIdCreated" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_link_key" ON "Group"("link");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Setting_option_key" ON "Setting"("option");
