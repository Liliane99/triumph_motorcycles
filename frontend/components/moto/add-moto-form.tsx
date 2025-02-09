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
import { createMotorcycle, updateMotorcycle } from "@/lib/apiexpress"; 
import { getUsers } from "@/lib/api"; 

export type MotoFormValues = {
  id?: string;
  brand: string;
  model: string;
  licensePlate: string;
  kilometers: number;
  maintenanceInterval: number;
  warrantyDate: Date | null;
  purchaseDate: Date | null;
  ownerId: string;
};

const motoSchema = z.object({
  brand: z.string().min(1, "Marque obligatoire."),
  model: z.string().min(1, "Modèle obligatoire."),
  licensePlate: z.string().min(1, "Plaque d'immatriculation obligatoire."),
  kilometers: z.preprocess((val) => Number(val), z.number().min(0, "Kilométrage invalide.")),
  maintenanceInterval: z.preprocess((val) => Number(val), z.number().positive("Intervalle invalide.")),
  warrantyDate: z.date().nullable(),
  purchaseDate: z.date().nullable(),
  ownerId: z.string().min(1, "Propriétaire obligatoire."),
});

export function AddMotoForm({ defaultValues, mode = "create" }: { defaultValues?: Partial<MotoFormValues>; mode?: "create" | "edit" }) {
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(defaultValues?.purchaseDate || undefined);
  const [warrantyDate, setWarrantyDate] = useState<Date | undefined>(defaultValues?.warrantyDate || undefined);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<MotoFormValues>({
    resolver: zodResolver(motoSchema),
    defaultValues: {
      brand: "",
      model: "",
      licensePlate: "",
      kilometers: 0,
      maintenanceInterval: 0,
      warrantyDate: null,
      purchaseDate: null,
      ownerId: "",
      ...defaultValues,
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
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    }

    fetchUsers();
  }, []);

  const handleSubmit = async (values: MotoFormValues) => {
    setLoading(true);
    setError(null);

    const formattedValues = {
      brand: values.brand,
      model: values.model,
      licensePlate: values.licensePlate,
      kilometers: values.kilometers,
      maintenanceInterval: values.maintenanceInterval,
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

        <FormField control={form.control} name="brand" render={({ field }) => (
          <FormItem>
            <FormLabel>Marque</FormLabel>
            <FormControl><Input placeholder="Marque" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="model" render={({ field }) => (
          <FormItem>
            <FormLabel>Modèle</FormLabel>
            <FormControl><Input placeholder="Modèle" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="licensePlate" render={({ field }) => (
          <FormItem>
            <FormLabel>Plaque d'immatriculation</FormLabel>
            <FormControl><Input placeholder="Plaque" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="kilometers" render={({ field }) => (
          <FormItem>
            <FormLabel>Kilométrage</FormLabel>
            <FormControl><Input type="number" placeholder="Kilométrage" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="maintenanceInterval" render={({ field }) => (
          <FormItem>
            <FormLabel>Intervalle de maintenance</FormLabel>
            <FormControl><Input type="number" placeholder="Intervalle de maintenance" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="purchaseDate" render={() => (
          <FormItem>
            <FormLabel>Date d'achat</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">{purchaseDate ? format(purchaseDate, "dd/MM/yyyy") : "Choisir une date"}</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar mode="single" selected={purchaseDate} onSelect={(selected) => { setPurchaseDate(selected); form.setValue("purchaseDate", selected); }} />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="warrantyDate" render={() => (
          <FormItem>
            <FormLabel>Date de fin de garantie</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">{warrantyDate ? format(warrantyDate, "dd/MM/yyyy") : "Choisir une date"}</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar mode="single" selected={warrantyDate} onSelect={(selected) => { setWarrantyDate(selected); form.setValue("warrantyDate", selected); }} />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="ownerId" render={({ field }) => (
          <FormItem>
            <FormLabel>Propriétaire</FormLabel>
            <FormControl>
              <Select {...field}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un propriétaire" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Chargement..." : mode === "edit" ? "Modifier la moto" : "Ajouter la moto"}
        </Button>
      </form>
    </Form>
  );
}
