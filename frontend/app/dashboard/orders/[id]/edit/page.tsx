"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddOrderForm, OrderFormValues } from "@/components/orders/add-order-form";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { 
  getOrderById, 
  getOrderParts, 
  getPartById,
  updateOrder,
  updatePartInOrder,
  removePartFromOrder,
  addPartToOrder,
  ApiOrderPart
} from "@/lib/api";
import { toast } from "react-toastify";

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<OrderFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const order = await getOrderById(params.id);
        if (!order) {
          toast.error("Commande introuvable");
          router.push("/dashboard/orders");
          return;
        }

        let orderParts: ApiOrderPart[] = [];
        try {
          orderParts = await getOrderParts(params.id);
        } catch (error) {
          console.warn("Pas de pièces trouvées pour cette commande");
          orderParts = [];
        }

        const partsDetails = await Promise.all(
          orderParts.map(async (orderPart) => {
            try {
              const part = await getPartById(orderPart.partId);
              if (!part) return null;

              const quantity = typeof orderPart.quantityOrdered === 'number' 
                ? orderPart.quantityOrdered 
                : orderPart.quantityOrdered.value;

              return {
                partId: part.id,
                name: part.name.value,
                reference: part.reference.value,
                quantity: quantity,
                unitPrice: part.unitPrice.value,
                totalPrice: part.unitPrice.value * quantity
              };
            } catch {
              return null;
            }
          })
        );

        const validPartsDetails = partsDetails.filter((part): part is NonNullable<typeof part> => part !== null);

        let orderDate;
        try {
          orderDate = order.orderDate.includes('T') 
            ? new Date(order.orderDate)
            : new Date(parseInt(order.orderDate));
            
          if (isNaN(orderDate.getTime())) {
            throw new Error('Invalid order date');
          }
        } catch {
          orderDate = new Date(); 
        }

        let deliveryDate = undefined;
        if (order.deliveryDate) {
          try {
            deliveryDate = order.deliveryDate.includes('T')
              ? new Date(order.deliveryDate)
              : new Date(parseInt(order.deliveryDate));
              
            if (isNaN(deliveryDate.getTime())) {
              deliveryDate = undefined;
            }
          } catch {
            deliveryDate = undefined;
          }
        }

        const formValues: OrderFormValues = {
          reference: order.reference.value,
          orderDate: orderDate,
          deliveryDate: deliveryDate,
          parts: validPartsDetails,
          totalPrice: validPartsDetails.reduce((sum, part) => sum + part.totalPrice, 0)
        };

        setDefaultValues(formValues);
      } catch (error) {
        console.error("Erreur lors du chargement de la commande:", error);
        toast.error("Erreur lors du chargement de la commande");
        router.push("/dashboard/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.id, router]);

  const handleSubmit = async (values: OrderFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Non authentifié");

      await updateOrder(params.id, {
        reference: { value: values.reference },
        orderDate: values.orderDate.toISOString(),
        deliveryDate: values.deliveryDate?.toISOString()
      }, token);

      const currentParts = defaultValues?.parts || [];
      const newParts = values.parts || [];

      const currentPartsMap = new Map(currentParts.map(part => [part.partId, part]));
      const newPartsMap = new Map(newParts.map(part => [part.partId, part]));

      for (const newPart of newParts) {
        const currentPart = currentPartsMap.get(newPart.partId);
        
        if (!currentPart) {
          await addPartToOrder(params.id, newPart.partId, newPart.quantity, token);
        } else if (currentPart.quantity !== newPart.quantity) {
          await updatePartInOrder(params.id, newPart.partId, newPart.quantity, token);
        }
      }

      for (const [partId, part] of currentPartsMap) {
        if (!newPartsMap.has(partId)) {
          await removePartFromOrder(params.id, partId, token);
        }
      }

      toast.success("Commande mise à jour avec succès");
      router.push("/dashboard/orders");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(`Erreur lors de la mise à jour : ${error.message}`);
    }
  };

  if (loading) return <p className="text-center pt-8">Chargement...</p>;
  if (!defaultValues) return <p className="text-center pt-8">Commande introuvable</p>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/orders">Commandes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Modifier commande</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">
            Modifier la commande {defaultValues.reference}
          </h1>
          <AddOrderForm 
            onSubmit={handleSubmit} 
            defaultValues={defaultValues} 
            mode="edit" 
            orderId={params.id}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}