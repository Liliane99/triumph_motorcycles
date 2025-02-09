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
import { getIncidentById, updateIncident, Incident } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

function EditIncidentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIncident() {
      try {
        const fetchedIncident = await getIncidentById(params.id);
        if (!fetchedIncident) {
          toast.error("Incident non trouvé");
          router.push("/dashboard/incidents");
          return;
        }
        setIncident(fetchedIncident);
      } catch (error) {
        toast.error("Erreur lors de la récupération de l'incident");
        router.push("/dashboard/incidents");
      } finally {
        setLoading(false);
      }
    }

    fetchIncident();
  }, [params.id, router]);

  const handleUpdateIncident = async (values: any) => {
    if (!user) {
      toast.error("Vous devez être connecté pour modifier un incident.");
      return;
    }

    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }

    try {
      const updateData = {
        description: values.description,
        status: values.status,
        date: new Date(values.date).toISOString(),
      };

      console.log("Données de mise à jour:", updateData);

      await updateIncident(params.id, updateData, token);

      toast.success("Incident mis à jour avec succès !");
      router.push("/dashboard/incidents");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour de l'incident.");
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <p className="text-lg">Chargement...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!incident) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-red-500">Incident non trouvé</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
                  <BreadcrumbPage>Modifier l'incident {incident.reference}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier l'incident</h1>
          <AddIncidentForm 
            onSubmit={handleUpdateIncident} 
            defaultValues={{
              reference: incident.reference,
              description: incident.description,
              status: incident.status,
              date: new Date(incident.date).toISOString().split('T')[0],
              motorcycleId: incident.motorcycleLicensePlate
            }}
            mode="edit"
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default EditIncidentPage;