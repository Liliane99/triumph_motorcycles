import { z } from "zod";

export const CreateUserDtoSchema = z.object({
  username: z.string().min(1, { message: "Le nom d'utilisateur est requis." }),
  email: z.string().email({ message: "L'email n'est pas valide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
  role: z.enum(["manager", "client", "admin"], { 
    errorMap: () => ({ message: "Le rôle doit être 'manager', 'client' ou 'admin'." }) 
  }),
  phoneNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  experienceLevel: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
