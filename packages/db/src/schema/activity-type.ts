import { relations } from "drizzle-orm";
import { text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { hourTrackerSchema } from "./shared/schema";
import { timeLogs } from "./time-log";

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
  (table) => [
    uniqueIndex(
      "activity_type_activity_name_organization_id_unique_constraint",
    ).on(table.activityName, table.organizationId),
  ],
);

export const activityTypesRelations = relations(
  activityTypes,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [activityTypes.organizationId],
      references: [organizations.id],
    }),
    timeLogs: many(timeLogs),
  }),
);
