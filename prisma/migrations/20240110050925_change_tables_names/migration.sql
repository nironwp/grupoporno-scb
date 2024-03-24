/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Group";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Setting";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Users";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tb_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "password" TEXT NOT NULL,
    "dt_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tb_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "banner_image" TEXT NOT NULL,
    "dt_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tb_groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "stApproved" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER,
    "userIdApproved" INTEGER,
    "userIdCreated" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "tb_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "option" TEXT NOT NULL,
    "valOption" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_email_key" ON "tb_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_categories_slug_key" ON "tb_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tb_groups_link_key" ON "tb_groups"("link");

-- CreateIndex
CREATE UNIQUE INDEX "tb_settings_option_key" ON "tb_settings"("option");
