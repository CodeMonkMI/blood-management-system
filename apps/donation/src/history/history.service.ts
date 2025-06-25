import { RequestRepository } from "@/request/request.repository";
import { NotFoundError, ValidationError } from "@bms/shared/errors";
import { History, NewHistory, ResponseHistory } from "./history.entities";
import { HistoryRepository } from "./history.repository";

export class HistoryService {
  constructor(
    private readonly historyRepo: HistoryRepository = new HistoryRepository(),
    private readonly requestRepo: RequestRepository = new RequestRepository()
  ) {}

  async getAll(): Promise<ResponseHistory[]> {
    const historyData = await this.historyRepo.getAll();

    return historyData.map(this.toHistory);
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
