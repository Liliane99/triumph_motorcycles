"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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

const addUserSchema = z.object({
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

  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/, { message: "Le mot de passe doit contenir au moins une majuscule et un chiffre." }),

  role: z.enum(["manager", "client", "admin"], { required_error: "Le rôle est obligatoire." }),

  licenseNumber: z.string()
    .optional()
    .refine(
      (val) => !val || /^[A-Z0-9]{8,12}$/.test(val),
      { message: "Numéro de licence invalide (8 à 12 caractères, lettres et chiffres)." }
    ),

  experienceLevel: z.string().optional(),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

export function AddUserForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: generatePassword(12),
      role: "client",
      licenseNumber: "",
      experienceLevel: "",
    },
  });

  function generatePassword(length: number) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }

  const onSubmit = async (values: AddUserFormValues) => {
    if (!user || !user.role) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    if (user.role !== "admin" && user.role !== "manager") {
      toast.error("Vous n'êtes pas autorisé à ajouter un utilisateur.");
      return;
    }

    setLoading(true);
    try {
      await createUser(values, localStorage.getItem("token") || "");
      toast.success("Utilisateur ajouté avec succès !");
      router.push("/dashboard/users");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur inconnue est survenue.");
      }      
    } finally {
      setLoading(false);
    }
  };

  const availableRoles =
    user?.role === "admin"
      ? ["admin", "manager", "client"]
      : user?.role === "manager"
      ? ["manager", "client"]
      : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="text" readOnly {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permis</FormLabel>
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
          {loading ? "Ajout en cours..." : "Ajouter utilisateur"}
        </Button>
      </form>
    </Form>
  );
}
