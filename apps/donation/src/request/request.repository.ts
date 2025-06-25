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

export interface IRequestRepository {
  getAll(): Promise<Request[]>;
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

  async getAll(): Promise<Request[]> {
    const user = await this.db
      .select()
      .from(this.table)
      .where(isNull(this.table.deletedAt))
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
}
