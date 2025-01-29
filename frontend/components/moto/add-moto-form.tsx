"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";

export type MotoFormValues = {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    price: string;
    date: Date | null;
    warranty: Date | null;
    maintenanceInterval: number;
    kilometer: number;  
    client: string;
};

const motoSchema = z.object({
    id: z.string().optional(),
    brand: z.string().min(1, { message: "Marque obligatoire." }),
    model: z.string().min(1, { message: "Modèle obligatoire." }),
    licensePlate: z.string().min(1, { message: "Plaque dimmatriculation obligatoire." }),
    price: z.string().min(1, { message: "Prix obligatoire." }),
    date: z.date({ required_error: "La date est obligatoire." }).nullable(),
    warranty: z.date({ required_error: "La date est obligatoire." }).nullable(),
    maintenanceInterval: z.number({ required_error: "Intervalle dentretien obligatoire." }).positive(),
    kilometer: z.number().positive().int().min(0, { message: "Kilométrage doit être positif" }), // Validation du kilométrage
    client: z.string().min(1, { message: "Client obligatoire." }),
});

type AddMotoFormProps = {
    onSubmit: (values: MotoFormValues) => void;
    defaultValues?: Partial<MotoFormValues>;
    mode?: "create" | "edit";
};

export function AddMotoForm({
    onSubmit,
    defaultValues,
    mode = "create",
}: AddMotoFormProps) {
    const [date, setDate] = useState<Date | undefined>(
        defaultValues?.date || undefined
    );
    const [warranty, setWarranty] = useState<Date | undefined>(
        defaultValues?.warranty || undefined
    );

    const form = useForm<MotoFormValues>({
        resolver: zodResolver(motoSchema),
        defaultValues: {
            id: "",
            brand: "",
            model: "",
            licensePlate: "",
            price: "",
            date: null,
            warranty: null,
            maintenanceInterval: 0,
            kilometer: 0,  // Valeur par défaut pour kilometer
            client: "",
            ...defaultValues,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            <FormLabel>Plaque dimmatriculation</FormLabel>
                            <FormControl>
                                <Input placeholder="Plaque dimmatriculation" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prix (€)</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Prix" {...field} />
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
                            <FormLabel>Date dachat</FormLabel>
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
                                                form.setValue("date", selectedDate || null);
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
                    name="warranty"
                    render={() => (
                        <FormItem>
                            <FormLabel>Garantie</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            {warranty ? format(warranty, "dd/MM/yyyy") : "Choisir une date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={warranty}
                                            onSelect={(selectedDate) => {
                                                setWarranty(selectedDate || undefined);
                                                form.setValue("warranty", selectedDate || null);
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
                    name="maintenanceInterval"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Intervalle de maintenance (km)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Intervalle de maintenance en km"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="kilometer"  // Nouveau champ pour le kilométrage
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kilométrage (km)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Kilométrage de la moto"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                />
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
                            <FormLabel>Choisir un client</FormLabel>
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

                <Button type="submit" className="w-full">
                    {mode === "create" ? "Ajouter une moto" : "Mettre à jour"}
                </Button>
            </form>
        </Form>
    );
}
