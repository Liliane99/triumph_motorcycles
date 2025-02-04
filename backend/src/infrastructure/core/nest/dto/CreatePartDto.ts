import { z } from "zod";

export const CreatePartDtoSchema = z.object({
  reference: z.string().min(1, { message: "La référence de la pièce est requise." }),
  type: z.enum(["oil", "tire", "brake", "chain", "battery", "spark_plug", "air_filter", "clutch"], { 
    errorMap: () => ({ message: "Le type de pièce doit être 'oil', 'tire', 'brake', 'chain', 'battery', 'spark_plug', 'air_filter' ou 'clutch'." }) 
  }),
  name: z.string().min(3, { message: "Le nom de la pièce doit contenir au moins 3 caractères." }),
  quantityInStock: z.number().int().min(0, { message: "La quantité en stock doit être un nombre entier positif." }),
  partThreshold: z.number().int().min(0, { message: "Le seuil d'alerte doit être un nombre entier positif." }),
  unitPrice: z.number().min(0, { message: "Le prix unitaire doit être un nombre positif." }),
});

export type CreatePartDto = z.infer<typeof CreatePartDtoSchema>;
