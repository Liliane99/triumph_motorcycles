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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Tag, Package, DollarSign, Calendar, Shield } from "lucide-react";
import { getPartById, getUserById, Part } from "@/lib/api";
import { toast } from "react-toastify";

export default function PartDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [part, setPart] = useState<Part | null>(null);
  const [createdByName, setCreatedByName] = useState<string>("Chargement...");
  const [updatedByName, setUpdatedByName] = useState<string>("Chargement...");
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
          createdByName: "Chargement...",
          updatedByName: "Chargement...",
          createdAt: new Date(fetchedPart.createdAt).toLocaleString(),
          updatedAt: new Date(fetchedPart.updatedAt).toLocaleString(),
        };

        setPart(formattedPart);

        // Récupérer les noms des utilisateurs pour createdBy et updatedBy
        if (fetchedPart.createdBy) {
          const createdByUser = await getUserById(fetchedPart.createdBy);
          setCreatedByName(createdByUser?.username.value || "Inconnu");
        } else {
          setCreatedByName("Système");
        }

        if (fetchedPart.updatedBy) {
          const updatedByUser = await getUserById(fetchedPart.updatedBy);
          setUpdatedByName(updatedByUser?.username.value || "Inconnu");
        } else {
          setUpdatedByName("Système");
        }

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

  const typeColors: Record<string, string> = {
    oil: "bg-yellow-500 text-white",
    tire: "bg-blue-500 text-white",
    brake: "bg-red-500 text-white",
    chain: "bg-gray-600 text-white",
    battery: "bg-purple-500 text-white",
    filter: "bg-green-500 text-white",
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

        <div className="p-4 space-y-6">
          <h1 className="text-3xl font-bold text-center">Détails de la pièce</h1>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <Wrench className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">{part.name}</CardTitle>
              <Badge className={`mt-2 ${typeColors[part.type] || "bg-gray-400 text-white"}`}>
                {part.type}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <strong>Référence :</strong> {part.reference}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <strong>Stock :</strong> {part.quantityInStock} unités
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <strong>Seuil d'alerte :</strong> {part.partThreshold} unités
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Prix unitaire :</strong> {part.unitPrice.toFixed(2)} €
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong> {part.createdAt}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Créé par :</strong> {createdByName}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Modifié le :</strong> {part.updatedAt}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié par :</strong> {updatedByName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
