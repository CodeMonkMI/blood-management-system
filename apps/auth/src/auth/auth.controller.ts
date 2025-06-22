import {
  InternalServerError,
  ValidationError,
  ZodError,
} from "@bms/shared/errors";
import { NextFunction, Request, Response } from "express";
import { User } from "./auth.entities";
import { authorizeRoute } from "./auth.middleware";
import { AuthSchema } from "./auth.schemas";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthService = new AuthService()) {
    this.login = this.login.bind(this);
    this.me = this.me.bind(this);
    this.register = this.register.bind(this);
    this.authorize = this.authorize.bind(this);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = AuthSchema.login.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Login failed!", errors);
      }

      const access_token = await this.authService.login(parsedData.data);

      res.status(200).json({
        success: true,
        message: "User register successfully",
        data: {
          access_token,
        },
        links: {
          self: "/auth/login",
          me: "/auth/me",
          request: "/request",
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req.user as User)?.id;

      const user = await this.authService.me(id as any);

      res.status(200).json({
        success: true,
        message: "User register successfully",
        data: user,
        links: {
          self: "/auth/me",
        },
      });
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

      const access_token = await this.authService.register(data);

      // todo send create user request to user service

      res.status(201).json({
        success: true,
        message: "User register successfully",
        data: {
          access_token,
        },
        links: {
          self: "/auth/register",
          me: "/auth/me",
          request: "/request",
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  async authorize(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.pm) throw new InternalServerError();

      const parsedData = AuthSchema.authorize.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Bad Request", errors);
      }
      const data = parsedData.data;
      const isAuthorize = authorizeRoute({
        permissions: data.permission || "",
        role: data.role || "",
      });

      if (!isAuthorize) throw new InternalServerError();

      res.status(200).json({ success: true, message: "User authorized" });
      return;
    } catch (error) {
      next(error);
    }
  }
}

const { login, me, register, authorize } = new AuthController();

export { authorize, login, me, register };
