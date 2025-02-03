import { z } from "zod";

export const UpdatePartDtoSchema = z.object({
  reference: z.string().optional(),
  type: z.enum(["oil", "tire", "brake", "chain", "battery", "spark_plug", "air_filter", "clutch"], { 
    errorMap: () => ({ message: "Le type de pièce doit être 'oil', 'tire', 'brake', 'chain', 'battery', 'spark_plug', 'air_filter' ou 'clutch'." }) 
  }).optional(),
  name: z.string().min(3, { message: "Le nom de la pièce doit contenir au moins 3 caractères." }).optional(),
  quantityInStock: z.number().int().min(0, { message: "La quantité en stock doit être un nombre entier positif." }).optional(),
  partThreshold: z.number().int().min(0, { message: "Le seuil d'alerte doit être un nombre entier positif." }).optional(),
  unitPrice: z.number().min(0, { message: "Le prix unitaire doit être un nombre positif." }).optional(),
});

export type UpdatePartDto = z.infer<typeof UpdatePartDtoSchema>;
