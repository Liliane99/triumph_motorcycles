"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash } from "lucide-react";

export type Part = {
  name: string;
  reference: string;
  quantity: number | undefined;
  unitPrice: number | undefined;
};

export type MaintenanceFormValues = {
  reference: string;
  date: Date | undefined;
  plaque: string;
  client: string;
  recommendations?: string;
  parts: Part[];
};

const maintenanceSchema = z.object({
  reference: z.string().min(1, { message: "Référence obligatoire." }),
  date: z.date({ required_error: "La date est obligatoire." }).nullable(),
  plaque: z.string().min(1, { message: "Plaque d'immatriculation obligatoire." }),
  client: z.string().min(1, { message: "Client obligatoire." }),
  recommendations: z.string().optional(),
  parts: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Nom de la pièce obligatoire." }),
        reference: z.string().min(1, { message: "Référence obligatoire." }),
        quantity: z.number().positive().or(z.literal(undefined)),
        unitPrice: z.number().positive().or(z.literal(undefined)),
      })
    )
    .nonempty({ message: "Au moins une pièce est requise." }),
});

type AddMaintenanceFormProps = {
  onSubmit: (values: MaintenanceFormValues) => void;
  defaultValues?: Partial<MaintenanceFormValues>;
  mode?: "create" | "edit";
};

export function AddMaintenanceForm({
  onSubmit,
  defaultValues,
  mode = "create",
}: AddMaintenanceFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    defaultValues?.date || undefined
  );

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      reference: "",
      date: undefined,
      plaque: "",
      client: "",
      recommendations: "",
      parts: [{ name: "", reference: "", quantity: undefined, unitPrice: undefined }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "parts",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Référence</FormLabel>
              <FormControl>
                <Input placeholder="Référence de l'entretien" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={() => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {date ? format(date, "dd/MM/yyyy") : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate || undefined);
                        form.setValue("date", selectedDate || undefined);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plaque"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plaque immatriculation</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une plaque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AA-123-BB">AA-123-BB</SelectItem>
                    <SelectItem value="CC-456-DD">CC-456-DD</SelectItem>
                    <SelectItem value="EE-789-FF">EE-789-FF</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Liliane">Liliane</SelectItem>
                    <SelectItem value="Cheick">Cheick</SelectItem>
                    <SelectItem value="Ines">Ines</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommandations</FormLabel>
              <FormControl>
                <Input placeholder="Ajouter des recommandations (facultatif)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="text-lg font-bold mb-4">Pièces utilisées</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-6 gap-4 mb-4 items-center">
              <FormField
                control={form.control}
                name={`parts.${index}.name`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nom de la pièce</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une pièce" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Filtre à huile">Filtre à huile</SelectItem>
                          <SelectItem value="Huile moteur">Huile moteur</SelectItem>
                          <SelectItem value="Plaquettes de frein">Plaquettes de frein</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`parts.${index}.reference`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence</FormLabel>
                    <FormControl>
                      <Input placeholder="Référence" readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`parts.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Quantité"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`parts.${index}.unitPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix unitaire (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Prix unitaire" readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="self-end"
              >
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ name: "", reference: "", quantity: undefined, unitPrice: undefined })
            }
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une pièce
          </Button>
        </div>

        <Button type="submit" className="w-full">
          {mode === "create" ? "Ajouter entretien" : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
}
