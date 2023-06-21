-- CreateEnum
CREATE TYPE "status" AS ENUM ('WAITING', 'FLAGGED', 'PASSED', 'EXPIRED');

-- CreateTable
CREATE TABLE "verifications" (
    "verificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "ip" TEXT,
    "fingerprintId" TEXT,
    "status" "status" NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fingerprintsFingerprintId" TEXT,
    "fingerprintsuserId" TEXT,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("verificationId")
);

-- CreateTable
CREATE TABLE "fingerprints" (
    "fingerprintId" TEXT NOT NULL,
    "cookie_hash" TEXT NOT NULL,
    "plugin_hash" TEXT NOT NULL,
    "browser_hash" TEXT NOT NULL,
    "font_hash" TEXT NOT NULL,
    "device_hash" TEXT NOT NULL,
    "webgl_hash" TEXT NOT NULL,
    "audio_hash" TEXT NOT NULL,
    "canvas_hash" TEXT NOT NULL,
    "webgl_vendor" TEXT NOT NULL,
    "screen_resolution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fingerprints_pkey" PRIMARY KEY ("fingerprintId")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "fingerprintMatching" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fingerprintId" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fingerprintMatching_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_fingerprintsTousers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "verifications_verificationId_key" ON "verifications"("verificationId");

-- CreateIndex
CREATE UNIQUE INDEX "fingerprints_fingerprintId_key" ON "fingerprints"("fingerprintId");

-- CreateIndex
CREATE INDEX "fingerprints_fingerprintId_idx" ON "fingerprints"("fingerprintId");

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "fingerprintMatching_id_key" ON "fingerprintMatching"("id");

-- CreateIndex
CREATE INDEX "fingerprintMatching_userId_fingerprintId_idx" ON "fingerprintMatching"("userId", "fingerprintId");

-- CreateIndex
CREATE UNIQUE INDEX "_fingerprintsTousers_AB_unique" ON "_fingerprintsTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_fingerprintsTousers_B_index" ON "_fingerprintsTousers"("B");

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_fingerprintsuserId_fkey" FOREIGN KEY ("fingerprintsuserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_fingerprintsFingerprintId_fkey" FOREIGN KEY ("fingerprintsFingerprintId") REFERENCES "fingerprints"("fingerprintId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fingerprintMatching" ADD CONSTRAINT "fingerprintMatching_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fingerprintMatching" ADD CONSTRAINT "fingerprintMatching_fingerprintId_fkey" FOREIGN KEY ("fingerprintId") REFERENCES "fingerprints"("fingerprintId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fingerprintsTousers" ADD CONSTRAINT "_fingerprintsTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "fingerprints"("fingerprintId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fingerprintsTousers" ADD CONSTRAINT "_fingerprintsTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
