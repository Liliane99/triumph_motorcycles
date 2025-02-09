import { z } from "zod";

export const CreateIncidentDtoSchema = z.object({
  reference: z.string().min(5, { message: "La référence doit contenir au moins 5 caractères." }),
  description: z.string().min(5, { message: "La description doit contenir au moins 5 caractères." }),
  status: z.enum(["opened", "resolved"], {
    errorMap: () => ({ message: "Le statut doit être 'opened' ou 'resolved'." }),
  }).default("opened"),
  date: z.preprocess((val) => new Date(val as string), z.date().refine((date) => !isNaN(date.getTime()), {
    message: "La date doit être une date valide.",
  })),
  motorcycleId: z.string().uuid({ message: "L'ID de la moto doit être un UUID valide." }),
});

export type CreateIncidentDto = z.infer<typeof CreateIncidentDtoSchema>;
