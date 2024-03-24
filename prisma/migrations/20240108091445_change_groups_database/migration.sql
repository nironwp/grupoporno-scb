/*
  Warnings:

  - You are about to drop the column `usersId` on the `Group` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "st_approved" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER,
    "userIdApproved" INTEGER,
    "userIdCreated" INTEGER
);
INSERT INTO "new_Group" ("categoryId", "description", "id", "link", "st_approved", "title") SELECT "categoryId", "description", "id", "link", "st_approved", "title" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_link_key" ON "Group"("link");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
