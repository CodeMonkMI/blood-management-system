import { NextFunction, Request, Response } from "express";
import { RequestService } from "./request.service";

export class RequestController {
  constructor(
    private readonly requestService: RequestService = new RequestService()
  ) {
    this.all = this.all.bind(this);
    this.single = this.single.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = await this.requestService.getAll();

      res.status(200).json({
        success: true,
        message: "Request Data fetched successfully",
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
      const requestData = await this.requestService.getSingle(id);

      res.status(200).json({
        success: true,
        message: "Request Data fetched successfully",
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
  create(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }
  update(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }
  remove(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

const { all, create, remove, single, update } = new RequestController();

export { all, create, remove, single, update };
