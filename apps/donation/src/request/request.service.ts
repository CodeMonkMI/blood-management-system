import { NotFoundError, ValidationError } from "@bms/shared/errors";
import { Pagination, PaginationParam } from "@bms/shared/types";
import {
  NewRequest,
  PublicRequest,
  Request,
  RequestId,
  ResponseRequest,
  UpdateRequest,
} from "./request.entities";
import { RequestRepository } from "./request.repository";

export class RequestService {
  constructor(
    private readonly requestRepo: RequestRepository = new RequestRepository()
  ) {}

  async getAll(
    data: PaginationParam
  ): Promise<{ data: ResponseRequest[]; pagination: Pagination }> {
    const { page = 1, limit = 10 } = data;
    const offset = limit * (page - 1);

    const totalItems = await this.requestRepo.count();
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages)
      throw new ValidationError("Bad request", [
        {
          code: "invalid_input",
          message: "Page is invalid!",
          path: ["page"],
        },
      ]);

    const pagination: Pagination = {
      limit,
      totalItems,
      totalPages,
      page: data.page!,
      ...(page < totalPages && { next: page + 1 }),
      ...(page > 1 && { prev: page - 1 }),
    };

    const requestData = await this.requestRepo.getAll({ offset, limit });

    return {
      data: requestData.map(this.toResponseRequest),
      pagination,
    };
  }

  async getSingle(id: string): Promise<ResponseRequest> {
    const request = await this.requestRepo.findById(id);

    if (!request) throw new NotFoundError();

    return this.toResponseRequest(request!);
  }

  async createPublic(data: NewRequest): Promise<PublicRequest> {
    const request = await this.requestRepo.create(data);

    return this.toPublicRequest(request);
  }

  async update(id: RequestId, data: UpdateRequest): Promise<ResponseRequest> {
    const findRequest = await this.requestRepo.findById(id);
    if (!findRequest) throw new NotFoundError();

    const updatedData = await this.requestRepo.update(id, data);

    return this.toResponseRequest(updatedData);
  }
  async verify(id: RequestId): Promise<ResponseRequest> {
    const findRequest = await this.requestRepo.findById(id);
    if (!findRequest) throw new NotFoundError();

    const updatedData = await this.requestRepo.update(id, {
      status: "verified",
    });

    return this.toResponseRequest(updatedData);
  }

  async remove(id: RequestId): Promise<void> {
    const findRequest = await this.requestRepo.findById(id);
    if (!findRequest) throw new NotFoundError();

    await this.requestRepo.update(id, { deletedAt: new Date() });
  }

  private toResponseRequest(request: Request): ResponseRequest {
    return {
      id: request.id,
      name: request.name,
      phone: request.phone,
      address: request.address,
      blood: request.blood,
      description: request.description,
      date: request.date,
      status: request.status,
      details: request.details,
      donor: request.donor,
      metadata: request.metadata,
      createdAt: request.createdAt,
    };
  }

  private toPublicRequest(request: Request): PublicRequest {
    return {
      id: request.id,
      name: request.name,
      phone: request.phone,
      address: request.address,
      blood: request.blood,
      description: request.description,
      date: request.date,
    };
  }
}
