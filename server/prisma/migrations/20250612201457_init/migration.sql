/*
  Warnings:

  - You are about to drop the column `next_stpes` on the `Event` table. All the data in the column will be lost.
  - Added the required column `next_steps` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "next_stpes",
ADD COLUMN     "next_steps" TEXT NOT NULL;
