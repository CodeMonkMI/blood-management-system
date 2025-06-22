export interface ICustomError {
  get code(): number;
  get message(): string;
  get errors(): any[];
}

export type ZodError = {
  code: string | number;
  path: string[];
  message: string;
};
