import { z } from "zod";

export const UpdateMaintenanceDtoSchema = z.object({
  recommendation: z.string().min(5, { message: "La recommandation doit contenir au moins 5 caractères." }).optional(),
  date: z
    .preprocess(
      (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
      z.date().refine((date) => !isNaN(date.getTime()), { message: "La date de maintenance doit être une date valide." })
    )
    .optional(),
});

export type UpdateMaintenanceDto = z.infer<typeof UpdateMaintenanceDtoSchema>;
