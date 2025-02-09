import { z } from "zod";

export const CreateMaintenanceDtoSchema = z.object({
  reference: z.string().min(1, { message: "La référence de la maintenance est requise." }),
  date: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date().refine((date) => !isNaN(date.getTime()), { message: "La date de maintenance doit être valide." })
  ),
  recommendation: z.string().min(5, { message: "La recommandation doit contenir au moins 5 caractères." }),
  motorcycleId: z.string().uuid({ message: "L'ID de la moto est invalide." }),
});

export type CreateMaintenanceDto = z.infer<typeof CreateMaintenanceDtoSchema>;
