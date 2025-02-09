"use client";

import { useState } from "react";
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
import { AddMotoForm } from "@/components/moto/add-moto-form";
import { MotoFormValues } from "@/components/moto/add-moto-form";
import { createMotorcycle } from "@/lib/apiExpress"; 

export default function NewMotoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fonction de soumission
  const handleSubmit = async (values: MotoFormValues) => {
    setLoading(true);   // Afficher le chargement
    setError(null);     // Réinitialiser l'erreur
    setSuccess(false);  // Réinitialiser le succès

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token d'authentification manquant.");
      }

      // Appeler l'API pour créer la moto
      await createMotorcycle(values, token);

      setSuccess(true);  // Afficher succès
      console.log("Moto ajoutée avec succès :", values);
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue.");
      console.error("Erreur lors de la création de la moto :", error);
    } finally {
      setLoading(false); // Masquer le chargement une fois terminé
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
                  <BreadcrumbLink href="/dashboard/motos">Motos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Nouvelle Moto</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Ajouter une moto</h1>

          {/* Affichage des messages de succès ou d'erreur */}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">Moto ajoutée avec succès !</div>}

          {/* Formulaire pour ajouter une moto */}
          <AddMotoForm onSubmit={handleSubmit} mode="create" />

          {/* Affichage du message de chargement */}
          {loading && <div>Chargement...</div>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
