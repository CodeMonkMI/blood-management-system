import { db as database, DatabaseClient } from "@/db";
import { NotFoundError } from "@bms/shared/errors";
import { and, eq, isNull } from "drizzle-orm";
import {
  History,
  HistoryId,
  HistoryTable,
  NewHistory,
} from "./history.entities";

export interface IHistoryRepository {
  getAll(): Promise<History[]>;
  create(data: NewHistory): Promise<History>;
  findById(id: HistoryId): Promise<History | undefined>;
}

export class HistoryRepository implements IHistoryRepository {
  constructor(
    private db: DatabaseClient = database,
    private table = HistoryTable
  ) {}

  async getAll(): Promise<History[]> {
    const user = await this.db
      .select()
      .from(this.table)
      .where(isNull(this.table.deletedAt))
      .execute();
    return user;
  }

  async create(data: NewHistory): Promise<History> {
    const user = await this.db.insert(this.table).values(data).returning();

    return user[0]!;
  }

  async findById(id: HistoryId): Promise<History> {
    const HistoryData = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id)))
      .execute();
    if (!HistoryData) throw new NotFoundError();
    return HistoryData[0]!;
  }
}
