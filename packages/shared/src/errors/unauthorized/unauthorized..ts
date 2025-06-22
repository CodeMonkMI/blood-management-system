import { Error } from "../base/error";

export class UnauthorizedError extends Error {
  statusCode: number = 401;
  messageData: string = "Unauthenticated";
  errorsData: any[] = [];
  constructor(msg: string = "") {
    super();
    if (msg) this.messageData = msg;
  }
}
