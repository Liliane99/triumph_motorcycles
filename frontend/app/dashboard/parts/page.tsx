"use client";

import { useEffect, useState } from "react";
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
import { DataTable } from "@/components/parts/data-table";
import { columns } from "@/components/parts/columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getParts, getUserById, ApiPart, Part } from "@/lib/api";
import { toast } from "react-toastify";

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchParts() {
      try {
        const apiParts: ApiPart[] = await getParts();
        const transformedParts = await Promise.all(
          apiParts.map(async (apiPart) => {
            const createdByUser = apiPart.createdBy ? await getUserById(apiPart.createdBy) : null;
            const updatedByUser = apiPart.updatedBy ? await getUserById(apiPart.updatedBy) : null;

            return {
              id: apiPart.id,
              reference: apiPart.reference.value,
              type: apiPart.type.value as Part["type"],
              name: apiPart.name.value,
              quantityInStock: apiPart.quantityInStock.value,
              partThreshold: apiPart.partThreshold.value,
              unitPrice: apiPart.unitPrice.value,
              createdByName: createdByUser?.username?.value || "N/A",
              updatedByName: updatedByUser?.username?.value || "N/A",
              createdAt: new Date(apiPart.createdAt).toLocaleString(),
              updatedAt: new Date(apiPart.updatedAt).toLocaleString(),
            };
          })
        );

        setParts(transformedParts);
      } catch (error) {
        toast.error("Erreur lors de la récupération des pièces.");
      } finally {
        setLoading(false);
      }
    }

    fetchParts();
  }, []);

  if (loading) return <p className="text-center p-6 text-lg">Chargement des pièces...</p>;

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
                  <BreadcrumbPage>Pièces détachées</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Total Pièces</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{parts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>En Stock</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">
                  {parts.filter((part) => part.quantityInStock > 0).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Seuil bas</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">
                  {parts.filter((part) => part.quantityInStock < part.partThreshold).length}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <DataTable columns={columns} data={parts} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
