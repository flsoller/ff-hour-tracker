import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { organizations } from './organization';
import { timeLogs } from './time-log';
import { hourTrackerSchema } from './shared/schema';

export const members = hourTrackerSchema.table(
  'members',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    emailAddress: text('email_address').notNull(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      MemberEmailAddressOrganizationIdUniqueConstraint: uniqueIndex(
        'member_email_address_organization_id_unique_constraint'
      ).on(table.emailAddress, table.organizationId),
    };
  }
);

export const membersRelations = relations(members, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  timeLogs: many(timeLogs),
}));
