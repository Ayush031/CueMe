/*
  Warnings:

  - Added the required column `extractedId` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Stream` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StreamType" AS ENUM ('SPOTIFY', 'YOUTUBE');

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "extractedId" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "StreamType" NOT NULL;

-- DropEnum
DROP TYPE "Type";
