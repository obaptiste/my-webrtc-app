/*
  Warnings:

  - You are about to drop the column `metadata` on the `VideoMessage` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `VideoMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `VideoMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `VideoMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `VideoMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `VideoMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoMessage" DROP COLUMN "metadata",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
