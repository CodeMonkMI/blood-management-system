import { Error } from "@bms/shared/errors";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import historyRouter from "./history/history.router";
import requestRouter from "./request/request.router";

dotenv.config();

export function createApp() {
  const app: Express = express();

  // basic middlewares
  app.use(cors({ origin: true }));
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/request", requestRouter);
  app.use("/history", historyRouter);

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
    let statusCode = 500;
    let responseMessage: {
      success: boolean;
      message: string;
      data?: string[];
    } = {
      success: false,
      message: "Something Went wrong! Please try again later!",
    };
    console.log(err);
    if (err instanceof Error) {
      statusCode = err.code;
      responseMessage.message = err.message;
      if (err.errors.length > 0) {
        responseMessage.data = err.errors;
      }
    }
    res.status(statusCode).json(responseMessage);
  });

  return app;
}
