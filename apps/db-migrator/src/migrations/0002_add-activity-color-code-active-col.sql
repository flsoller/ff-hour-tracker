ALTER TABLE "hour_tracker"."activity_types" ADD COLUMN "active" boolean DEFAULT true NOT NULL;
ALTER TABLE "hour_tracker"."activity_types" ADD COLUMN "colorCode" char(6);
ALTER TABLE "hour_tracker"."members" ADD COLUMN "active" boolean DEFAULT true NOT NULL;