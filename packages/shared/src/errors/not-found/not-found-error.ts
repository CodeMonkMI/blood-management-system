import { ICustomError } from "../ICustomError";

export class NotFoundError implements ICustomError {
  private readonly code: number = 404;
  constructor(private message: string = "Your requested resource not found!") {}
  getCode(): number {
    return this.code;
  }
  getMessage(): string {
    return this.message;
  }
  getErrors(): string[] {
    return [this.message];
  }
}
