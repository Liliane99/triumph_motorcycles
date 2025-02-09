"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { AddIncidentForm } from "@/components/incidents/add-incident-form";
import { getIncidents, createIncident } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

function NewIncidentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [nextReference, setNextReference] = useState<string>("INC00001");

  useEffect(() => {
    async function fetchLastReference() {
      try {
        const incidents = await getIncidents();

        if (incidents.length > 0) {
          const lastReference = incidents
            .map((i) => i.reference)
            .filter((ref) => ref.startsWith("INC"))
            .sort()
            .pop();

          if (lastReference) {
            const lastNumber = parseInt(lastReference.replace("INC", ""), 10);
            setNextReference(`INC${String(lastNumber + 1).padStart(5, "0")}`);
          }
        }
      } catch (error) {
        toast.error("Erreur lors de la récupération des références.");
      }
    }

    fetchLastReference();
  }, []);

  const handleCreateIncident = async (values: any) => {
    if (!user) {
      toast.error("Vous devez être connecté pour déclarer un incident.");
      return;
    }

    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }

    try {
      const incidentData = {
        reference: values.reference,
        description: values.description,
        status: values.status,
        date: values.date,
        motorcycleId: values.motorcycleId,
      };

      await createIncident(
        {
          reference: incidentData.reference,
          description: incidentData.description,
          status: incidentData.status,
          date: new Date(incidentData.date).toISOString(),
          motorcycleId: incidentData.motorcycleId,
        },
        token
      );

      toast.success("Incident déclaré avec succès !");
      router.push("/dashboard/incidents");
    } catch (error) {
      console.error("Erreur lors de la création de l'incident:", error);
      toast.error("Erreur lors de la déclaration de l'incident.");
    }
  };

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
                  <BreadcrumbLink href="/dashboard/incidents">Incidents</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Nouvel incident</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Déclarer un incident</h1>
          <AddIncidentForm 
            onSubmit={handleCreateIncident} 
            defaultValues={{ reference: nextReference }}
            mode="create" 
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default NewIncidentPage;