import { NotFoundError } from "@bms/shared/errors";
import {
  NewRequest,
  PublicRequest,
  Request,
  RequestId,
  UpdateRequest,
} from "./request.entities";
import { RequestRepository } from "./request.repository";

export class RequestService {
  constructor(
    private readonly requestRepo: RequestRepository = new RequestRepository()
  ) {}

  async getAll(): Promise<Request[]> {
    const requestData = await this.requestRepo.getAll();

    return requestData;
  }

  getSingle(id: string): Promise<Request> {
    const request = this.requestRepo.findById(id);

    if (!request) throw new NotFoundError();

    return request;
  }

  async createPublic(data: NewRequest): Promise<PublicRequest> {
    const request = await this.requestRepo.create(data);

    const { metadata, details, donor, status, ...rest } = request;

    const returnData: PublicRequest = {
      ...rest,
    };

    return returnData;
  }

  async update(id: RequestId, data: UpdateRequest): Promise<Request> {
    const findRequest = await this.requestRepo.findById(id);
    if (!findRequest) throw new NotFoundError();

    const updatedData = this.update(id, data);

    return updatedData;
  }

  async remove(id: RequestId): Promise<void> {
    const findRequest = await this.requestRepo.findById(id);
    if (!findRequest) throw new NotFoundError();

    await this.requestRepo.remove(id);
  }
}
