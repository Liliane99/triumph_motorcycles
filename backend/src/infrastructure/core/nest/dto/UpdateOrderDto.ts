import { z } from "zod";

export const UpdateOrderDtoSchema = z.object({
  deliveryDate: z
    .preprocess(
      (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
      z.date().refine((date) => !isNaN(date.getTime()), { message: "La date de livraison doit être une date valide." })
    )
    .nullable()
    .optional(),
});

export type UpdateOrderDto = z.infer<typeof UpdateOrderDtoSchema>;
