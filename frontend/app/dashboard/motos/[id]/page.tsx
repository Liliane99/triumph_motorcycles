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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Tag, Package, DollarSign, Calendar, Shield } from "lucide-react";
import { getMotorcycleById, Motorcycle, getUserById } from "@/lib/api";
import { toast } from "react-toastify";

export default function MotoDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [createdByName, setCreatedByName] = useState<string>("Chargement...");
  const [updatedByName, setUpdatedByName] = useState<string>("Chargement...");
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

        const formattedMotorcycle: Motorcycle = {
          id: fetchedMotorcycle.id,
          brand: fetchedMotorcycle.brand?.value,
          model: fetchedMotorcycle.model?.value,
          licensePlate: fetchedMotorcycle.licensePlate?.value,
          kilometers: fetchedMotorcycle.kilometers?.value,
          maintenanceInterval: fetchedMotorcycle.maintenanceInterval?.value,
          purchaseDate: new Date(fetchedMotorcycle.purchaseDate?.value).toLocaleString(),
          warrantyDate: new Date(fetchedMotorcycle.warrantyDate?.value).toLocaleString(),
          ownerId: fetchedMotorcycle.ownerId?.value,
          createdByName: "Chargement...",
          updatedByName: "Chargement...",
          createdAt: new Date(fetchedMotorcycle.createdAt).toLocaleString(),
          updatedAt: new Date(fetchedMotorcycle.updatedAt).toLocaleString(),
        };

        setMotorcycle(formattedMotorcycle);

        if (fetchedMotorcycle.createdBy) {
          const createdByUser = await getUserById(fetchedMotorcycle.createdBy);
          setCreatedByName(createdByUser?.username.value || "Inconnu");
        } else {
          setCreatedByName("Système");
        }

        if (fetchedMotorcycle.updatedBy) {
          const updatedByUser = await getUserById(fetchedMotorcycle.updatedBy);
          setUpdatedByName(updatedByUser?.username.value || "Inconnu");
        } else {
          setUpdatedByName("Système");
        }

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
                  <p className="flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <strong>Marque :</strong> {motorcycle.brand}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <strong>Modèle :</strong> {motorcycle.model}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <strong>Numéro de plaque :</strong> {motorcycle.licensePlate}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Kilométrage :</strong> {motorcycle.kilometers} km
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Date d'achat :</strong> {motorcycle.purchaseDate}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Garantie jusqu'au :</strong> {motorcycle.warrantyDate}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <p className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <strong>Créée le :</strong> {motorcycle.createdAt}
                </p>
                <p className="flex items-center gap-2 text-lg">
                  <strong>Créée par :</strong> {createdByName}
                </p>
                <p className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <strong>Modifiée le :</strong> {motorcycle.updatedAt}
                </p>
                <p className="flex items-center gap-2 text-lg">
                  <strong>Modifiée par :</strong> {updatedByName}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
