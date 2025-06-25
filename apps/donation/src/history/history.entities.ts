import { DonationStatus, RequestTable } from "@/request/request.entities";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const id = uuid("id").primaryKey().defaultRandom();

export const HistoryTable = pgTable("history", {
  id,
  request: uuid("request")
    .references(() => RequestTable.id)
    .notNull(),
  status: DonationStatus("status").default("pending").notNull(),
  donor: varchar("donor", { length: 255 }).notNull(),
  message: varchar("details", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export type History = typeof HistoryTable.$inferSelect;
export type ResponseHistory = Omit<History, "deletedAt">;
export type NewHistory = typeof HistoryTable.$inferInsert;
export type HistoryId = string;
