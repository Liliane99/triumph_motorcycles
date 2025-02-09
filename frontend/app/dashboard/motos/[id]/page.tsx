"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { getMotorcycleById, Motorcycle } from "@/lib/apiExpress";
import { toast } from "react-toastify";
import { format, parseISO, isValid } from "date-fns";

export default function MotoDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMotorcycleDetails() {
      try {
        const fetchedMotorcycle = await getMotorcycleById(params.id);
        

        if (!fetchedMotorcycle) {
          toast.error("Moto non trouvée.");
          router.push("/dashboard/motos");
          return;
        }


        const formattedPurchaseDate = fetchedMotorcycle.purchaseDate 
          ? isValid(parseISO(fetchedMotorcycle.purchaseDate)) 
            ? format(parseISO(fetchedMotorcycle.purchaseDate), "dd/MM/yyyy HH:mm") 
            : "Date invalide" 
          : "Non spécifiée";

        const formattedWarrantyDate = fetchedMotorcycle.warrantyDate 
          ? isValid(parseISO(fetchedMotorcycle.warrantyDate)) 
            ? format(parseISO(fetchedMotorcycle.warrantyDate), "dd/MM/yyyy HH:mm") 
            : "Date invalide" 
          : "Non spécifiée";

        const formattedMotorcycle: Motorcycle = {
          id: fetchedMotorcycle.id,
          brand: fetchedMotorcycle.brand?.value,
          model: fetchedMotorcycle.model?.value,
          licensePlate: fetchedMotorcycle.licensePlate?.value,
          kilometers: fetchedMotorcycle.kilometers?.value,
          maintenanceInterval: fetchedMotorcycle.maintenanceInterval?.value,
          purchaseDate: formattedPurchaseDate,
          warrantyDate: formattedWarrantyDate,
          ownerId: fetchedMotorcycle.ownerId?.value,
        };

        setMotorcycle(formattedMotorcycle);
        setLoading(false);
      } catch (error) {
        toast.error("Erreur lors du chargement de la moto.");
        router.push("/dashboard/motos");
      }
    }

    fetchMotorcycleDetails();
  }, [params.id, router]);

  if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;
  if (!motorcycle) return <p className="text-center text-lg font-semibold">Moto non trouvée.</p>;

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
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/motos">Motos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{motorcycle.licensePlate}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-6">
          <h1 className="text-3xl font-bold text-center">Détails de la moto</h1>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <Wrench className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">{motorcycle.model} - {motorcycle.brand}</CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">{motorcycle.licensePlate}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p><strong>Marque :</strong> {motorcycle.brand}</p>
                  <p><strong>Modèle :</strong> {motorcycle.model}</p>
                  <p><strong>Plaque :</strong> {motorcycle.licensePlate}</p>
                  <p><strong>Kilométrage :</strong> {motorcycle.kilometers} km</p>
                </div>
                <div className="space-y-4">
                  <p><strong>Date dachat :</strong> {motorcycle.purchaseDate}</p>
                  <p><strong>Garantie jusquau :</strong> {motorcycle.warrantyDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
