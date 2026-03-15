/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `Answer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[character]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "isCompleted",
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Answer_character_key" ON "Answer"("character");
