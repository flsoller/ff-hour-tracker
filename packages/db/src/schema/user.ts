import {
  text,
  uniqueIndex,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { relations } from "drizzle-orm";
import { hourTrackerSchema } from "./shared/schema";

export const Role = hourTrackerSchema.enum("Role", ["ADMIN", "USER"]);

export const users = hourTrackerSchema.table(
  "users",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    emailAddress: text("email_address").notNull(),
    name: text("name"),
    password: text("password").notNull(),
    role: Role("role").default("USER").notNull(),
    active: boolean("active").notNull().default(true),
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
      UserEmailAddressOrganizationIdUniqueConstraint: uniqueIndex(
        "user_email_address_organization_id_unique_constraint"
      ).on(table.emailAddress, table.organizationId),
    };
  }
);

export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));
