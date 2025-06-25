import { RequestRepository } from "@/request/request.repository";
import { NotFoundError, ValidationError } from "@bms/shared/errors";
import { Pagination, PaginationParam } from "@bms/shared/types";
import { History, NewHistory, ResponseHistory } from "./history.entities";
import { HistoryRepository } from "./history.repository";

export class HistoryService {
  constructor(
    private readonly historyRepo: HistoryRepository = new HistoryRepository(),
    private readonly requestRepo: RequestRepository = new RequestRepository()
  ) {}

  async getAll(
    data: PaginationParam & {
      requestId?: string;
    }
  ): Promise<{ data: ResponseHistory[]; pagination: Pagination }> {
    const { page = 1, limit = 10, requestId } = data;
    const offset = limit * (page - 1);

    const totalItems = await this.historyRepo.count(requestId);
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

    const historyData = await this.historyRepo.getAll({
      limit,
      offset,
      requestId,
    });

    return {
      data: historyData.map(this.toHistory),
      pagination,
    };
  }

  async getSingle(id: string): Promise<ResponseHistory> {
    const history = await this.historyRepo.findById(id);

    if (!history) throw new NotFoundError();

    return this.toHistory(history!);
  }

  async create(data: NewHistory): Promise<ResponseHistory> {
    const findRequest = await this.requestRepo.findById(data.request);
    if (!findRequest)
      throw new ValidationError("History creation failed", [
        {
          code: "invalid",
          path: ["request"],
          message: "Request Id must be valid!",
        },
      ]);

    const history = await this.historyRepo.create(data);

    return this.toHistory(history);
  }

  private toHistory(history: History): ResponseHistory {
    return {
      id: history.id,
      status: history.status,
      donor: history.donor,
      message: history.message,
      request: history.request,
      createdAt: history.createdAt,
    };
  }
}
