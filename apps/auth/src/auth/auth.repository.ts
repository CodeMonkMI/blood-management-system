import { db as database, DatabaseClient } from "@/db";
import { InternalServerError, NotFoundError } from "@bms/shared/errors";
import { eq } from "drizzle-orm";
import {
  NewUser,
  UpdateUser,
  User,
  UserId,
  UsersTable,
  UserWithPassword,
} from "./auth.entities";

export interface IAuthRepository {
  create(data: NewUser): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword | undefined>;
  update(id: UserId, data: UpdateUser): Promise<User | undefined>;
  remove(id: UserId): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  constructor(
    private db: DatabaseClient = database,
    private table = UsersTable
  ) {}
  async create(data: NewUser): Promise<User> {
    const user = await this.db.insert(this.table).values(data).returning({
      id: this.table.id,
      email: this.table.email,
      status: this.table.status,
      role: this.table.role,
      createdAt: this.table.createdAt,
    });

    return user[0]!;
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const data = await this.db
      .select({
        id: this.table.id,
        email: this.table.email,
        status: this.table.status,
        role: this.table.role,
        createdAt: this.table.createdAt,
      })
      .from(UsersTable)
      .where(eq(this.table.email, email))
      .execute();
    return data?.[0] || undefined;
  }
  async findByEmailWithPassword(
    email: string
  ): Promise<UserWithPassword | undefined> {
    const data = await this.db
      .select({
        id: this.table.id,
        email: this.table.email,
        status: this.table.status,
        role: this.table.role,
        createdAt: this.table.createdAt,
        password: this.table.password,
      })
      .from(UsersTable)
      .where(eq(this.table.email, email))
      .execute();
    return data?.[0] || undefined;
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

  async findById(id: UserId): Promise<User | undefined> {
    const userData = await this.db
      .select({
        id: this.table.id,
        email: this.table.email,
        status: this.table.status,
        role: this.table.role,
        createdAt: this.table.createdAt,
      })
      .from(this.table)
      .where(eq(this.table.id, id))
      .execute();
    if (!userData) return;
    return userData[0];
  }
}
