import { ReqDonationStatus } from "@/request/request.entities";
import { z } from "zod";
import {} from "./history.entities";

export class RequestSchema {
  private static createSchema = z.object({
    donor: z
      .string({ message: "Donor Id is required!" })
      .min(1, { message: "Donor Id is required!" })
      .uuid({ message: "Donor Id must be valid" }),
    request: z
      .string({ message: "Request id is required!" })
      .min(1, { message: "Request id is required!" })
      .uuid({ message: "Request Id must be valid" }),
    status: z.enum(ReqDonationStatus, {
      message: "Status is required and must be valid",
    }),
    message: z
      .string({ message: "Message is required!" })
      .min(1, { message: "Message is required!" }),
  });

  static get create() {
    return this.createSchema;
  }
}
