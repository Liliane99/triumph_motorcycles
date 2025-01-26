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
import { format } from "date-fns";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";

export type OrderFormValues = {
  reference: string;
  orderDate: Date | undefined;
  deliveryDate: Date | undefined;
  parts: OrderPart[];
  totalPrice: number;
};

export type OrderPart = {
  name: string;
  reference: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

const orderSchema = z.object({
  reference: z.string().min(1, { message: "Référence obligatoire." }),
  orderDate: z.date().nullable(),
  deliveryDate: z.date().nullable(),
  parts: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Nom de la pièce obligatoire." }),
        reference: z.string().min(1, { message: "Référence obligatoire." }),
        quantity: z.number().positive({ message: "Quantité invalide." }),
        unitPrice: z.number().positive({ message: "Prix unitaire invalide." }),
        totalPrice: z.number(),
      })
    )
    .nonempty({ message: "Au moins une pièce est requise." }),
  totalPrice: z.number(),
});

type AddOrderFormProps = {
  onSubmit: (values: OrderFormValues) => void;
  defaultValues?: Partial<OrderFormValues>;
  mode?: "create" | "edit";
};

export function AddOrderForm({
  onSubmit,
  defaultValues,
  mode = "create",
}: AddOrderFormProps) {
  const [orderDate, setOrderDate] = useState<Date | undefined>(
    defaultValues?.orderDate || undefined
  );
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(
    defaultValues?.deliveryDate || undefined
  );

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      reference: "",
      orderDate: undefined,
      deliveryDate: undefined,
      parts: [{ name: "", reference: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
      totalPrice: 0,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "parts",
    control: form.control,
  });

  const updatePartTotal = (index: number) => {
    const part = form.getValues(`parts.${index}`);
    const totalPrice = part.quantity * part.unitPrice;
    form.setValue(`parts.${index}.totalPrice`, totalPrice);
    calculateOrderTotal();
  };

  const calculateOrderTotal = () => {
    const parts = form.getValues("parts");
    const total = parts.reduce((sum, part) => sum + part.totalPrice, 0);
    form.setValue("totalPrice", total);
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
                <Input placeholder="Référence de la commande" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orderDate"
          render={() => (
            <FormItem>
              <FormLabel>Date de commande</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {orderDate ? format(orderDate, "dd/MM/yyyy") : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={orderDate}
                      onSelect={(date) => {
                        setOrderDate(date || undefined);
                        form.setValue("orderDate", date || undefined);
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
          name="deliveryDate"
          render={() => (
            <FormItem>
              <FormLabel>Date de livraison</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {deliveryDate ? format(deliveryDate, "dd/MM/yyyy") : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={(date) => {
                        setDeliveryDate(date || undefined);
                        form.setValue("deliveryDate", date || undefined);
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

        <div>
          <h3 className="text-lg font-bold mb-4">Pièces commandées</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-6 gap-4 mb-4 items-center">
              <FormField
                control={form.control}
                name={`parts.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la pièce</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const mockData = { reference: "Ref123", unitPrice: 20 }; 
                          form.setValue(`parts.${index}.reference`, mockData.reference);
                          form.setValue(`parts.${index}.unitPrice`, mockData.unitPrice);
                          updatePartTotal(index);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une pièce" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pièce A">Pièce A</SelectItem>
                          <SelectItem value="Pièce B">Pièce B</SelectItem>
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
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          updatePartTotal(index);
                        }}
                      />
                    </FormControl>
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
                      <Input placeholder="Prix unitaire" readOnly {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`parts.${index}.totalPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix total (€)</FormLabel>
                    <FormControl>
                      <Input placeholder="Prix total" readOnly {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  remove(index);
                  calculateOrderTotal();
                }}
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
              append({
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

        <div className="text-right mt-4">
          <strong>Prix total : {form.getValues("totalPrice").toFixed(2)} €</strong>
        </div>

        <Button type="submit" className="w-full">
          {mode === "create" ? "Ajouter commande" : "Mettre à jour commande"}
        </Button>
      </form>
    </Form>
  );
}
