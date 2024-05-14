import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { activityTypes } from './activity-type';
import { organizations } from './organization';
import { members } from './member';
import { hourTrackerSchema } from './shared/schema';

export const timeLogs = hourTrackerSchema.table('time_logs', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  date: timestamp('date').notNull(),
  hours: integer('hours').notNull(),
  minutes: integer('minutes').notNull(),
  activityTypeId: uuid('activity_type_id')
    .notNull()
    .references(() => activityTypes.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  memberId: uuid('member_id')
    .notNull()
    .references(() => members.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const timeLogsRelations = relations(timeLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [timeLogs.organizationId],
    references: [organizations.id],
  }),
  member: one(members, {
    fields: [timeLogs.memberId],
    references: [members.id],
  }),
  activity_type: one(activityTypes, {
    fields: [timeLogs.activityTypeId],
    references: [activityTypes.id],
  }),
}));
