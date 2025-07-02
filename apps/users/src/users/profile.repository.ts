import { db as database, DatabaseClient } from "@/db";
import { InternalServerError, NotFoundError } from "@bms/shared/errors";
import { and, eq } from "drizzle-orm";
import {
  NewProfile,
  Profile,
  ProfileId,
  ProfilesTable,
  UpdateProfile,
  UserId,
} from "./users.entities";

export interface IProfileRepository {
  create(data: NewProfile): Promise<Profile>;
  findById(id: ProfileId): Promise<Profile | undefined>;
  findByUserId(id: UserId): Promise<Profile | undefined>;
  update(id: ProfileId, data: UpdateProfile): Promise<Profile | undefined>;
}

export class ProfileRepository implements IProfileRepository {
  constructor(
    private db: DatabaseClient = database,
    private table = ProfilesTable
  ) {}

  async create(data: NewProfile): Promise<Profile> {
    const user = await this.db.insert(this.table).values(data).returning();

    return user[0]!;
  }

  async update(id: ProfileId, data: UpdateProfile): Promise<Profile> {
    const findProfile = await this.findById(id);
    if (!findProfile) throw new NotFoundError();
    const updatedData = await this.db.update(this.table).set(data).execute();
    if (!updatedData) throw new InternalServerError();
    return (await this.findById(id))!;
  }

  async findById(id: ProfileId): Promise<Profile> {
    const requestData = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id)))
      .execute();
    if (!requestData) throw new NotFoundError();
    return requestData[0]!;
  }

  async findByUserId(id: UserId): Promise<Profile> {
    const requestData = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.user, id)))
      .execute();
    if (!requestData) throw new NotFoundError();
    return requestData[0]!;
  }
}
