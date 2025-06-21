import { IValidationError, ZodError } from "../ICustomError";

export class ValidationError implements IValidationError {
  private readonly code: number = 400;
  constructor(
    private message: string,
    private errors: ZodError[]
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
