"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { createMotorcycle, updateMotorcycle } from "@/lib/apiExpress"; 
import { getUsers } from "@/lib/api"; 

const motoSchema = z.object({
  id: z.string().optional(),
  brand: z.string().min(1, "La marque est obligatoire."),
  model: z.string().min(1, "Le modèle est obligatoire."),
  licensePlate: z.string()
    .regex(/^[A-Z]{2}-\d{3}-[A-Z]{2}$/, "Format de plaque invalide (ex: AB-123-CD)"),
  kilometers: z.string()
    .transform((val) => Number(val) || 0)
    .refine((val) => val >= 0, "Le kilométrage ne peut pas être négatif."),
  maintenanceInterval: z.string()
    .transform((val) => Number(val) || 0)
    .refine((val) => val > 0, "L'intervalle de maintenance doit être supérieur à 0."),
  warrantyDate: z.date().nullable(),
  purchaseDate: z.date().nullable(),
  ownerId: z.string().min(1, "Le propriétaire est obligatoire."),
});

export type MotoFormValues = z.infer<typeof motoSchema>;

export function AddMotoForm({ 
  defaultValues, 
  mode = "create" 
}: { 
  defaultValues?: Partial<MotoFormValues>; 
  mode?: "create" | "edit" 
}) {
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(
    defaultValues?.purchaseDate ? new Date(defaultValues.purchaseDate) : undefined
  );
  const [warrantyDate, setWarrantyDate] = useState<Date | undefined>(
    defaultValues?.warrantyDate ? new Date(defaultValues.warrantyDate) : undefined
  );
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<MotoFormValues>({
    resolver: zodResolver(motoSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      brand: defaultValues?.brand || "",
      model: defaultValues?.model || "",
      licensePlate: defaultValues?.licensePlate || "",
      kilometers: defaultValues?.kilometers?.toString() || "0",
      maintenanceInterval: defaultValues?.maintenanceInterval?.toString() || "0",
      warrantyDate: defaultValues?.warrantyDate ? new Date(defaultValues.warrantyDate) : null,
      purchaseDate: defaultValues?.purchaseDate ? new Date(defaultValues.purchaseDate) : null,
      ownerId: defaultValues?.ownerId || "",
    },
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersData = await getUsers();
        const formattedUsers = usersData.map(user => ({
          id: user.id,
          name: user.role.value === 'admin' || user.role.value === 'manager'
            ? `${user.username.value} (Triumph Motorcycle)`
            : user.username.value
        }));
        setUsers(formattedUsers);
        
        // Si nous sommes en mode édition et que nous avons un ownerId par défaut
        if (mode === "edit" && defaultValues?.ownerId) {
          // On s'assure que le formulaire est mis à jour avec la valeur
          form.setValue("ownerId", defaultValues.ownerId);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    }

    fetchUsers();
  }, [mode, defaultValues?.ownerId, form]);

  // Mise à jour du formulaire quand les dates changent
  useEffect(() => {
    if (purchaseDate) {
      form.setValue('purchaseDate', purchaseDate);
    }
    if (warrantyDate) {
      form.setValue('warrantyDate', warrantyDate);
    }
  }, [purchaseDate, warrantyDate, form]);

  const handleSubmit = async (values: MotoFormValues) => {
    setLoading(true);
    setError(null);

    const formattedValues = {
      brand: values.brand,
      model: values.model,
      licensePlate: values.licensePlate,
      kilometers: Number(values.kilometers),
      maintenanceInterval: Number(values.maintenanceInterval),
      warrantyDate: warrantyDate ? format(warrantyDate, "yyyy-MM-dd") : null,
      purchaseDate: purchaseDate ? format(purchaseDate, "yyyy-MM-dd") : null,
      ownerId: values.ownerId,
    };

    try {
      if (mode === "create") {
        await createMotorcycle(formattedValues, localStorage.getItem("token")!);
      } else if (mode === "edit" && values.id) {
        await updateMotorcycle(values.id, formattedValues, localStorage.getItem("token")!);
      }

      router.push("/dashboard/motos");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marque</FormLabel>
              <FormControl>
                <Input placeholder="Marque" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle</FormLabel>
              <FormControl>
                <Input placeholder="Modèle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plaque d'immatriculation</FormLabel>
              <FormControl>
                <Input 
                  placeholder="AB-123-CD" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kilometers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kilométrage</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Kilométrage"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maintenanceInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervalle de maintenance</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Intervalle (mois)"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseDate"
          render={() => (
            <FormItem>
              <FormLabel>Date d'achat</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {purchaseDate ? format(purchaseDate, "dd/MM/yyyy") : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={purchaseDate}
                    onSelect={(date) => {
                      setPurchaseDate(date || undefined);
                      form.setValue('purchaseDate', date || null);
                    }}
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
          name="warrantyDate"
          render={() => (
            <FormItem>
              <FormLabel>Date de fin de garantie</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {warrantyDate ? format(warrantyDate, "dd/MM/yyyy") : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={warrantyDate}
                    onSelect={(date) => {
                      setWarrantyDate(date || undefined);
                      form.setValue('warrantyDate', date || null);
                    }}
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
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Propriétaire</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un propriétaire">
                    {users.find(user => user.id === field.value)?.name || "Sélectionner un propriétaire"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Chargement..." : mode === "edit" ? "Modifier la moto" : "Ajouter la moto"}
        </Button>
      </form>
    </Form>
  );
}