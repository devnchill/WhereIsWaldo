/*
  Warnings:

  - You are about to drop the column `place` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `character` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "place",
ADD COLUMN     "character" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Round" ALTER COLUMN "durationMs" SET DATA TYPE BIGINT;
