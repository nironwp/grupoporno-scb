-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "st_approved" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER,
    "usersId" INTEGER,
    CONSTRAINT "Group_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Group_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("categoryId", "description", "id", "link", "st_approved", "title", "usersId") SELECT "categoryId", "description", "id", "link", "st_approved", "title", "usersId" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_link_key" ON "Group"("link");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
