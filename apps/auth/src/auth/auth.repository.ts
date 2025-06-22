export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

export type UserFilter = {
  completed?: boolean;
};

export type UserPagination = {
  page: number;
  limit: number;
};

export type UserID = string;

export enum UserRoleEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserRole = `${UserRoleEnum}`;

export type CreateUserDTO = {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
};
export type UpdateUserDTO = {
  email?: string;
  name?: string;
  role?: UserRole;
};

export type UserWithPassword = User & {
  password: string;
};

export interface IAuthRepository {
  findAll(options?: {
    filter?: UserFilter;
    pagination?: UserPagination;
  }): Promise<{ total: number; data: User[] }>;
  findById(id: UserID): Promise<User>;
  create(data: CreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword>;
  update(id: UserID, data: UpdateUserDTO): Promise<User>;
  remove(id: UserID): Promise<unknown>;
}

export class AuthRepository implements IAuthRepository {
  findAll(options?: {
    filter?: UserFilter;
    pagination?: UserPagination;
  }): Promise<{ total: number; data: User[] }> {
    throw new Error("Method not implemented.");
  }
  findById(id: UserID): Promise<User> {
    throw new Error("Method not implemented.");
  }
  create(data: CreateUserDTO): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findByEmailWithPassword(email: string): Promise<UserWithPassword> {
    throw new Error("Method not implemented.");
  }
  update(id: UserID, data: UpdateUserDTO): Promise<User> {
    throw new Error("Method not implemented.");
  }
  remove(id: UserID): Promise<unknown> {
    throw new Error("Method not implemented.");
  }

  private toUser(user: any): User {
    return {
      email: user.email,
      id: user.id,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
