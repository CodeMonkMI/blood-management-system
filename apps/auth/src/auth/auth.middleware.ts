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
import { AuthRepository } from "./auth.repository";

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
type AuthorizeRouteOptions = {
  role: string;
  permissions: string | string[];
};

export class PassportMiddleware {
  constructor(
    private readonly authRepository: AuthRepository = new AuthRepository()
  ) {}

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
        throw new UnauthenticatedError();
      }

      const user = data.user;
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

  authorizeRoute({ permissions, role }: AuthorizeRouteOptions) {
    const pm = new PermissionManger({
      roles: [role.toLocaleLowerCase()],
      permission: [],
    });
    const checkRole = () => {
      if (!role) return true;
      return pm?.hasRole(role) ?? false;
    };

    const checkPermissions = () => {
      if (!permissions) return true;
      if (Array.isArray(permissions)) {
        return pm?.hasPermissions(permissions) ?? false;
      }
      return pm?.hasPermission(permissions);
    };

    const hasAccess = checkRole() && checkPermissions();

    if (!hasAccess) throw new UnauthorizedError();

    return true;
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

        const user = await this.authRepository.findById(id as any);

        if (!user) throw new UnauthenticatedError();

        return done(null, { user });
      } catch (error) {
        return done(error, null);
      }
    };
  }
}

const { authenticate, authorize, authorizeRoute } = new PassportMiddleware();

export { authenticate, authorize, authorizeRoute };
