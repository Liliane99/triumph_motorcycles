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
  Settings,
  User,
  Truck,
  DollarSign,
} from "lucide-react";

type Moto = {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  price: number;
  client: string;
  date: string;
  warranty: string;
  maintenanceInterval: number;
  kilometer: number; 
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
};

export default function MotoDetailsPage({ params }: { params: { id: string } }) {
  const [moto, setMoto] = useState<Moto | null>(null);

  useEffect(() => {
    const mockMoto: Moto = {
      id: params.id,
      brand: "Yamaha",
      model: "MT-07",
      licensePlate: "AA-123-BB",
      price: 7500,
      client: "Liliane",
      date: "2025-01-01",
      warranty: "2027-01-01",
      maintenanceInterval: 5000,
      kilometer: 8000, 
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-05T12:00:00Z",
      updatedBy: "Manager",
    };
    setMoto(mockMoto);
  }, [params.id]);

  if (!moto) return <p>Chargement...</p>;

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
                  <BreadcrumbLink href="/dashboard/motos">Motos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{moto.brand} {moto.model}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-8">
          <h1 className="text-3xl font-bold">Détails de la moto</h1>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <Truck className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                {moto.brand} {moto.model}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {new Date(moto.date).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <strong>Client :</strong> {moto.client}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <strong>Plaque :</strong> {moto.licensePlate}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <strong>Intervalle de maintenance :</strong> {moto.maintenanceInterval} km
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Kilométrage :</strong> {moto.kilometer} km 
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Prix :</strong> {moto.price} €
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Date dachat :</strong>{" "}
                    {new Date(moto.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Garantie jusquau :</strong>{" "}
                    {new Date(moto.warranty).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Créée le :</strong>{" "}
                    {new Date(moto.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifiée le :</strong>{" "}
                    {new Date(moto.updatedAt).toLocaleString()}
                  </p>
                  {moto.updatedBy && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifiée par :</strong> {moto.updatedBy}
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
