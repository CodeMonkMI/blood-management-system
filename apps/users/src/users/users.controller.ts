import { BadRequestError, ValidationError, ZodError } from "@bms/shared/errors";
import { NextFunction, Request, Response } from "express";
import { UserSchema } from "./users.schemas";
import { UserService } from "./users.service";

type PaginationParam = {
  limit?: string;
  page?: string;
};

export class UsersController {
  constructor(private readonly userService: UserService = new UserService()) {
    this.all = this.all.bind(this);
    this.single = this.single.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.verify = this.verify.bind(this);
    this.demote = this.demote.bind(demote);
    this.getProfile = this.getProfile.bind(this);
    this.promote = this.promote.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  async all(req: Request<PaginationParam>, res: Response, next: NextFunction) {
    try {
      const { limit = "10", page = "1" } = req.query;
      const { data, pagination } = await this.userService.getAll({
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
      const requestData = await this.userService.getSingle(id as any);

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
      console.log("users");
      const parsedData = UserSchema.createUser.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Request creation failed", errors);
      }

      const newRequest = await this.userService.create(parsedData.data);

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

      const parsedData = UserSchema.updateUser.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Updated is invalid!", errors);
      }

      const updatedRequest = await this.userService.update(
        req.params.id! as any,
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
      await this.userService.remove(id as any);
      res.status(200).json({
        success: true,
        message: "User removed successfully",
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
      const updatedRequest = await this.userService.verify(id as any);
      res.status(200).json({
        success: true,
        message: "User verified successfully",
        data: updatedRequest,
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async promote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id!;
      const updatedRequest = await this.userService.promote(id as any);
      res.status(200).json({
        success: true,
        message: "User promoted successfully!",
        data: updatedRequest,
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async demote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id!;
      const updatedRequest = await this.userService.demote(id as any);
      res.status(200).json({
        success: true,
        message: "Request data demoted successfully!",
        data: updatedRequest,
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id!;
      const profileData = await this.userService.getProfile(id as any);
      console.log({ profileData });

      res.status(200).json({
        success: true,
        message: "User profile details fetched successfully",
        data: profileData,
        link: {
          self: "/",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (Object.keys(req.body).length <= 0) {
        throw new BadRequestError(
          "You must provide a request body to proceed further!"
        );
      }

      const parsedData = UserSchema.updateProfile.safeParse(req.body);
      if (!parsedData.success) {
        const errors = parsedData.error.errors as ZodError[];
        throw new ValidationError("Profile Update failed!", errors);
      }
      const updatedRequest = await this.userService.updateProfile(
        req.params.id! as any,
        parsedData.data
      );
      res.status(200).json({
        success: true,
        message: "Profile data updated successfully!",
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

const controller = new UsersController();

export const {
  all,
  single,
  create,
  update,
  remove,
  verify,
  demote,
  getProfile,
  promote,
  updateProfile,
} = controller;
