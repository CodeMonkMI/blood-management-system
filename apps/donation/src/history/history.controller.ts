import { BadRequestError, ValidationError, ZodError } from "@bms/shared/errors";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { RequestSchema } from "./history.schemas";
import { HistoryService } from "./history.service";
type PaginationParam = {
  limit?: string;
  page?: string;
  request?: string;
};
export class HistoryController {
  constructor(
    private readonly historyService: HistoryService = new HistoryService()
  ) {
    this.all = this.all.bind(this);
    this.single = this.single.bind(this);
    this.create = this.create.bind(this);
  }

  async all(req: Request<PaginationParam>, res: Response, next: NextFunction) {
    try {
      const { limit = "10", page = "1" } = req.query;

      const requestIdParse = z
        .string()
        .uuid()
        .optional()
        .safeParse(req.query.request);

      if (!requestIdParse.success) {
        throw new ValidationError("History creation failed", [
          {
            code: "invalid_string",
            message: "Request Id must be valid!",
            path: ["request"],
          },
        ]);
      }

      const { data, pagination } = await this.historyService.getAll({
        limit: parseInt(limit as string),
        page: parseInt(page as string),
        requestId: requestIdParse.data,
      });

      res.status(200).json({
        success: true,
        message: "History fetched successfully",
        data,
        pagination,
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
