import { db as database, DatabaseClient } from "@/db";
import { InternalServerError, NotFoundError } from "@bms/shared/errors";
import { and, eq, isNull } from "drizzle-orm";
import {
  NewUser,
  UpdateUser,
  User,
  UserId,
  UsersTable,
} from "./users.entities";

type Pagination = {
  offset: number;
  limit: number;
};

export interface IUserRepository {
  getAll(data?: Pagination): Promise<User[]>;
  create(data: NewUser): Promise<User>;
  findById(id: UserId): Promise<User | undefined>;
  update(id: UserId, data: UpdateUser): Promise<User | undefined>;
  remove(id: UserId): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(
    private db: DatabaseClient = database,
    private table = UsersTable
  ) {}

  async getAll(data: Pagination = { limit: 10, offset: 0 }): Promise<User[]> {
    const { limit = 10, offset = 0 } = data;
    const user = await this.db
      .select()
      .from(this.table)
      .where(isNull(this.table.deletedAt))
      .limit(limit)
      .offset(offset!)
      .execute();
    return user;
  }

  async create(data: NewUser): Promise<User> {
    const user = await this.db.insert(this.table).values(data).returning();

    return user[0]!;
  }

  async update(id: UserId, data: UpdateUser): Promise<User> {
    const findUser = await this.findById(id);
    if (!findUser) throw new NotFoundError();
    const updatedData = await this.db.update(this.table).set(data).execute();
    if (!updatedData) throw new InternalServerError();
    return (await this.findById(id))!;
  }
  async remove(id: UserId): Promise<void> {
    const findUser = await this.findById(id);
    if (!findUser) throw new NotFoundError();
    await this.db.delete(this.table).where(eq(this.table.id, id)).execute();
  }

  async findById(id: UserId): Promise<User> {
    const userData = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), isNull(this.table.deletedAt)))
      .execute();
    if (!userData) throw new NotFoundError();
    return userData[0]!;
  }

  async count(): Promise<number> {
    return await this.db.$count(this.table, isNull(this.table.deletedAt));
  }
}
