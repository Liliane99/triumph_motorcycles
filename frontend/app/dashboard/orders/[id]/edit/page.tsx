"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddMotoForm, MotoFormValues } from "@/components/moto/add-moto-form";
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
import { getMotorcycleById } from "@/lib/apiExpress";
import { toast } from "react-toastify";

export default function EditMotorcyclePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<Partial<MotoFormValues> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotorcycleDetails = async () => {
      try {
        const motorcycle = await getMotorcycleById(params.id);
        if (!motorcycle) {
          toast.error("Moto introuvable");
          router.push("/dashboard/motos");
          return;
        }

        // Conversion des dates string en objets Date
        let purchaseDate = null;
        let warrantyDate = null;

        try {
          if (motorcycle.purchaseDate) {
            purchaseDate = new Date(motorcycle.purchaseDate);
          }
        } catch (error) {
          console.error("Erreur lors de la conversion de la date d'achat:", error);
        }

        try {
          if (motorcycle.warrantyDate) {
            warrantyDate = new Date(motorcycle.warrantyDate);
          }
        } catch (error) {
          console.error("Erreur lors de la conversion de la date de garantie:", error);
        }

        const formValues: Partial<MotoFormValues> = {
          id: motorcycle.id,
          brand: motorcycle.brand,
          model: motorcycle.model,
          licensePlate: motorcycle.licensePlate,
          kilometers: motorcycle.kilometers.toString(),
          maintenanceInterval: motorcycle.maintenanceInterval.toString(),
          purchaseDate: purchaseDate,
          warrantyDate: warrantyDate,
          ownerId: motorcycle.ownerId
        };

        console.log("Valeurs récupérées:", formValues);
        setDefaultValues(formValues);
      } catch (error) {
        console.error("Erreur lors du chargement de la moto:", error);
        toast.error("Erreur lors du chargement de la moto");
        router.push("/dashboard/motos");
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycleDetails();
  }, [params.id, router]);

  if (loading) return <p className="text-center pt-8">Chargement...</p>;
  if (!defaultValues) return <p className="text-center pt-8">Moto introuvable</p>;

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
                  <BreadcrumbLink href="/dashboard/motos">Motos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Modifier moto</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">
            Modifier la moto {defaultValues.brand} {defaultValues.model}
          </h1>
          <AddMotoForm 
            defaultValues={defaultValues} 
            mode="edit" 
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}