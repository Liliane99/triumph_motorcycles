"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddMaintenanceForm, MaintenanceFormValues } from "@/components/maintenance/add-maintenance-form";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getMaintenanceById, getMaintenanceParts } from "@/lib/api";
import { toast } from "react-toastify";

export default function EditMaintenancePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<Partial<MaintenanceFormValues> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenanceDetails = async () => {
      try {
        const [maintenance, maintenanceParts] = await Promise.all([
          getMaintenanceById(params.id),
          getMaintenanceParts(params.id)
        ]);

        if (!maintenance) {
          toast.error("Maintenance introuvable");
          router.push("/dashboard/maintenance");
          return;
        }

        
        let maintenanceDate = null;
        try {
          if (maintenance.date) {
            maintenanceDate = new Date(maintenance.date);
          }
        } catch (error) {
          console.error("Erreur lors de la conversion de la date:", error);
        }

       
        const formattedParts = maintenanceParts.map(part => ({
          partId: part.partId,
          name: "",  
          reference: "",  
          quantity: typeof part.quantityUsed === 'object' ? part.quantityUsed.value : part.quantityUsed,
          unitPrice: 0,  
          totalPrice: 0 
        }));

        const formValues: Partial<MaintenanceFormValues> = {
          reference: maintenance.reference,
          date: maintenanceDate,
          recommendation: maintenance.recommendation,
          motorcycleId: maintenance.motorcycleBrand,
          parts: formattedParts,
          totalPrice: formattedParts.reduce((sum, part) => sum + part.totalPrice, 0)
        };

        console.log("Valeurs récupérées:", formValues);
        setDefaultValues(formValues);
      } catch (error) {
        console.error("Erreur lors du chargement de la maintenance:", error);
        toast.error("Erreur lors du chargement de la maintenance");
        router.push("/dashboard/maintenance");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceDetails();
  }, [params.id, router]);

  if (loading) return <p className="text-center pt-8">Chargement...</p>;
  if (!defaultValues) return <p className="text-center pt-8">Maintenance introuvable</p>;

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
                  <BreadcrumbLink href="/dashboard/maintenance">Maintenance</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Modifier la maintenance</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Modifier la maintenance {defaultValues.reference}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddMaintenanceForm 
                defaultValues={defaultValues} 
                mode="edit" 
                maintenanceId={params.id}
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}