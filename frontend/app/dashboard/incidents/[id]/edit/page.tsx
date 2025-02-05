"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AddIncidentForm, IncidentFormValues } from "@/components/incident/add-incident-form";  
import { useEffect, useState } from "react";

export default function EditIncidentPage({ params }: { params: { incident_id: string } }) {
  const [defaultValues, setDefaultValues] = useState<IncidentFormValues | null>(null);

  useEffect(() => {
    const mockIncident: IncidentFormValues = {
      incident_id: "1",
      date: new Date("2025-01-01"),
      description: "Accident mineur sur route",
      status: "créer",
      comment: "Aucune blessure",
      motorcycleId: 101,
    };
    setDefaultValues(mockIncident);
  }, [params.incident_id]);

  const handleSubmit = (values: IncidentFormValues) => {
    console.log("Incident mis à jour :", values);
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
                  <BreadcrumbLink href="/dashboard/incidents">Incident</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{defaultValues.description}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier l'incident</h1>
          <AddIncidentForm onSubmit={handleSubmit} defaultValues={defaultValues} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
