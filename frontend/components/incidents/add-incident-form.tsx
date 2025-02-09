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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ApiMotorcycle, getMotorcycles } from "@/lib/api";

const incidentSchema = z.object({
  reference: z.string()
    .regex(/^INC\d{5}$/, { message: "La référence doit suivre le format INCXXXXX." }),

  description: z.string()
    .min(10, { message: "La description doit contenir au moins 10 caractères." }),

  status: z.enum(["opened", "resolved"], {
    required_error: "Le statut est requis.",
  }),

  motorcycleId: z.string()
    .min(1, { message: "Veuillez sélectionner une moto." }),

  date: z.string()
    .min(1, { message: "La date est requise" }),
});

type IncidentFormValues = z.infer<typeof incidentSchema>;

type AddIncidentFormProps = {
  onSubmit: (values: IncidentFormValues) => void;
  defaultValues?: Partial<IncidentFormValues>;
  mode?: "create" | "edit";
};

export function AddIncidentForm({ onSubmit, defaultValues, mode = "create" }: AddIncidentFormProps) {
  const [motorcycles, setMotorcycles] = useState<ApiMotorcycle[]>([]);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const motos = await getMotorcycles();
        setMotorcycles(motos);
      } catch (error) {
        console.error('Erreur lors de la récupération des motos:', error);
      }
    };

    fetchMotorcycles();
  }, []);

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      reference: "",
      description: "",
      status: "opened",
      motorcycleId: "",
      date: new Date().toISOString().split('T')[0],
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

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
                <Input {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motorcycleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moto</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={mode === "edit"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une moto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {motorcycles.map((moto) => (
                    <SelectItem key={moto.id} value={moto.id}>
                      {moto.brand.value} - {moto.licensePlate.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description détaillée de l'incident" 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de l'incident</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="opened">En cours</SelectItem>
                  <SelectItem value="resolved">Résolu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {mode === "create" ? "Déclarer l'incident" : "Modifier l'incident"}
        </Button>
      </form>
    </Form>
  );
}