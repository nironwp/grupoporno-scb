/*
  Warnings:

  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Users" ("email", "id", "password", "role") SELECT "email", "id", "password", "role" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
