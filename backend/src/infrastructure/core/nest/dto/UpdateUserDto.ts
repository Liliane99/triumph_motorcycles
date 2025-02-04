import { z } from "zod";

export const UpdateUserDtoSchema = z.object({
  username: z.string().optional(),
  email: z.string().email({ message: "L'email n'est pas valide." }).optional(),
  role: z.enum(["manager", "client", "admin"], { 
    errorMap: () => ({ message: "Le rôle doit être 'manager', 'client' ou 'admin'." }) 
  }).optional(),
  phoneNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  experienceLevel: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
