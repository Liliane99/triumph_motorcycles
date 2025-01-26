"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const addUserSchema = z.object({
  user_name: z.string().min(2, { message: "Raison sociale requise (min 2 caractères)." }),
  email: z
    .string()
    .email({ message: "Adresse email invalide." })
    .min(1, { message: "Email obligatoire." }),
  phone_number: z
    .string()
    .min(10, { message: "Numéro de téléphone requis (min 10 caractères)." })
    .max(15, { message: "Numéro de téléphone invalide (max 15 caractères)." }),
  password: z.string().min(12, { message: "Mot de passe généré invalide." }),
  role: z.enum(["manager", "client", "admin"], { required_error: "Role obligatoire." }),
  license_number: z.string().optional(),
  experience_level: z.string().optional(),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

type AddUserFormProps = {
  onSubmit: (values: AddUserFormValues) => void;
  defaultValues?: Partial<AddUserFormValues>;
  mode?: "create" | "edit"; 
};

export function AddUserForm({ onSubmit, defaultValues, mode = "create" }: AddUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      user_name: "",
      email: "",
      phone_number: "",
      password: mode === "edit" ? undefined : generatePassword(12),
      role: "client",
      license_number: "",
      experience_level: "",
      ...defaultValues, 
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      form.reset(defaultValues); 
    }
  }, [defaultValues, mode, form]);

  function generatePassword(length: number) {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raison sociale</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'utilisateur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="exemple@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input placeholder="Exemple : 0612345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "create" && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="absolute inset-y-0 right-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Cacher" : "Afficher"}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Un mot de passe sécurisé a été généré automatiquement.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plaque immatriculation</FormLabel>
              <FormControl>
                <Input placeholder="Exemple : AA-123-BB" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau expérience</FormLabel>
              <FormControl>
                <Input placeholder="Débutant, Intermédiaire, Avancé..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {mode === "create" ? "Ajouter utilisateur" : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
}
