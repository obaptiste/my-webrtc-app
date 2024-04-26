/*
  Warnings:

  - Added the required column `videoUrl` to the `VideoMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoMessage" ADD COLUMN     "videoUrl" TEXT NOT NULL;
