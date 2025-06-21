import { ICustomError } from "../ICustomError";

export class Error implements ICustomError {
  constructor(
    private readonly code: number,
    private message: string,
    private errors: string[]
  ) {}
  getCode(): number {
    return this.code;
  }
  getMessage(): string {
    return this.message;
  }
  getErrors(): string[] {
    return this.errors;
  }
}
