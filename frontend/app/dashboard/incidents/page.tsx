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
import { DataTable } from "@/components/incidents/data-table";
import { columns } from "@/components/incidents/columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getIncidents, Incident } from "@/lib/api";
import { toast } from "react-toastify";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const fetchedIncidents = await getIncidents();
        setIncidents(fetchedIncidents);
      } catch (error) {
        console.error("Erreur lors de la récupération des incidents:", error);
        toast.error("Erreur lors de la récupération des incidents.");
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  if (loading) return <p className="text-center p-6 text-lg">Chargement des incidents...</p>;

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
                  <BreadcrumbPage>Incidents</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Total Incidents</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{incidents.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>En cours</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold text-red-600">
                  {incidents.filter((incident) => incident.status === "opened").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Résolus</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold text-green-600">
                  {incidents.filter((incident) => incident.status === "resolved").length}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <DataTable columns={columns} data={incidents} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}