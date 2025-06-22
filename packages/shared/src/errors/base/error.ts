import { ICustomError } from "../ICustomError";

export abstract class Error implements ICustomError {
  abstract statusCode: number;
  abstract messageData: string;
  abstract errorsData: any[];

  get code(): number {
    return this.statusCode;
  }
  get message(): string {
    return this.messageData;
  }
  get errors(): string[] {
    return this.errorsData;
  }
}
