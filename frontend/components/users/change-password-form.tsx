"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const passwordSchema = z.object({
  currentPassword: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
  newPassword: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/, { message: "Le mot de passe doit contenir au moins une majuscule et un chiffre." }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les nouveaux mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof passwordSchema>;

interface ChangePasswordFormProps {
  onSubmit: (values: ChangePasswordFormValues) => Promise<void>;
}

export function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: ChangePasswordFormValues) => {
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
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mot de passe actuel" {...field} />
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
                <Input type="password" placeholder="Nouveau mot de passe" {...field} />
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
                <Input type="password" placeholder="Confirmez votre mot de passe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Changement en cours..." : "Changer le mot de passe"}
        </Button>
      </form>
    </Form>
  );
}
