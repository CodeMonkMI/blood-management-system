import { BadRequestError, ValidationError, ZodError } from "@bms/shared/errors";
import { NextFunction, Request, Response } from "express";
import { RequestSchema } from "./request.schemas";
import { RequestService } from "./request.service";

type PaginationParam = {
  limit?: string;
  page?: string;
};

export class RequestController {
  constructor(
    private readonly requestService: RequestService = new RequestService()
  ) {
    this.all = this.all.bind(this);
    this.single = this.single.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.verify = this.verify.bind(this);
  }

  async all(req: Request<PaginationParam>, res: Response, next: NextFunction) {
    try {
      const { limit = "10", page = "1" } = req.query;

      const { data, pagination } = await this.requestService.getAll({
        limit: parseInt(limit as string),
        page: parseInt(page as string),
      });

      res.status(200).json({
        success: true,
        message: "Request Data fetched successfully",
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
      const requestData = await this.requestService.getSingle(id);

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
      const parsedData = RequestSchema.create.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Request creation failed", errors);
      }

      const newRequest = await this.requestService.createPublic(
        parsedData.data
      );

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
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (Object.keys(req.body).length <= 0) {
        throw new BadRequestError(
          "You must provide a request body to proceed further!"
        );
      }

      const parsedData = RequestSchema.update.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Login failed!", errors);
      }
      const updatedRequest = await this.requestService.update(
        req.params.id!,
        parsedData.data
      );
      res.status(200).json({
        success: true,
        message: "Request data updated successfully",
        data: updatedRequest,
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id!;
      await this.requestService.remove(id);
      res.status(200).json({
        success: true,
        message: "Request data deleted successfully",
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id!;
      const updatedRequest = await this.requestService.verify(id);
      res.status(200).json({
        success: true,
        message: "Request data verified successfully",
        data: updatedRequest,
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new RequestController();

export const { all, single, create, update, remove, verify } = controller;
