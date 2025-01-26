"use client";

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
import { AddMaintenanceForm, MaintenanceFormValues } from "@/components/maintenance/add-maintenance-form";
import { useEffect, useState } from "react";

export default function EditMaintenancePage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<MaintenanceFormValues | null>(null);

  useEffect(() => {
    const mockEntretien: MaintenanceFormValues = {
      reference: "ENT-001",
      date: new Date("2025-01-01"),
      plaque: "AA-123-BB",
      client: "Liliane",
      recommendations: "Vérifier les freins après 500 km",
      parts: [
        { name: "Filtre à huile", reference: "FO-1234", quantity: 1, unitPrice: 25 },
        { name: "Huile moteur", reference: "HM-5678", quantity: 2, unitPrice: 15 },
      ],
    };
    setDefaultValues(mockEntretien);
  }, [params.id]);

  const handleSubmit = (values: MaintenanceFormValues) => {
    console.log("Entretien mis à jour :", values);
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
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/maintenance">Entretiens</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{defaultValues.reference}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier entretien</h1>
          <AddMaintenanceForm onSubmit={handleSubmit} defaultValues={defaultValues} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
