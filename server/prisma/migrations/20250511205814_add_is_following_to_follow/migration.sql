/*
  Warnings:

  - Added the required column `isFollowing` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Follow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,
    "isFollowing" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "RegisteredUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "RegisteredUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Follow" ("createdAt", "followerId", "followingId", "id") SELECT "createdAt", "followerId", "followingId", "id" FROM "Follow";
DROP TABLE "Follow";
ALTER TABLE "new_Follow" RENAME TO "Follow";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
