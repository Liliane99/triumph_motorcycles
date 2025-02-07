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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const partSchema = z.object({
  reference: z.string().min(1, { message: "La référence est requise." }),
  type: z.enum(["oil", "tire", "brake", "chain", "battery", "spark_plug", "air_filter", "clutch"], {
    required_error: "Le type est requis.",
  }),
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  quantityInStock: z.number().int().min(0, { message: "La quantité doit être positive." }),
  partThreshold: z.number().int().min(0, { message: "Le seuil doit être positif." }),
  unitPrice: z.number().min(0, { message: "Le prix doit être positif." }),
});

type PartFormValues = z.infer<typeof partSchema>;

type AddPartFormProps = {
  onSubmit: (values: PartFormValues) => void;
  defaultValues?: Partial<PartFormValues>;
  mode?: "create" | "edit";
};

export function AddPartForm({ onSubmit, defaultValues, mode = "create" }: AddPartFormProps) {
  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      reference: "",
      type: "oil",
      name: "",
      quantityInStock: 0,
      partThreshold: 0,
      unitPrice: 0,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, mode, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Référence</FormLabel>
              <FormControl>
                <Input placeholder="Référence unique" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la pièce" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oil">Huile</SelectItem>
                    <SelectItem value="tire">Pneu</SelectItem>
                    <SelectItem value="brake">Frein</SelectItem>
                    <SelectItem value="chain">Chaîne</SelectItem>
                    <SelectItem value="battery">Batterie</SelectItem>
                    <SelectItem value="spark_plug">Bougie</SelectItem>
                    <SelectItem value="air_filter">Filtre à air</SelectItem>
                    <SelectItem value="clutch">Embrayage</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantityInStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité en stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seuil dalerte</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix unitaire (€)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {mode === "create" ? "Ajouter la pièce" : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
}
