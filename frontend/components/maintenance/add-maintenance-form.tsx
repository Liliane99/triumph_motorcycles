import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Plus, Trash } from "lucide-react";
import { 
  getParts, 
  createMaintenance, 
  updateMaintenance,
  addPartToMaintenance, 
  updatePartInMaintenance,
  removePartFromMaintenance,
  getMaintenanceParts,
  ApiPart, 
  getMotorcycles 
} from "@/lib/api";
import { toast } from "react-toastify";

export type MaintenanceFormValues = {
  reference: string;
  date: Date;
  recommendation: string;
  motorcycleId: string;
  parts: MaintenancePart[];
  totalPrice: number;
};

export type MaintenancePart = {
  partId: string;
  name: string;
  reference: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

const maintenanceSchema = z.object({
  reference: z.string()
    .trim()
    .regex(/^MTN[0-9]{3}$/, {
      message: "La référence doit suivre le format MTN suivi de 3 chiffres"
    }),
  date: z.date({
    required_error: "La date est requise",
    invalid_type_error: "Format de date invalide",
  }),
  recommendation: z.string()
    .min(10, { message: "La recommandation doit contenir au moins 10 caractères" }),
  motorcycleId: z.string()
    .min(1, { message: "Veuillez sélectionner une moto" }),
  parts: z.array(
    z.object({
      partId: z.string(),
      name: z.string(),
      reference: z.string(),
      quantity: z.number()
        .positive("La quantité doit être supérieure à 0"),
      unitPrice: z.number(),
      totalPrice: z.number()
    })
  ).min(1, { message: "Au moins une pièce est requise." }),
  totalPrice: z.number()
});

export function AddMaintenanceForm({
  defaultValues,
  mode = "create",
  maintenanceId
}: {
  defaultValues?: Partial<MaintenanceFormValues>;
  mode?: "create" | "edit";
  maintenanceId?: string;
}) {
  const router = useRouter();
  const [availableParts, setAvailableParts] = useState<ApiPart[]>([]);
  const [motorcycles, setMotorcycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      reference: "",
      date: new Date(),
      recommendation: "",
      motorcycleId: "",
      parts: [],
      totalPrice: 0,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "parts",
    control: form.control,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parts, motos] = await Promise.all([
          getParts(),
          getMotorcycles()
        ]);
        setAvailableParts(parts);
        setMotorcycles(motos);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, []);

  const updatePartTotal = (index: number) => {
    const part = form.getValues(`parts.${index}`);
    const totalPrice = part.quantity * part.unitPrice;
    form.setValue(`parts.${index}.totalPrice`, totalPrice);
    calculateMaintenanceTotal();
  };

  const calculateMaintenanceTotal = () => {
    const parts = form.getValues("parts");
    const total = parts.reduce((sum, part) => sum + part.totalPrice, 0);
    form.setValue("totalPrice", total);
  };

  const onSubmit = async (values: MaintenanceFormValues) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      if (mode === "create") {
        const maintenanceData = {
          reference: values.reference,
          date: values.date.toISOString(),
          recommendation: values.recommendation,
          motorcycleId: values.motorcycleId,
        };

        const { id } = await createMaintenance(maintenanceData, token);

        await Promise.all(
          values.parts.map(async (part) => {
            return addPartToMaintenance(id, part.partId, part.quantity, token);
          })
        );

        toast.success("Maintenance créée avec succès");
      } else if (maintenanceId) {
        // Mode édition
        await updateMaintenance(maintenanceId, {
          recommendation: values.recommendation,
          date: values.date.toISOString(),
        }, token);

        const currentParts = await getMaintenanceParts(maintenanceId);
        const currentPartsMap = new Map(currentParts.map(p => [p.partId, p]));
        const newPartsMap = new Map(values.parts.map(p => [p.partId, p]));

        // Mettre à jour ou ajouter les pièces
        for (const newPart of values.parts) {
          const currentPart = currentPartsMap.get(newPart.partId);
          if (currentPart) {
            const currentQuantity = typeof currentPart.quantityUsed === 'object' 
              ? currentPart.quantityUsed.value 
              : currentPart.quantityUsed;
            
            if (currentQuantity !== newPart.quantity) {
              await updatePartInMaintenance(maintenanceId, newPart.partId, newPart.quantity, token);
            }
          } else {
            await addPartToMaintenance(maintenanceId, newPart.partId, newPart.quantity, token);
          }
        }

        // Supprimer les pièces qui ne sont plus présentes
        for (const [partId] of currentPartsMap) {
          if (!newPartsMap.has(partId)) {
            await removePartFromMaintenance(maintenanceId, partId, token);
          }
        }

        toast.success("Maintenance mise à jour avec succès");
      }

      router.push("/dashboard/maintenance");
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(`Erreur lors de la ${mode === "create" ? "création" : "modification"} de la maintenance : ${error.message || "Erreur inconnue"}`);
    } finally {
      setLoading(false);
    }
  };

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
                <Input 
                  placeholder="MTN001" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  disabled={mode === "edit"}
                />
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
                value={field.value}
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full">
                      {field.value ? format(field.value, "dd/MM/yyyy") : "Sélectionner une date"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recommendation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommandation</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Détails de la maintenance et recommandations" 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="text-lg font-bold mb-4">Pièces utilisées</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-6 gap-4 mb-4 items-end">
              <FormField
                control={form.control}
                name={`parts.${index}.partId`}
                render={({ field: partField }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Pièce</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selectedPart = availableParts.find(p => p.id === value);
                        if (selectedPart) {
                          form.setValue(`parts.${index}.partId`, value);
                          form.setValue(`parts.${index}.name`, selectedPart.name.value);
                          form.setValue(`parts.${index}.reference`, selectedPart.reference.value);
                          form.setValue(`parts.${index}.unitPrice`, selectedPart.unitPrice.value);
                          updatePartTotal(index);
                        }
                      }}
                      value={field.partId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une pièce" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableParts.map((part) => (
                          <SelectItem key={part.id} value={part.id}>
                            {part.name.value}
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
                name={`parts.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                          updatePartTotal(index);
                        }}
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
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`parts.${index}.totalPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total (€)</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  remove(index);
                  calculateMaintenanceTotal();
                }}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                partId: "",
                name: "",
                reference: "",
                quantity: 1,
                unitPrice: 0,
                totalPrice: 0,
              })
            }
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une pièce
          </Button>
        </div>

        <div className="text-right font-bold">
          Total maintenance : {form.getValues("totalPrice").toFixed(2)} €
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (mode === "create" ? "Création en cours..." : "Modification en cours...") : 
            (mode === "create" ? "Créer la maintenance" : "Modifier la maintenance")}
        </Button>
      </form>
    </Form>
  );
}

export default AddMaintenanceForm;