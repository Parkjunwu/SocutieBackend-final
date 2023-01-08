-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WhichNotification" ADD VALUE 'MY_PETLOG_GET_LIKE';
ALTER TYPE "WhichNotification" ADD VALUE 'MY_PETLOG_GET_COMMENT';
ALTER TYPE "WhichNotification" ADD VALUE 'MY_PETLOG_COMMENT_GET_LIKE';
ALTER TYPE "WhichNotification" ADD VALUE 'MY_PETLOG_COMMENT_GET_COMMENT';
ALTER TYPE "WhichNotification" ADD VALUE 'MY_PETLOG_COMMENT_OF_COMMENT_GET_LIKE';
