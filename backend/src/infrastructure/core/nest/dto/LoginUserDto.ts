import { z } from "zod";

export const LoginUserDtoSchema = z.object({
  email: z.string().email({ message: "L'email n'est pas valide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>;
