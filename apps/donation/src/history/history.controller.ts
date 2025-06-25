import { BadRequestError, ValidationError, ZodError } from "@bms/shared/errors";
import { NextFunction, Request, Response } from "express";
import { RequestSchema } from "./history.schemas";
import { HistoryService } from "./history.service";

export class HistoryController {
  constructor(
    private readonly historyService: HistoryService = new HistoryService()
  ) {
    this.all = this.all.bind(this);
    this.single = this.single.bind(this);
    this.create = this.create.bind(this);
  }

  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = await this.historyService.getAll();

      res.status(200).json({
        success: true,
        message: "History fetched successfully",
        data: requestData,
        pagination: {},
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async single(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.id!;
      const requestData = await this.historyService.getSingle(id);

      res.status(200).json({
        success: true,
        message: "Request Data fetched successfully",
        data: requestData,
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length <= 0) {
        throw new BadRequestError(
          "You must provide a request body to proceed further!"
        );
      }
      const parsedData = RequestSchema.create.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("History creation failed", errors);
      }

      const newRequest = await this.historyService.create(parsedData.data);

      res.status(201).json({
        success: true,
        message: "Request added successfully",
        data: newRequest,
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new HistoryController();

export const { all, single, create } = controller;
