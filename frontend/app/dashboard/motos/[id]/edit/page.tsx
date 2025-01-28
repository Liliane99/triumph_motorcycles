"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AddMotoForm, MotoFormValues } from "@/components/moto/add-moto-form";
import { useEffect, useState } from "react";

export default function EditMaintenancePage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<MotoFormValues | null>(null);

  useEffect(() => {
    const mockMoto: MotoFormValues = {
      id: "1",
      model: "Bandit 650",
      brand: "Suzuki",
      licensePlate: "AX-840-XC",
      price: "4560",
      date: new Date("2025-01-01"),
      warranty: new Date("2027-01-01"),
      maintenanceInterval: 10000,
      kilometer: 8000,
      client: "Liam Macquaire",
    };
    setDefaultValues(mockMoto);
  }, [params.id]);

  const handleSubmit = (values: MotoFormValues) => {
    console.log("Moto mis à jour :", values);
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
                  <BreadcrumbLink href="/dashboard/maintenance">Motos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{defaultValues.licensePlate}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier la moto</h1>
          <AddMotoForm onSubmit={handleSubmit} defaultValues={defaultValues} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
