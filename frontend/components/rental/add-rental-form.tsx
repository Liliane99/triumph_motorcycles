"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

export type LocationFormValues = {
    id: string;
    reference: string;
    brand: string;
    model: string;
    licensePlate: string;
    date: Date | null;
    client: string;
};

const locationSchema = z.object({
    id: z.string().optional(),
    reference: z.string().min(1, { message: "Référence obligatoire." }),
    brand: z.string().min(1, { message: "Marque obligatoire." }),
    model: z.string().min(1, { message: "Modèle obligatoire." }),
    licensePlate: z.string().min(1, { message: "Plaque d'immatriculation obligatoire." }),
    date: z.date({ required_error: "La date est obligatoire." }).nullable(),
    client: z.string().min(1, { message: "Client obligatoire." }),
});

type AddLocationFormProps = {
    onSubmit: (values: LocationFormValues) => void;
    defaultValues?: Partial<LocationFormValues>;
    mode?: "create" | "edit";
};

export function AddLocationForm({
    onSubmit,
    defaultValues,
    mode = "create",
}: AddLocationFormProps) {
    const [date, setDate] = useState<Date | undefined>(defaultValues?.date || undefined);

    const form = useForm<LocationFormValues>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            id: "",
            reference: "",
            brand: "",
            model: "",
            licensePlate: "",
            date: null,
            client: "",
            ...defaultValues,
        },
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
                                <Input placeholder="Référence" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                <Input placeholder="Plaque d'immatriculation" {...field} />
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
                            <FormLabel>Date de location</FormLabel>
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
                    {mode === "create" ? "Ajouter une location" : "Mettre à jour"}
                </Button>
            </form>
        </Form>
    );
}
