/*
  Warnings:

  - Added the required column `link` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "link" TEXT NOT NULL;
