import { Error } from "../base/error";
import { ZodError } from "../ICustomError";

export class ValidationError extends Error {
  statusCode: number = 400;
  messageData: string = "Bad request";
  errorsData: ZodError[] = [];
  constructor(msg: string, errors: ZodError[] = []) {
    super();
    this.messageData = msg;

    this.errorsData = errors.map((err) => {
      return {
        code: err.code,
        message: err.message,
        path: err.path,
      };
    });
  }
}
