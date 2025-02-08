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
import { AddPartForm } from "@/components/parts/add-part-form";
import { getParts, createPart } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function NewPartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [nextReference, setNextReference] = useState<string>("PART001");

  useEffect(() => {
    async function fetchLastReference() {
      try {
        const parts = await getParts();

        if (parts.length > 0) {
          const lastReference = parts
          .map((p) => p.reference.value) 
          .filter((ref) => ref.startsWith("PART")) 
          .sort()
          .pop();
          if (lastReference) {
            const lastNumber = parseInt(lastReference.replace("PART", ""), 10); 
            setNextReference(`PART${String(lastNumber + 1).padStart(3, "0")}`);
          }
        }
      } catch (error) {
        toast.error("Erreur lors de la récupération des références.");
      }
    }

    fetchLastReference();
  }, []);

  const handleCreatePart = async (values: any) => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter une pièce.");
      return;
    }
  
    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }
  
    try {
      await createPart(
        {
          ...values,
          reference: nextReference,
          createdBy: user.userId,  
        },
        token
      );
  
      toast.success("Pièce ajoutée avec succès !");
      router.push("/dashboard/parts");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la pièce.");
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
                  <BreadcrumbLink href="/dashboard/parts">Pièces détachées</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Nouvelle pièce</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Ajouter une pièce détachée</h1>
          <AddPartForm onSubmit={handleCreatePart} defaultValues={{ reference: nextReference }} mode="create" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
