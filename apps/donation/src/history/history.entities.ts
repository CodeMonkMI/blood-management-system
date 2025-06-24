import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const UserType = pgEnum("users_role", ["super_admin", "admin", "user"]);

export const UserStatus = pgEnum("user_status", [
  "pending",
  "progress",
  "verified",
  "hold",
  "suspended",
  "deleted",
]);

const id = uuid("id").primaryKey().defaultRandom();

export const UsersTable = pgTable("users", {
  id: id,
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("name", { length: 255 }).notNull(),
  status: UserStatus("status").default("pending"),
  role: uuid("role")
    .references(() => RoleTable.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const RoleTable = pgTable("roles", {
  id: id,
  name: varchar("name", { length: 255 }),
  role: UserType("role").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type UserWithPassword = Omit<
  typeof UsersTable.$inferSelect,
  "updatedAt" | "deletedAt"
>;
export type User = Omit<UserWithPassword, "password">;
export type NewUser = typeof UsersTable.$inferInsert;
export type UpdateUser = Partial<User>;
export type UserId = typeof UsersTable.id;

export type NewRole = typeof RoleTable.$inferInsert;
export type UserRole = typeof RoleTable.$inferSelect;
