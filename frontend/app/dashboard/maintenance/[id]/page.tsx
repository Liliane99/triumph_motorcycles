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
import { Wrench, Calendar, User, Bike, DollarSign } from "lucide-react";
import { getMaintenanceById, getMaintenanceParts, getPartById, Maintenance, MaintenancePart } from "@/lib/api";
import { toast } from "react-toastify";

export default function MaintenanceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [maintenanceParts, setMaintenanceParts] = useState<
    { name: string; reference: string; quantity: number; unitPrice: number; totalPrice: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMaintenanceDetails() {
      try {
        console.log("Fetching maintenance with ID:", params.id);
        const fetchedMaintenance = await getMaintenanceById(params.id);
        console.log("Fetched maintenance:", fetchedMaintenance);

        if (!fetchedMaintenance) {
          toast.error("Maintenance introuvable.");
          router.push("/dashboard/maintenance");
          return;
        }

        // Formatage de la date
        const formattedMaintenance = {
          ...fetchedMaintenance,
          date: fetchedMaintenance.date ? format(
            parseISO(typeof fetchedMaintenance.date === 'object' ? 
              fetchedMaintenance.date.value : fetchedMaintenance.date),
            "dd/MM/yyyy HH:mm"
          ) : "Non spécifiée"
        };

        setMaintenance(formattedMaintenance);

        try {
          console.log("Fetching maintenance parts");
          const fetchedMaintenanceParts = await getMaintenanceParts(params.id);
          console.log("Fetched parts:", fetchedMaintenanceParts);

          if (fetchedMaintenanceParts.length > 0) {
            const partsData = await Promise.all(
              fetchedMaintenanceParts.map(async (maintenancePart) => {
                const partDetails = await getPartById(maintenancePart.partId);
                console.log("Part details:", partDetails);

                const quantity = typeof maintenancePart.quantityUsed === 'object' ? 
                  maintenancePart.quantityUsed.value : maintenancePart.quantityUsed;
                const unitPrice = partDetails?.unitPrice.value || 0;

                return {
                  name: partDetails?.name.value || "Inconnu",
                  reference: partDetails?.reference.value || "N/A",
                  quantity,
                  unitPrice,
                  totalPrice: unitPrice * quantity,
                };
              })
            );
            setMaintenanceParts(partsData);
          }
        } catch (error) {
          console.error("Error fetching parts:", error);
          // On continue même si on n'a pas pu récupérer les pièces
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in fetchMaintenanceDetails:", error);
        toast.error("Erreur lors du chargement des détails de la maintenance.");
        router.push("/dashboard/maintenance");
      }
    }

    fetchMaintenanceDetails();
  }, [params.id, router]);

  if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;
  if (!maintenance) return <p className="text-center text-lg font-semibold">Maintenance introuvable.</p>;

  const totalMaintenancePrice = maintenanceParts.reduce((total, part) => total + part.totalPrice, 0);

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
                  <BreadcrumbLink href="/dashboard/maintenance">Maintenances</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{maintenance.reference}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-8">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Wrench className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                Référence : {maintenance.reference}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {maintenance.date}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Bike className="h-5 w-5 text-muted-foreground" />
                    <strong>Moto :</strong> {maintenance.motorcycleBrand}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé par :</strong> {maintenance.createdByName}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Prix total :</strong> {totalMaintenancePrice.toFixed(2)} €
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong> {maintenance.createdAt}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié le :</strong> {maintenance.updatedAt}
                  </p>
                  {maintenance.updatedByName && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifié par :</strong> {maintenance.updatedByName}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Recommandation :</h3>
                <p className="text-gray-700">{maintenance.recommendation}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pièces utilisées</CardTitle>
            </CardHeader>
            <CardContent>
              {maintenanceParts.length > 0 ? (
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
                      {maintenanceParts.map((part, index) => (
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
                <p className="text-center text-lg font-semibold">Aucune pièce associée à cette maintenance.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}