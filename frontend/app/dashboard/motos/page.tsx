"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbList, 
  BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/moto/data-table";
import { columns } from "@/components/moto/columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMotorcycles } from "@/lib/apiExpress"; 

export default function MotosPage() {
  const [motos, setMotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📡 Récupération des motos via Axios
  useEffect(() => {
    async function fetchMotos() {
      try {
        const data = await getMotorcycles();
        setMotos(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMotos();
  }, []);

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
                  <BreadcrumbPage>Motos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          {/* 🔴 Gestion du chargement et des erreurs */}
          {loading && <p className="text-center text-gray-500">Chargement des motos...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex items-center justify-center">
                    <CardTitle>Total motos enregistrées</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <p className="text-3xl font-bold">{motos.length}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <DataTable columns={columns} data={motos} />
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
