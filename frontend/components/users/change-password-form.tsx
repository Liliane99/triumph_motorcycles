"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Mot de passe actuel requis." }),
    newPassword: z
      .string()
      .min(12, { message: "Le nouveau mot de passe doit contenir au moins 12 caractères." })
      .regex(/[A-Z]/, { message: "Le mot de passe doit contenir une lettre majuscule." })
      .regex(/[a-z]/, { message: "Le mot de passe doit contenir une lettre minuscule." })
      .regex(/[0-9]/, { message: "Le mot de passe doit contenir un chiffre." })
      .regex(/[^a-zA-Z0-9]/, { message: "Le mot de passe doit contenir un caractère spécial." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

type ChangePasswordFormProps = {
  onSubmit: (values: PasswordFormValues) => void;
};

export function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: PasswordFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Votre mot de passe actuel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Votre nouveau mot de passe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirmez votre nouveau mot de passe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Chargement..." : "Changer le mot de passe"}
        </Button>
      </form>
    </Form>
  );
}
