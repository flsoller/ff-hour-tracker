CREATE SCHEMA "hour_tracker";

DO $$ BEGIN
 CREATE TYPE "hour_tracker"."Role" AS ENUM('ADMIN', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "hour_tracker"."activity_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_name" text NOT NULL,
	"activity_description" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "hour_tracker"."members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email_address" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "hour_tracker"."organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "hour_tracker"."time_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"hours" integer NOT NULL,
	"minutes" integer NOT NULL,
	"activity_type_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"member_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "hour_tracker"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_address" text NOT NULL,
	"name" text,
	"password" text NOT NULL,
	"role" "hour_tracker"."Role" DEFAULT 'USER' NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "hour_tracker"."activity_types" ADD CONSTRAINT "activity_types_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "hour_tracker"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "hour_tracker"."members" ADD CONSTRAINT "members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "hour_tracker"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "hour_tracker"."time_logs" ADD CONSTRAINT "time_logs_activity_type_id_activity_types_id_fk" FOREIGN KEY ("activity_type_id") REFERENCES "hour_tracker"."activity_types"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "hour_tracker"."time_logs" ADD CONSTRAINT "time_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "hour_tracker"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "hour_tracker"."time_logs" ADD CONSTRAINT "time_logs_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "hour_tracker"."members"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "hour_tracker"."users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "hour_tracker"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "activity_type_activity_name_organization_id_unique_constraint" ON "hour_tracker"."activity_types" ("activity_name","organization_id");
CREATE UNIQUE INDEX IF NOT EXISTS "member_email_address_organization_id_unique_constraint" ON "hour_tracker"."members" ("email_address","organization_id");
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_address_organization_id_unique_constraint" ON "hour_tracker"."users" ("email_address","organization_id");