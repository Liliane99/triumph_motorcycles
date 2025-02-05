"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

export type TrialFormValues = {
    user_id: number | string;
    motorcycle_id: number | string;
    start_date: Date | null;
    end_date: Date | null;
};

const trialSchema = z.object({
    user_id: z.number().min(1, { message: "User requis." }),
    motorcycle_id: z.number().min(1, { message: "Motorcycle ID requis." }),
    start_date: z.date({ required_error: "La date de début est obligatoire." }).nullable(),
    end_date: z.date({ required_error: "La date de fin est obligatoire." }).nullable(),
});

export type AddTrialFormProps = {
    onSubmit: (values: TrialFormValues) => void;
    defaultValues?: Partial<TrialFormValues>;
    mode?: "create" | "edit";
};

export function AddTrialForm({ onSubmit, defaultValues, mode = "create" }: AddTrialFormProps) {
    const [startDate, setStartDate] = useState<Date | undefined>(defaultValues?.start_date || undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(defaultValues?.end_date || undefined);

    const form = useForm<TrialFormValues>({
        resolver: zodResolver(trialSchema),
        defaultValues: {
            user_id: 0,
            motorcycle_id: 0,
            start_date: null,
            end_date: null,
            ...defaultValues,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Client</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir un client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Cheick</SelectItem>
                                        <SelectItem value="resolved">Annah</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <FormLabel>Moto</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir une moto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Apache</SelectItem>
                                        <SelectItem value="resolved">TVS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="start_date"
                    render={() => (
                        <FormItem>
                            <FormLabel>Date de début</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            {startDate ? format(startDate, "dd/MM/yyyy") : "Choisir une date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(selectedDate) => {
                                                setStartDate(selectedDate || undefined);
                                                form.setValue("start_date", selectedDate || null);
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
                    name="end_date"
                    render={() => (
                        <FormItem>
                            <FormLabel>Date de fin</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            {endDate ? format(endDate, "dd/MM/yyyy") : "Choisir une date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(selectedDate) => {
                                                setEndDate(selectedDate || undefined);
                                                form.setValue("end_date", selectedDate || null);
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
                
                <Button type="submit" className="w-full">
                    {mode === "create" ? "Ajouter un essai" : "Mettre à jour"}
                </Button>
            </form>
        </Form>
    );
}