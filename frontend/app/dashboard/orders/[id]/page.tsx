"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { format, parseISO, isValid } from "date-fns";
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
import { getOrderById, getOrderParts, getPartById, getUserById, Order, OrderPart } from "@/lib/api";
import { toast } from "react-toastify";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderParts, setOrderParts] = useState<
    { name: string; reference: string; quantity: number; unitPrice: number; totalPrice: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const fetchedOrder = await getOrderById(params.id);

        if (!fetchedOrder) {
          toast.error("Commande introuvable.");
          router.push("/dashboard/orders");
          return;
        }

        const createdByUser = await getUserById(fetchedOrder.createdBy);
        const updatedByUser = fetchedOrder.updatedBy ? await getUserById(fetchedOrder.updatedBy) : null;

        const orderDateStr = fetchedOrder.orderDate?.value;
        const deliveryDateStr = fetchedOrder.deliveryDate?.value;
        
        const formattedOrderDate = orderDateStr ? 
          isValid(parseISO(orderDateStr)) ? 
            format(parseISO(orderDateStr), "dd/MM/yyyy HH:mm") : 
            "Date invalide" : 
          "Non spécifiée";

        const formattedDeliveryDate = deliveryDateStr ? 
          isValid(parseISO(deliveryDateStr)) ? 
            format(parseISO(deliveryDateStr), "dd/MM/yyyy HH:mm") : 
            "Date invalide" : 
          "Non spécifiée";

        setOrder({
          id: fetchedOrder.id,
          reference: fetchedOrder.reference.value,
          orderDate: formattedOrderDate,
          deliveryDate: formattedDeliveryDate,
          createdByName: createdByUser?.username.value || "Inconnu",
          updatedByName: updatedByUser?.username.value || "N/A",
          createdAt: new Date(fetchedOrder.createdAt).toLocaleString(),
          updatedAt: new Date(fetchedOrder.updatedAt).toLocaleString(),
        });

        let fetchedOrderParts: OrderPart[] = [];
        try {
          fetchedOrderParts = await getOrderParts(params.id);
        } catch (error) {
          console.warn("⚠️ Aucune pièce trouvée pour cette commande. Chargement sans erreur.");
        }

        if (fetchedOrderParts.length === 0) {
          setOrderParts([]);
          setLoading(false);
          return;
        }

        const partsData = await Promise.all(
          fetchedOrderParts.map(async (orderPart) => {
            const partDetails = await getPartById(orderPart.partId);
            return {
              name: partDetails?.name.value || "Inconnu",
              reference: partDetails?.reference.value || "N/A",
              quantity: orderPart.quantityOrdered.value,
              unitPrice: partDetails?.unitPrice.value || 0,
              totalPrice: (partDetails?.unitPrice.value || 0) * orderPart.quantityOrdered.value,
            };
          })
        );

        setOrderParts(partsData);
        setLoading(false);
      } catch (error) {
        toast.error("Erreur lors du chargement des détails de la commande.");
        router.push("/dashboard/orders");
      }
    }

    fetchOrderDetails();
  }, [params.id, router]);

  if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;
  if (!order) return <p className="text-center text-lg font-semibold">Commande introuvable.</p>;

  const totalOrderPrice = orderParts.reduce((total, part) => total + part.totalPrice, 0);

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
          <Card>
            <CardHeader className="flex flex-col items-center">
              <ClipboardList className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                Référence : {order.reference}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {order.orderDate}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Date de livraison :</strong> {order.deliveryDate}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé par :</strong> {order.createdByName}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Prix total :</strong> {totalOrderPrice.toFixed(2)} €
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong> {order.createdAt}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié le :</strong> {order.updatedAt}
                  </p>
                  {order.updatedByName && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifié par :</strong> {order.updatedByName}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pièces commandées</CardTitle>
            </CardHeader>
            <CardContent>
              {orderParts.length > 0 ? (
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
                      {orderParts.map((part, index) => (
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
              ) : (
                <p className="text-center text-lg font-semibold">Aucune pièce associée à cette commande.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}