/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `tb_groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_groups_slug_key" ON "tb_groups"("slug");
