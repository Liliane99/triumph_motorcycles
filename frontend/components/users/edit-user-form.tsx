"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { User } from "@/lib/api";

// ✅ Schéma de validation
const editUserSchema = z.object({
  username: z.string()
    .min(3, { message: "Le nom doit contenir au moins 3 caractères." })
    .max(30, { message: "Le nom ne doit pas dépasser 30 caractères." }),

  email: z.string()
    .trim()
    .toLowerCase()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Adresse email invalide." }),

  phoneNumber: z.string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      { message: "Numéro de téléphone invalide (ex: +33612345678)." }
    ),

  role: z.enum(["manager", "client", "admin"], { required_error: "Le rôle est obligatoire." }),

  licenseNumber: z.string()
    .optional()
    .refine(
      (val) => !val || /^[A-Z0-9]{8,12}$/.test(val),
      { message: "Numéro de licence invalide (8 à 12 caractères, lettres et chiffres)." }
    ),

  experienceLevel: z.string().optional(),
});

// ✅ Typage du formulaire
type EditUserFormValues = z.infer<typeof editUserSchema>;

// ✅ Props du composant
interface EditUserFormProps {
  defaultValues: Partial<User>;
  onSubmit: (values: Partial<User>) => void;
  disableRole?: boolean;
}

export function EditUserForm({ defaultValues, onSubmit, disableRole = false }: EditUserFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: defaultValues.username || "",
      email: defaultValues.email || "",
      phoneNumber: defaultValues.phoneNumber || "",
      role: defaultValues.role || "client",
      licenseNumber: defaultValues.licenseNumber || "",
      experienceLevel: defaultValues.experienceLevel || "",
    },
  });

  const handleSubmit = async (values: EditUserFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
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
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input placeholder="+33612345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!disableRole && (
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
        )}

        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plaque d'immatriculation</FormLabel>
              <FormControl>
                <Input placeholder="AA-123-BB" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau d'expérience</FormLabel>
              <FormControl>
                <Input placeholder="Débutant, Intermédiaire, Avancé..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
}
