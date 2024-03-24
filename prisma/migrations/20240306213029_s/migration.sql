/*
  Warnings:

  - Added the required column `value` to the `tb_plans` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tb_plans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "value" REAL NOT NULL
);
INSERT INTO "new_tb_plans" ("id", "name", "time") SELECT "id", "name", "time" FROM "tb_plans";
DROP TABLE "tb_plans";
ALTER TABLE "new_tb_plans" RENAME TO "tb_plans";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
