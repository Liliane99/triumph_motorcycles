import { z } from "zod";

export const CreateOrderDtoSchema = z.object({
  reference: z.string().min(1, { message: "La référence de la commande est requise." }),
  // orderDate: z.preprocess(
  //   (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
  //   z.date().refine((date) => !isNaN(date.getTime()), { message: "La date de commande doit être une date valide." })
  // ),
  // deliveryDate: z
  //   .preprocess(
  //     (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
  //     z.date().refine((date) => !isNaN(date.getTime()), { message: "La date de livraison doit être une date valide." })
  //   )
  //   .nullable()
  //   .optional(),
  orderDate: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date().refine((date) => !isNaN(date.getTime()), { message: "La date de commande doit être valide." })
  ),
  deliveryDate: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date().refine((date) => !isNaN(date.getTime()), { message: "La date de livraison doit être valide." })
  ).nullable().optional(),  
});

export type CreateOrderDto = z.infer<typeof CreateOrderDtoSchema>;
