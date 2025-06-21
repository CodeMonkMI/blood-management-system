export interface ICustomError {
  getCode(): number;
  getMessage(): string;
  getErrors(): unknown[];
}

export type ZodError = {
  code: string | number;
  expected?: string;
  received?: string;
  path: string[];
  message: string;
};

export interface IValidationError extends ICustomError {
  getErrors(): ZodError[];
}
