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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Plus, Trash } from "lucide-react";
import { getParts, createOrder, addPartToOrder, updateOrder, updatePartInOrder, removePartFromOrder, getOrderParts, ApiPart } from "@/lib/api";
import { toast } from "react-toastify";

export type OrderFormValues = {
  reference: string;
  orderDate: Date;
  deliveryDate: Date | undefined;
  parts: OrderPart[];
  totalPrice: number;
};

export type OrderPart = {
  partId: string;
  name: string;
  reference: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

const orderSchema = z.object({
  reference: z.string()
    .trim()
    .regex(/^[A-Z0-9]{5,15}$/, {
      message: "La référence doit contenir entre 5 et 15 caractères alphanumériques majuscules"
    }),
  orderDate: z.date({
    required_error: "La date de commande est requise",
    invalid_type_error: "Format de date invalide",
  }),
  deliveryDate: z.date({
    invalid_type_error: "Format de date invalide",
  }).optional()
    .refine((date) => {
      if (!date) return true;
      return date > new Date();
    }, {
      message: "La date de livraison doit être ultérieure à aujourd'hui"
    }),
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
}).refine((data) => {
  if (data.deliveryDate) {
    return data.deliveryDate > data.orderDate;
  }
  return true;
}, {
  message: "La date de livraison doit être postérieure à la date de commande",
  path: ["deliveryDate"]
});

type AddOrderFormProps = {
  onSubmit?: (values: OrderFormValues) => void;
  defaultValues?: Partial<OrderFormValues>;
  mode?: "create" | "edit";
  orderId?: string;
};

export function AddOrderForm({
  defaultValues,
  mode = "create",
  orderId
}: AddOrderFormProps) {
  const router = useRouter();
  const [availableParts, setAvailableParts] = useState<ApiPart[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      reference: "",
      orderDate: new Date(),
      deliveryDate: undefined,
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
    const fetchParts = async () => {
      try {
        const parts = await getParts();
        setAvailableParts(parts);
      } catch (error) {
        toast.error("Erreur lors du chargement des pièces disponibles");
      }
    };
    fetchParts();
  }, []);

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

  const onSubmit = async (values: OrderFormValues) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Non authentifié");
      }

      if (mode === "create") {
        const orderData = {
          reference: values.reference,
          orderDate: values.orderDate.toISOString(),
          deliveryDate: values.deliveryDate?.toISOString(),
        };

        console.log('Création de la commande avec les données:', orderData);
        const { id, message } = await createOrder(orderData, token);
        console.log('Réponse de la création de commande:', { id, message });

        await Promise.all(
          values.parts.map(async (part) => {
            return addPartToOrder(id, part.partId, part.quantity, token);
          })
        );

        toast.success("Commande créée avec succès");
      } else {
        if (!orderId) {
          console.error('OrderId manquant:', orderId);
          throw new Error("ID de commande manquant");
        }

        console.log('Mise à jour de la commande:', orderId);

        await updateOrder(orderId, {
          reference: { value: values.reference },
          orderDate: values.orderDate.toISOString(),
          deliveryDate: values.deliveryDate?.toISOString()
        }, token);

        const currentParts = await getOrderParts(orderId);
        console.log('Pièces actuelles:', currentParts);

        const currentPartsMap = new Map(currentParts.map(p => [p.partId, p]));
        const newPartsMap = new Map(values.parts.map(p => [p.partId, p]));

        for (const newPart of values.parts) {
          const currentPart = currentPartsMap.get(newPart.partId);
          if (currentPart) {
            const currentQuantity = currentPart.quantityOrdered?.value || 0;
            if (currentQuantity !== newPart.quantity) {
              console.log('Mise à jour de la quantité:', {
                orderId,
                partId: newPart.partId,
                oldQuantity: currentQuantity,
                newQuantity: newPart.quantity
              });
              await updatePartInOrder(orderId, newPart.partId, newPart.quantity, token);
            }
          } else {
            console.log('Ajout d\'une nouvelle pièce:', {
              orderId,
              partId: newPart.partId,
              quantity: newPart.quantity
            });
            await addPartToOrder(orderId, newPart.partId, newPart.quantity, token);
          }
        }

        for (const [partId] of currentPartsMap) {
          if (!newPartsMap.has(partId)) {
            console.log('Suppression de la pièce:', { orderId, partId });
            await removePartFromOrder(orderId, partId, token);
          }
        }

        toast.success("Commande mise à jour avec succès");
      }

      router.push("/dashboard/orders");
    } catch (error: any) {
      console.error('Erreur complète:', error);
      const errorMessage = error.response?.data?.message || error.message || "Erreur inconnue";
      toast.error(`Erreur lors de la ${mode === "create" ? "création" : "modification"} de la commande : ${errorMessage}`);
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
                  placeholder="ORDRE123" 
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
          name="orderDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de commande</FormLabel>
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
          name="deliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de livraison (optionnelle)</FormLabel>
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
                    disabled={(date) => {
                      const orderDate = form.getValues("orderDate");
                      return date < orderDate || date < new Date();
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="text-lg font-bold mb-4">Pièces commandées</h3>
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
                  calculateOrderTotal();
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
          Total commande : {form.getValues("totalPrice").toFixed(2)} €
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (mode === "create" ? "Création en cours..." : "Modification en cours...") : 
            (mode === "create" ? "Créer la commande" : "Modifier la commande")}
        </Button>
      </form>
    </Form>
  );
}

export default AddOrderForm;