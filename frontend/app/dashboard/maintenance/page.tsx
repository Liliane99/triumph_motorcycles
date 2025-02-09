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
import { DataTable } from "@/components/maintenance/data-table";
import { columns } from "@/components/maintenance/columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMaintenances, Maintenance } from "@/lib/api";
import { toast } from "react-toastify";

export default function MaintenancesPage() {
  const router = useRouter();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMaintenances() {
      try {
        const fetchedMaintenances = await getMaintenances();
        setMaintenances(fetchedMaintenances);
        setLoading(false);
      } catch (error) {
        toast.error("Erreur lors de la récupération des maintenances.");
        router.push("/dashboard");
      }
    }

    fetchMaintenances();
  }, [router]);

  if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;

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
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Maintenances</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Total Maintenances</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{maintenances.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <DataTable columns={columns} data={maintenances} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}