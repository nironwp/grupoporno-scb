-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tb_groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL DEFAULT '',
    "stApproved" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'group',
    "categoryId" INTEGER,
    "impulse" BOOLEAN NOT NULL DEFAULT false,
    "impulse_end_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userIdApproved" INTEGER,
    "userIdCreated" INTEGER NOT NULL
);
INSERT INTO "new_tb_groups" ("bannerImage", "categoryId", "description", "id", "link", "slug", "stApproved", "title", "type", "userIdApproved", "userIdCreated") SELECT "bannerImage", "categoryId", "description", "id", "link", "slug", "stApproved", "title", "type", "userIdApproved", "userIdCreated" FROM "tb_groups";
DROP TABLE "tb_groups";
ALTER TABLE "new_tb_groups" RENAME TO "tb_groups";
CREATE UNIQUE INDEX "tb_groups_slug_key" ON "tb_groups"("slug");
CREATE UNIQUE INDEX "tb_groups_link_key" ON "tb_groups"("link");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
