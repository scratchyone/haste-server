-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "hash" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false
);
