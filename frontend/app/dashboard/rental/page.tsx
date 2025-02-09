"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList,
  BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { RentalDataTable } from "@/components/rental/data-table"; 
import { columns } from "@/components/rental/columns"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRentals } from "@/components/rental/columns"; // Utilisation du hook personnalisé

export default function RentalsPage() {
  const { rentals, setRentals, loading, error } = useRentals(); // Utilisation du hook pour récupérer les locations

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
                  <BreadcrumbPage>Locations</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          {loading && <p className="text-center text-gray-500">Chargement des locations...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex items-center justify-center">
                    <CardTitle>Total locations enregistrées</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <p className="text-3xl font-bold">{rentals.length}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <RentalDataTable columns={columns} data={rentals} />
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
