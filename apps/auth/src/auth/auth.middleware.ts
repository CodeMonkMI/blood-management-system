import { PermissionManger } from "@/pm";
import { UnauthenticatedError, UnauthorizedError } from "@bms/shared/errors";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
  VerifiedCallback,
} from "passport-jwt";

const SECRET_KEY = process.env.JWT_SECRET || "my_old_secret";

type JWTPayloadType = {
  id: string;
  email: string;
  user: string;
  iat: string;
  exp: string;
};

type AuthorizeOptions = {
  role: string;
  permissions: string | string[];
};

export class PassportMiddleware {
  constructor() {}

  async init() {
    const opts = this.getOptions();
    passport.use(new Strategy(opts, this.verifyUser()));
  }

  async authenticate(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("jwt", (err: any, data: any) => {
      if (err) {
        return next(err);
      }
      if (!data) {
        return res.status(401).json({
          message: "Unauthorized!",
        });
      }
      // todo update user types
      const user = data.user as any;
      const pm = new PermissionManger({
        roles: [user.role.toLocaleLowerCase()],
        permission: [],
      });
      req.user = user;
      req.pm = pm;

      return next();
    })(req, res, next);
  }

  authorize({ permissions, role }: AuthorizeOptions) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      if (!req.pm) {
        throw new UnauthenticatedError();
      }

      const checkRole = () => {
        if (!role) return true;
        return req.pm?.hasRole(role) ?? false;
      };

      const checkPermissions = () => {
        if (!permissions) return true;
        if (Array.isArray(permissions)) {
          return req.pm?.hasPermissions(permissions) ?? false;
        }
        return req.pm?.hasPermission(permissions);
      };

      const hasAccess = checkRole() && checkPermissions();

      if (!hasAccess) {
        throw new UnauthorizedError();
      }
      next();
    };
  }

  private getOptions(): StrategyOptionsWithoutRequest {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_KEY,
    };
  }

  private verifyUser() {
    return async (payload: JWTPayloadType, done: VerifiedCallback) => {
      try {
        const id = payload.id;
        if (!id) {
          return done(new UnauthenticatedError(), null);
        }

        // todo check if user exist

        return done(null, { user: {} });
      } catch (error) {
        return done(error, null);
      }
    };
  }
}

const { authenticate, authorize } = new PassportMiddleware();

export { authenticate, authorize };
