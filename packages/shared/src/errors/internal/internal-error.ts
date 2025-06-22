import { Error } from "../base/error";

export class InternalServerError extends Error {
  statusCode: number = 500;
  errorsData: any[] = [];
  messageData: string = "We sorry for the inconvenience. We will fix this asap";
  constructor(msg: string = "") {
    super();
    if (msg) this.messageData = msg;
  }
}
