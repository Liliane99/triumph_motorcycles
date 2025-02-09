"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AddTrialForm } from "@/components/trial/add-trial-form";
import { useRouter } from "next/navigation";
import { getTrialById, updateTrial, getUserById, getMotorcycleById } from "@/lib/api";
import { toast } from "react-toastify";

export default function EditTrialPage({ params }: { params: { userId: string; motorcycleId: string } }) {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrial = async () => {
      try {
        const trial = await getTrialById(params.userId, params.motorcycleId);
        
        if (!trial) {
          toast.error("Essai non trouvé");
          router.push("/dashboard/trials");
          return;
        }

        // Convertir les dates en objets Date pour le formulaire
        setDefaultValues({
          user_id: trial.userId,
          motorcycle_id: trial.motorcycleId,
          start_date: new Date(trial.startDate),
          end_date: new Date(trial.endDate)
        });
      } catch (error) {
        console.error("Erreur lors du chargement de l'essai:", error);
        toast.error("Erreur lors du chargement de l'essai");
      } finally {
        setLoading(false);
      }
    };

    fetchTrial();
  }, [params.userId, params.motorcycleId, router]);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      await updateTrial(
        params.userId,
        params.motorcycleId,
        {
          startDate: values.start_date.toISOString(),
          endDate: values.end_date.toISOString()
        },
        token
      );

      toast.success("Essai mis à jour avec succès");
      router.push("/dashboard/trials");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour de l'essai");
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-4">
            <p>Chargement...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!defaultValues) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-4">
            <p>Essai non trouvé</p>
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
                  <BreadcrumbLink href="/dashboard/trials">Essais</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Modifier l&apos;essai</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier l&apos;essai</h1>
          <AddTrialForm 
            onSubmit={handleSubmit} 
            mode="edit" 
            defaultValues={defaultValues}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}