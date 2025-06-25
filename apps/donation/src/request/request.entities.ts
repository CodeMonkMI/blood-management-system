import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const id = uuid("id").primaryKey().defaultRandom();

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

export const Blood = BloodType.enumValues;

export const DonationStatus = pgEnum("request_status", [
  "pending",
  "verified",
  "progress",
  "ready",
  "hold",
  "completed",
]);

export const ReqDonationStatus = DonationStatus.enumValues;

export const RequestTable = pgTable("requests", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  date: varchar("date", { length: 255 }).notNull(),
  blood: BloodType("blood").notNull(),
  description: varchar("description", { length: 255 }),
  status: DonationStatus("status").default("pending").notNull(),
  metadata: varchar("metadata", { length: 255 }),
  donor: varchar("donor", { length: 255 }),
  details: varchar("details", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export type Request = typeof RequestTable.$inferSelect;
export type PublicRequest = Omit<
  Request,
  | "details"
  | "donor"
  | "status"
  | "metadata"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;
export type ResponseRequest = Omit<Request, "deletedAt" | "updatedAt">;
export type NewRequest = typeof RequestTable.$inferInsert;
export type UpdateRequest = Partial<typeof RequestTable.$inferInsert>;
export type RequestId = string;
