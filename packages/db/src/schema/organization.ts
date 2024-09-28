import { relations } from "drizzle-orm";
import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { activityTypes } from "./activity-type";
import { members } from "./member";
import { timeLogs } from "./time-log";
import { users } from "./user";
import { hourTrackerSchema } from "./shared/schema";

export const organizations = hourTrackerSchema.table("organizations", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  activity_types: many(activityTypes),
  timeLogs: many(timeLogs),
  users: many(users),
}));
