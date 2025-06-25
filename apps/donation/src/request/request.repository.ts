import { db as database, DatabaseClient } from "@/db";
import { InternalServerError, NotFoundError } from "@bms/shared/errors";
import { and, eq, isNull } from "drizzle-orm";
import {
  NewRequest,
  PublicRequest,
  Request,
  RequestId,
  RequestTable,
  UpdateRequest,
} from "./request.entities";

type Pagination = {
  offset: number;
  limit: number;
};

export interface IRequestRepository {
  getAll(data?: Pagination): Promise<Request[]>;
  create(data: NewRequest): Promise<PublicRequest>;
  findById(id: RequestId): Promise<Request | undefined>;
  update(id: RequestId, data: UpdateRequest): Promise<Request | undefined>;
  remove(id: RequestId): Promise<void>;
}

export class RequestRepository implements IRequestRepository {
  constructor(
    private db: DatabaseClient = database,
    private table = RequestTable
  ) {}

  async getAll(
    data: Pagination = { limit: 10, offset: 0 }
  ): Promise<Request[]> {
    const user = await this.db
      .select()
      .from(this.table)
      .where(isNull(this.table.deletedAt))
      .limit(data.limit)
      .offset(data.offset!)
      .execute();
    return user;
  }

  async create(data: NewRequest): Promise<Request> {
    const user = await this.db.insert(this.table).values(data).returning();

    return user[0]!;
  }

  async update(id: RequestId, data: UpdateRequest): Promise<Request> {
    const findRequest = await this.findById(id);
    if (!findRequest) throw new NotFoundError();
    const updatedData = await this.db.update(this.table).set(data).execute();
    if (!updatedData) throw new InternalServerError();
    return (await this.findById(id))!;
  }
  async remove(id: RequestId): Promise<void> {
    const findRequest = await this.findById(id);
    if (!findRequest) throw new NotFoundError();
    await this.db.delete(this.table).where(eq(this.table.id, id)).execute();
  }

  async findById(id: RequestId): Promise<Request> {
    const requestData = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), isNull(this.table.deletedAt)))
      .execute();
    if (!requestData) throw new NotFoundError();
    return requestData[0]!;
  }

  async count(): Promise<number> {
    return await this.db.$count(this.table, isNull(this.table.deletedAt));
  }
}
