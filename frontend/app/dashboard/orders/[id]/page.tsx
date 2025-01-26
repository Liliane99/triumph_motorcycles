"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Calendar, User, DollarSign } from "lucide-react";

type Order = {
  id: string;
  reference: string;
  orderDate: string;
  deliveryDate: string;
  manager: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  parts: OrderPart[];
};

type OrderPart = {
  name: string;
  reference: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const mockOrder: Order = {
      id: params.id,
      reference: "CMD-001",
      orderDate: "2025-01-01",
      deliveryDate: "2025-01-05",
      manager: "Manager A",
      totalPrice: 500,
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-03T14:00:00Z",
      updatedBy: "Admin",
      parts: [
        {
          name: "Filtre à huile",
          reference: "FO-1234",
          quantity: 2,
          unitPrice: 25,
          totalPrice: 50,
        },
        {
          name: "Huile moteur",
          reference: "HM-5678",
          quantity: 5,
          unitPrice: 15,
          totalPrice: 75,
        },
      ],
    };

    setOrder(mockOrder);
  }, [params.id]);

  if (!order) return <p>Chargement...</p>;

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
                  <BreadcrumbPage>{order.reference}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-8">
          {/* Section principale des détails de la commande */}
          <Card>
            <CardHeader className="flex flex-col items-center">
              <ClipboardList className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                Référence : {order.reference}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {new Date(order.orderDate).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Date de livraison :</strong>{" "}
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <strong>Manager :</strong> {order.manager}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Prix total :</strong> {order.totalPrice.toFixed(2)} €
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié le :</strong>{" "}
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                  {order.updatedBy && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifié par :</strong> {order.updatedBy}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section des pièces commandées */}
          <Card>
            <CardHeader>
              <CardTitle>Pièces commandées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix unitaire (€)</TableHead>
                      <TableHead>Prix total (€)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.parts.map((part, index) => (
                      <TableRow key={index}>
                        <TableCell>{part.name}</TableCell>
                        <TableCell>{part.reference}</TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell>{part.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>{part.totalPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
