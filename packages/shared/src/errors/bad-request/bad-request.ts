import { Error } from "../base/error";

export class BadRequestError extends Error {
  statusCode: number = 400;
  messageData: string = "Bad Request";
  errorsData: any[] = [];
  constructor(msg: string = "") {
    super();
    if (msg) this.messageData = msg;
  }
}
