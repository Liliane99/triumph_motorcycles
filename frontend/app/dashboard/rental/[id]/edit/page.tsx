"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AddLocationForm, LocationFormValues } from "@/components/rental/add-rental-form";  
import { useEffect, useState } from "react";

export default function EditLocationPage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<LocationFormValues | null>(null);

  useEffect(() => {
    const mockLocation: LocationFormValues = {
      id: "1",
      reference: "LOC-0001",
      brand: "Toyota",
      model: "Corolla",
      licensePlate: "AB-123-CD",
      client: "Liam Macquaire",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-01-07"),
    };
    setDefaultValues(mockLocation);
  }, [params.id]);

  const handleSubmit = (values: LocationFormValues) => {
    console.log("Location mise à jour :", values);
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
                  <BreadcrumbLink href="/dashboard/rental">Locations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier la location</h1>
          <AddLocationForm onSubmit={handleSubmit} defaultValues={defaultValues} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
