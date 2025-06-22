import {
  BcryptJsHashPassword,
  HashPassword,
  ImplJsonWebToken,
} from "@bms/shared";
import { ValidationError, ZodError } from "@bms/shared/errors";
import { z } from "zod";
import { AuthRepository, User } from "./auth.repository";
import { AuthSchema } from "./auth.schemas";

export class AuthService {
  constructor(
    private readonly auth: AuthRepository = new AuthRepository(),
    private readonly hashPassword: HashPassword = new BcryptJsHashPassword(),
    private readonly jsonwebtoken: ImplJsonWebToken<{
      id: string;
      role: string;
    }> = new ImplJsonWebToken()
  ) {}

  async login(data: z.infer<typeof AuthSchema.login>): Promise<string> {
    const errors: ZodError[] = [
      {
        code: "custom",
        message: "Invalid Credentials!",
        path: ["email", "password"],
      },
    ];

    const user = await this.auth.findByEmailWithPassword(data.email);
    if (!user) {
      throw new ValidationError("Failed to login!", errors);
    }

    const isValid = await this.hashPassword.compare(
      data.password,
      user.password
    );

    if (!isValid) throw new ValidationError("Failed to login!", errors);

    const token: string = await this.jsonwebtoken.sign({
      id: user.id,
      role: user.role.toLocaleLowerCase(),
    });

    return token;
  }

  async me(id: string): Promise<User> {
    const user = await this.auth.findById(id);

    return user;
  }

  async register(data: z.infer<typeof AuthSchema.register>): Promise<User> {
    const user = await this.auth.findByEmail(data.email);

    if (user) {
      const errors: ZodError[] = [
        {
          code: "custom",
          message: "Email is already exists",
          path: ["email"],
        },
      ];
      throw new ValidationError("Email is already exists", errors);
    }

    const hashPassword = await this.hashPassword.hash(data.password);
    const createdUser = await this.auth.create({
      ...data,
      password: hashPassword,
    });

    return createdUser;
  }
}
