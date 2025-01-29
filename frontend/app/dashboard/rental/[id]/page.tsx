"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
import {
  Calendar,
  User,
  Truck,
  DollarSign,
} from "lucide-react";

type Location = {
  id: string;
  client: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  motorcycle: string;  // Moto concernée par la location
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
};

export default function LocationDetailsPage({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const mockLocation: Location = {
      id: params.id,
      client: "Liliane",
      startDate: "2025-01-01",
      endDate: "2025-01-07",
      totalPrice: 500,
      motorcycle: "Yamaha MT-07",
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-05T12:00:00Z",
      updatedBy: "Manager",
    };
    setLocation(mockLocation);
  }, [params.id]);

  if (!location) return <p>Chargement...</p>;

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
                  <BreadcrumbLink href="/dashboard/rental">Locations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Location {location.id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-8">
          <h1 className="text-3xl font-bold">Détails de la location</h1>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <Truck className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                Location de {location.motorcycle}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {new Date(location.startDate).toLocaleDateString()} - {new Date(location.endDate).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <strong>Client :</strong> {location.client}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Prix total :</strong> {location.totalPrice} €
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Motocyclette :</strong> {location.motorcycle}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Date de début :</strong>{" "}
                    {new Date(location.startDate).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Date de fin :</strong>{" "}
                    {new Date(location.endDate).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Créée le :</strong>{" "}
                    {new Date(location.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifiée le :</strong>{" "}
                    {new Date(location.updatedAt).toLocaleString()}
                  </p>
                  {location.updatedBy && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifiée par :</strong> {location.updatedBy}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
