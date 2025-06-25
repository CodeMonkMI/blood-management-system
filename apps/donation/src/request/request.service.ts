import { NotFoundError } from "@bms/shared/errors";
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

  async getAll(): Promise<ResponseRequest[]> {
    const requestData = await this.requestRepo.getAll();

    return requestData.map(this.toResponseRequest);
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
