"use client";

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
import { useEffect, useState } from "react";
import { Wrench, Tag, Package, DollarSign, Calendar, Shield } from "lucide-react";

type Part = {
  id: string;
  reference: string;
  type: string;
  name: string;
  quantity_in_stock: number;
  part_threshold: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};

export default function PartDetailsPage({ params }: { params: { id: string } }) {
  const [part, setPart] = useState<Part | null>(null);

  useEffect(() => {
    const mockPart: Part = {
      id: params.id,
      reference: "P12345",
      type: "brake",
      name: "Disque de frein",
      quantity_in_stock: 10,
      part_threshold: 5,
      unit_price: 50.99,
      created_at: "2025-01-01T10:00:00Z",
      updated_at: "2025-01-10T12:00:00Z",
      created_by: "Admin",
      updated_by: "Manager",
    };
    setPart(mockPart);
  }, [params.id]);

  if (!part) return <p className="text-center text-lg font-semibold">Chargement...</p>;

  const typeColors: Record<string, string> = {
    oil: "bg-yellow-500 text-white",
    tire: "bg-blue-500 text-white",
    brake: "bg-red-500 text-white",
    chain: "bg-gray-600 text-white",
    battery: "bg-purple-500 text-white",
    spark_plug: "bg-orange-500 text-white",
    air_filter: "bg-green-500 text-white",
    clutch: "bg-pink-500 text-white",
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
                    <strong>Stock :</strong> {part.quantity_in_stock} unités
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <strong>Seuil dalerte :</strong> {part.part_threshold} unités
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Prix unitaire :</strong> {part.unit_price.toFixed(2)} €
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong> {new Date(part.created_at).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Créé par :</strong> {part.created_by}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Modifié le :</strong> {new Date(part.updated_at).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié par :</strong> {part.updated_by}
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
