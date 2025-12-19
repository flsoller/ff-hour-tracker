ALTER TABLE "hour_tracker"."organizations" ALTER COLUMN "description" DROP NOT NULL;
ALTER TABLE "hour_tracker"."users" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "hour_tracker"."organizations" ADD COLUMN "auth_provider_id" text;
ALTER TABLE "hour_tracker"."users" ADD COLUMN "auth_provider_id" text;
ALTER TABLE "hour_tracker"."organizations" ADD CONSTRAINT "organizations_auth_provider_id_unique" UNIQUE("auth_provider_id");
ALTER TABLE "hour_tracker"."users" ADD CONSTRAINT "users_auth_provider_id_unique" UNIQUE("auth_provider_id");