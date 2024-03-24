-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tb_groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL DEFAULT '',
    "stApproved" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER,
    "userIdApproved" INTEGER,
    "userIdCreated" INTEGER NOT NULL
);
INSERT INTO "new_tb_groups" ("categoryId", "description", "id", "link", "stApproved", "title", "userIdApproved", "userIdCreated") SELECT "categoryId", "description", "id", "link", "stApproved", "title", "userIdApproved", "userIdCreated" FROM "tb_groups";
DROP TABLE "tb_groups";
ALTER TABLE "new_tb_groups" RENAME TO "tb_groups";
CREATE UNIQUE INDEX "tb_groups_link_key" ON "tb_groups"("link");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
