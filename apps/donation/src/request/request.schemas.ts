import { z } from "zod";
import { Blood, ReqDonationStatus } from "./request.entities";

export class RequestSchema {
  private static createSchema = z.object({
    name: z
      .string({ message: "Name is required!" })
      .min(1, { message: "Name is required!" }),
    phone: z
      .string({ message: "Name is required!" })
      .min(1, { message: "Name is required!" })
      .min(11, { message: "Phone number must be valid!" }),
    address: z
      .string({ message: "Address is required!" })
      .min(1, { message: "Address is required!" }),
    date: z
      .string({ message: "Date is required!" })
      .min(1, { message: "Date is required!" }),
    blood: z.enum(Blood, { message: "Blood is required and must be valid" }),
    description: z
      .string({ message: "Description is required!" })
      .min(1, { message: "Description is required!" }),
  });
  private static updateSchema = this.createSchema
    .merge(
      z.object({
        status: z.enum(ReqDonationStatus),
      })
    )
    .partial();

  static get create() {
    return this.createSchema;
  }
  static get update() {
    return this.updateSchema;
  }
}
