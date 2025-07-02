import { z } from "zod";
import { Blood } from "./users.entities";

export class UserSchema {
  private static baseUserSchema = z.object({
    email: z
      .string({ message: "Email is required!" })
      .email({ message: "Invalid email format!" }),
    blood: z.enum(Blood, {
      message: "Blood type is required and must be valid!",
    }),
    phonNo: z
      .string({ message: "Phone number is required!" })
      .min(11, { message: "Phone number must be at least 11 characters!" }),
    lastDonation: z
      .string({
        required_error: "Last donation date is required!",
      })
      .datetime({
        message: "Last donation must be a valid ISO date-time!",
      })
      .transform((val) => new Date(val)),
  });

  private static baseProfileSchema = z.object({
    fullname: z
      .string({ message: "Full name is required!" })
      .min(1, { message: "Full name cannot be empty!" }),
    fatherName: z
      .string({ message: "Father's name is required!" })
      .min(1, { message: "Father's name cannot be empty!" })
      .optional(),
    motherName: z
      .string({ message: "Mother's name is required!" })
      .min(1, { message: "Mother's name cannot be empty!" })
      .optional(),
    address: z
      .string({ message: "Address is required!" })
      .min(1, { message: "Address cannot be empty!" })
      .optional(),
    upzila: z
      .string({ message: "Upzila is required!" })
      .min(1, { message: "Upzila cannot be empty!" })
      .optional(),
    zila: z
      .string({ message: "Zila is required!" })
      .min(1, { message: "Zila cannot be empty!" })
      .optional(),
    user_id: z
      .string({ message: "User ID is required!" })
      .uuid({ message: "User ID must be a valid UUID!" }),
  });

  private static createUserSchema = this.baseUserSchema.merge(
    z.object({
      fullname: this.baseProfileSchema.shape.fullname,
    })
  );

  private static updateUserSchema = this.baseUserSchema
    .omit({ email: true })
    .partial();

  private static createProfileSchema = this.baseProfileSchema;
  private static updateProfileSchema = this.baseProfileSchema.partial();

  static get createUser() {
    return this.createUserSchema;
  }
  static get updateUser() {
    return this.updateUserSchema;
  }

  static get createProfile() {
    return this.createProfileSchema;
  }
  static get updateProfile() {
    return this.updateProfileSchema;
  }
}
