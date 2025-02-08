"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { getPartById, updatePart, Part } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

export default function EditPartPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPartDetails() {
      try {
        const fetchedPart = await getPartById(params.id);
        if (!fetchedPart) {
          toast.error("Pièce non trouvée.");
          router.push("/dashboard/parts");
          return;
        }

        const formattedPart: Part = {
          id: fetchedPart.id,
          reference: fetchedPart.reference.value, 
          type: fetchedPart.type.value as Part["type"], 
          name: fetchedPart.name.value, 
          quantityInStock: fetchedPart.quantityInStock.value, 
          partThreshold: fetchedPart.partThreshold.value, 
          unitPrice: fetchedPart.unitPrice.value, 
          createdByName: "Inconnu",
          updatedByName: "Inconnu",
          createdAt: new Date(fetchedPart.createdAt).toLocaleString(),
          updatedAt: new Date(fetchedPart.updatedAt).toLocaleString(),
        };

        setPart(formattedPart);
        setLoading(false);
      } catch (error) {
        toast.error("Erreur lors du chargement de la pièce.");
        router.push("/dashboard/parts");
      }
    }

    fetchPartDetails();
  }, [params.id, router]);

  if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;
  if (!part) return <p className="text-center text-lg font-semibold">Pièce non trouvée.</p>;

  const handleSubmit = async (values: Omit<Part, "id" | "createdAt" | "updatedAt" | "createdByName" | "updatedByName">) => {
    if (!user) {
      toast.error("Vous devez être connecté.");
      return;
    }

    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }

    try {
      await updatePart(
        part.id,
        {
          reference: values.reference,
          type: values.type,
          name: values.name,
          quantityInStock: values.quantityInStock,
          partThreshold: values.partThreshold,
          unitPrice: values.unitPrice,
        },
        token
      );

      toast.success("Pièce mise à jour avec succès !");
      router.push("/dashboard/parts");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la pièce.");
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
                  <BreadcrumbPage>{part.reference}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier la pièce</h1>
          <AddPartForm onSubmit={handleSubmit} defaultValues={part} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
