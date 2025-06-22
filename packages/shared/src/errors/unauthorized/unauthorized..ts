import { ICustomError, ZodError } from "../ICustomError";

export class UnauthorizedError implements ICustomError {
  private readonly code: number = 403;
  private message: string = "You are not allow to perform this action";
  constructor(private errors: ZodError[] = []) {}
  getErrors(): ZodError[] {
    return this.errors;
  }
  getCode(): number {
    return this.code;
  }
  getMessage(): string {
    return this.message;
  }
}
