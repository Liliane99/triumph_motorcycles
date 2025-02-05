"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AddTrialForm, TrialFormValues } from "@/components/trial/add-trial-form";  
import { useEffect, useState } from "react";

export default function EditTrialPage({ params }: { params: { trial_id: string } }) {
  const [defaultValues, setDefaultValues] = useState<TrialFormValues | null>(null);

  useEffect(() => {
    const mockTrial: TrialFormValues = {
      user_id: "U12345",
      motorcycle_id: "MOTO-789",
      start_date: new Date("2025-01-01"),
      end_date: new Date("2025-01-10"),
    };
    setDefaultValues(mockTrial);
  }, [params.trial_id]);

  const handleSubmit = (values: TrialFormValues) => {
    console.log("Essai mis à jour :", values);
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
                  <BreadcrumbLink href="/dashboard/trials">Essais</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Modifier l'essai</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier l'essai</h1>
          <AddTrialForm onSubmit={handleSubmit} defaultValues={defaultValues} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
