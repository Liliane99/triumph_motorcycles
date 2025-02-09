"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { DataTable } from "@/components/orders/data-table";
import { columns } from "@/components/orders/columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrders, getUserById, Order } from "@/lib/api";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await getOrders();
        const formattedOrders: Order[] = await Promise.all(
          fetchedOrders.map(async (order) => {
            const createdByUser = await getUserById(order.createdBy);
            const updatedByUser = order.updatedBy ? await getUserById(order.updatedBy) : null;

            return {
              id: order.id,
              reference: order.reference.value,
              orderDate: order.orderDate, 
              deliveryDate: order.deliveryDate || undefined,
              createdByName: createdByUser?.username.value || "Inconnu",
              updatedByName: updatedByUser?.username.value || "N/A",
              createdAt: new Date(order.createdAt).toLocaleString(),
              updatedAt: new Date(order.updatedAt).toLocaleString(),
            };
          })
        );

        setOrders(formattedOrders);
        setLoading(false);
      } catch (error) {
        toast.error("Erreur lors de la récupération des commandes.");
        router.push("/dashboard");
      }
    }

    fetchOrders();
  }, [router]);

  if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;

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
                  <BreadcrumbPage>Commandes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Total Commandes</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{orders.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <DataTable columns={columns} data={orders} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}