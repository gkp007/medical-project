ALTER TABLE "Investigation"
  ADD COLUMN IF NOT EXISTS "ratelistGender" TEXT NOT NULL DEFAULT 'Both',
  ADD COLUMN IF NOT EXISTS "isActiveInRatelist" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS "LaboratoryUnit" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LaboratoryUnit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "LaboratoryUnit_name_key" ON "LaboratoryUnit"("name");
