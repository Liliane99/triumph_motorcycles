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

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<OrderFormValues | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const mockOrder: OrderFormValues = {
        reference: "CMD-001",
        orderDate: new Date("2025-01-01"),
        deliveryDate: new Date("2025-01-05"),
        parts: [
          { name: "Pièce A", reference: "Ref123", quantity: 2, unitPrice: 20, totalPrice: 40 },
          { name: "Pièce B", reference: "Ref456", quantity: 3, unitPrice: 15, totalPrice: 45 },
        ],
        totalPrice: 85,
      };
      setDefaultValues(mockOrder);
    };

    fetchOrder();
  }, [params.id]);

  const handleSubmit = async (values: OrderFormValues) => {
    console.log("Commande mise à jour :", values);
    router.push("/dashboard/orders");
  };

  if (!defaultValues) return <p>Chargement...</p>;

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
          <h1 className="text-2xl font-bold mb-6">Modifier commande</h1>
          <AddOrderForm onSubmit={handleSubmit} defaultValues={defaultValues} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
