import { db as database, DatabaseClient } from "@/db";
import { NotFoundError } from "@bms/shared/errors";
import { and, eq, isNull } from "drizzle-orm";
import {
  History,
  HistoryId,
  HistoryTable,
  NewHistory,
} from "./history.entities";

type Pagination = {
  offset: number;
  limit: number;
  requestId?: string;
};

export interface IHistoryRepository {
  getAll(data: Pagination): Promise<History[]>;
  create(data: NewHistory): Promise<History>;
  findById(id: HistoryId): Promise<History | undefined>;
}

export class HistoryRepository implements IHistoryRepository {
  constructor(
    private db: DatabaseClient = database,
    private table = HistoryTable
  ) {}

  async getAll(
    data: Pagination = { limit: 10, offset: 0 }
  ): Promise<History[]> {
    const history = await this.db
      .select()
      .from(this.table)
      .where(
        and(
          isNull(this.table.deletedAt),
          data.requestId ? eq(this.table.request, data.requestId) : undefined
        )
      )
      .limit(data.limit)
      .offset(data.offset!)
      .execute();
    return history;
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

  async count(requestId?: Pagination["requestId"]): Promise<number> {
    return await this.db.$count(
      this.table,
      and(
        isNull(this.table.deletedAt),
        requestId ? eq(this.table.request, requestId) : undefined
      )
    );
  }
}
