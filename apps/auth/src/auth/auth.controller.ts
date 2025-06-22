import { ValidationError, ZodError } from "@bms/shared/errors";
import { NextFunction, Request, Response } from "express";
import { AuthSchema } from "./auth.schemas";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthService = new AuthService()) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = AuthSchema.login.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Login failed!", errors);
      }

      const token = await this.authService.login(parsedData.data);

      res.status(202).json({ token });
      return;
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req.user as any)?.id;

      const user = await this.authService.me(id);

      res.status(200).json(user);
      return;
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = AuthSchema.register.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Registration failed!", errors);
      }
      const data = parsedData.data;

      await this.authService.login(data);

      // todo send create user request to user service

      res.status(202).json({ message: "User register successfully" });
      return;
    } catch (error) {
      next(error);
    }
  }
}

const { login, me, register } = new AuthController();

export { login, me, register };
