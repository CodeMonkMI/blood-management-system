import { z } from "zod";

enum BLOOD_TYPE {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}

export class AuthSchema {
  private static loginUser = z.object({
    email: z.string().min(1, "Email is required!"),
    password: z.string().min(1, "Password is required!"),
  });

  private static registerUser = z.object({
    name: z.string().min(1, "Name is required!"),
    email: z
      .string()
      .min(1, "Email is required!")
      .email("Email must be valid!"),
    password: z
      .string()
      .min(1, "Password is required!")
      .min(6, "Password must be more than 6 chars")
      .max(32, "Password must not be more than 32 chars"),
    blood: z.nativeEnum(BLOOD_TYPE),
  });
  private static authorizeRoute = z
    .object({
      role: z.string().optional(),
      permission: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.role && !data.permission) {
        ctx.addIssue({
          code: "custom",
          path: ["role", "permission"],
          message: "Either role or permission is required!",
          fatal: true,
        });
        return;
      }
      return data;
    });

  static get login() {
    return this.loginUser;
  }

  static get register() {
    return this.registerUser;
  }
  static get authorize() {
    return this.authorizeRoute;
  }
}
