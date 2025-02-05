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

export type IncidentFormValues = {
    incident_id: string;
    incident_date: Date | null;
    incident_description: string;
    incident_status: "créer" | "résolu";
    comment: string;
    motorcycle_id: number | null;
};

const incidentSchema = z.object({
    incident_id: z.string().optional(), 
    incident_description: z.string().min(1, { message: "Description obligatoire." }),
    incident_date: z.date({ required_error: "La date est obligatoire." }).nullable(),
    incident_status: z.enum(["open", "resolved"], { message: "Statut invalide." }),
    comment: z.string().optional(),
    motorcycle_id: z.number().nullable().optional(), 
});

export type AddIncidentFormProps = {
    onSubmit: (values: IncidentFormValues) => void;
    defaultValues?: Partial<IncidentFormValues>;
    mode?: "create" | "edit";
};

export function AddIncidentForm({
    onSubmit,
    defaultValues,
    mode = "create",
}: AddIncidentFormProps) {
    const [date, setDate] = useState<Date | undefined>(defaultValues?.incident_date || undefined);

    const form = useForm<IncidentFormValues>({
        resolver: zodResolver(incidentSchema),
        defaultValues: {
            incident_id: "",
            incident_description: "",
            incident_date: null,
            incident_status: "créer", // 
            comment: "",
            motorcycle_id: null,
            ...defaultValues,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                    control={form.control}
                    name="incident_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description de l'incident</FormLabel>
                            <FormControl>
                                <Input placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="incident_date"
                    render={() => (
                        <FormItem>
                            <FormLabel>Date de l'incident</FormLabel>
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
                                                form.setValue("incident_date", selectedDate || null);
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
                    name="incident_status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Statut de l'incident</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Créer</SelectItem>
                                        <SelectItem value="resolved">Résolu</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Commentaire</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ajouter un commentaire" {...field} />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="motorcycle_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Motorcycle ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Motorcycle ID" {...field} />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {mode === "create" ? "Ajouter un incident" : "Mettre à jour"}
                </Button>
            </form>
        </Form>
    );
}
