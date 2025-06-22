import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import passport from "passport";
import { PassportMiddleware } from "./auth/auth.middleware";
import authRouter from "./auth/auth.router";
import { PermissionManger } from "./pm";

dotenv.config();
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
      pm?: PermissionManger;
    }
  }
}
export function createApp() {
  const app: Express = express();

  // basic middlewares
  app.use(cors({ origin: true }));
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // auth middleware
  app.use(passport.initialize());
  new PassportMiddleware().init();

  app.use("/", authRouter);

  // health route
  app.get("/health", (req: Request, res: Response): any => {
    try {
      return res.status(200).json({ message: "UP" });
    } catch (e) {
      return res.status(500).json({ message: "DOWN" });
    }
  });

  // 404 not found handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Not found" });
  });

  // 500 internal server error handler
  app.use((err: any, _req: any, res: Response, _next: any) => {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something Went wrong! Please try again later!" });
  });

  return app;
}
