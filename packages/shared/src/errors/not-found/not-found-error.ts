import { Error } from "../base/error";

export class NotFoundError extends Error {
  statusCode: number = 404;
  errorsData: any[] = [];
  messageData: string = "Your requested resource not found!";
  constructor(msg: string = "") {
    super();
    if (msg) this.messageData = msg;
  }
}
