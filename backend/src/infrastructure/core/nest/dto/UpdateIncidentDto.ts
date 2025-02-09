import { z } from "zod";

export const UpdateIncidentDtoSchema = z.object({
  reference: z.string().min(5, { message: "La référence doit contenir au moins 5 caractères." }).optional(),
  description: z.string().min(5, { message: "La description doit contenir au moins 5 caractères." }).optional(),
  status: z.enum(["opened", "resolved"], {
    errorMap: () => ({ message: "Le statut doit être 'opened' ou 'resolved'." }),
  }).optional(),
});

export type UpdateIncidentDto = z.infer<typeof UpdateIncidentDtoSchema>;
