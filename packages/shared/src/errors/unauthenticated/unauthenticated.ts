import { ICustomError, ZodError } from "../ICustomError";

export class Unauthenticated implements ICustomError {
  private readonly code: number = 400;
  private message: string = "Unauthenticated";
  constructor(private errors: ZodError[]) {}
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
