import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const BloodType = pgEnum("blood_type", [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);

export const UserStatusType = pgEnum("user_status", [
  "progress",
  "hold",
  "suspended",
  "deleted",
]);

export const Blood = BloodType.enumValues;
export const UserStatus = UserStatusType.enumValues;

const id = uuid("id").primaryKey().defaultRandom();

export const UsersTable = pgTable("users", {
  id: id,
  email: varchar("email", { length: 255 }).unique(),
  blood: varchar("blood", { length: 255 }).notNull(),
  phonNo: varchar("phone_no", { length: 255 }).notNull(),
  lastDonation: timestamp("last_donation", { withTimezone: true }),
  status: UserStatusType("status").default("progress"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const ProfilesTable = pgTable("profile", {
  id: id,
  fullname: varchar("full_name", { length: 255 }).notNull(),
  fatherName: varchar("father_name", { length: 255 }),
  motherName: varchar("mother_name", { length: 255 }),
  address: varchar("address", { length: 255 }),
  upzila: varchar("upzila", { length: 255 }),
  zila: varchar("zila", { length: 255 }),
  user: uuid("user_id")
    .references(() => UsersTable.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type User = Omit<
  typeof UsersTable.$inferSelect,
  "updatedAt" | "deletedAt"
>;

export type NewUser = Omit<
  typeof UsersTable.$inferInsert & {
    fullname: (typeof ProfilesTable.$inferInsert)["fullname"];
  },
  "updatedAt" | "deletedAt" | "createdAt" | "id"
>;
export type UpdateUser = Partial<Omit<NewUser, "fullname">> & {
  deletedAt?: Date;
};
export type UserId = typeof UsersTable.id;

export type Profile = Omit<
  typeof ProfilesTable.$inferSelect,
  "updatedAt" | "deletedAt" | "user"
>;

export type NewProfile = Omit<
  typeof ProfilesTable.$inferInsert,
  "updatedAt" | "deletedAt" | "createdAt" | "id"
>;
export type UpdateProfile = Partial<NewProfile>;
export type ProfileId = typeof ProfilesTable.id;
