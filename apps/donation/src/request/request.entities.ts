import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

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

export const RequestStatus = pgEnum("request_status", [
  "pending",
  "verified",
  "progress",
  "ready",
  "hold",
  "completed",
]);

export const RequestTable = pgTable("requests", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  date: varchar("date", { length: 255 }).notNull(),
  blood: BloodType("blood").notNull(),
  description: varchar("description", { length: 255 }),
  status: RequestStatus("status").default("pending").notNull(),
  metadata: varchar("metadata", { length: 255 }),
  donor: varchar("donor", { length: 255 }),
  details: varchar("details", { length: 255 }),
});

export type Request = typeof RequestTable.$inferSelect;
export type PublicRequest = Omit<
  Request,
  "details" | "donor" | "status" | "metadata"
>;
export type NewRequest = typeof RequestTable.$inferInsert;
export type UpdateRequest = typeof RequestTable.$inferInsert;
export type RequestId = string;
