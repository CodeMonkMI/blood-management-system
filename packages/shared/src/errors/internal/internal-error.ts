import { ICustomError, ZodError } from "../ICustomError";

export class InternalServerError implements ICustomError {
  private readonly code: number = 500;
  constructor(
    private message: string = "Internal Server Error",
    private errors: ZodError[] = []
  ) {}
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
