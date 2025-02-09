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
import { DataTable } from "@/components/trial/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEnrichedTrials } from "@/lib/api";
import { columns } from "@/components/trial/columns";

export default function Trials() {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrials() {
      try {
        const data = await getEnrichedTrials();
        setTrials(data);
      } catch (error) {
        console.error("Erreur lors du chargement des essais", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrials();
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
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Essais</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <Card>
            <CardHeader className="flex items-center justify-center">
              <CardTitle>Total des essais</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <p className="text-3xl font-bold">{trials.length}</p>
            </CardContent>
          </Card>
          <div className="mt-8">
            {loading ? (
              <p className="text-center text-lg font-semibold">Chargement...</p>
            ) : (
              <DataTable columns={columns} data={trials} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
