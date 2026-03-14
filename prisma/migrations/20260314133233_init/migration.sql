-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "userName" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "durationMs" INTEGER,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 36,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);
