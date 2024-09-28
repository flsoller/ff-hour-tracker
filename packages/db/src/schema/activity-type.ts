import { relations } from "drizzle-orm";
import { text, uuid, uniqueIndex, timestamp } from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { timeLogs } from "./time-log";
import { hourTrackerSchema } from "./shared/schema";

export const activityTypes = hourTrackerSchema.table(
  "activity_types",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    activityName: text("activity_name").notNull(),
    activityDescription: text("activity_description").notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      ActivityTypeActivityNameOrganizationIdUniqueConstraint: uniqueIndex(
        "activity_type_activity_name_organization_id_unique_constraint"
      ).on(table.activityName, table.organizationId),
    };
  }
);

export const activityTypesRelations = relations(
  activityTypes,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [activityTypes.organizationId],
      references: [organizations.id],
    }),
    timeLogs: many(timeLogs),
  })
);
