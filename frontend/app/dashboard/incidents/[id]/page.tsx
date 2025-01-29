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
import { Calendar, User, AlertCircle } from "lucide-react";

type Incident = {
  incident_id: string;
  date: string;
  description: string;
  status: "créer" | "résolu";
  comment?: string;
  motorcycleId?: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
};

export default function IncidentDetailsPage({ params }: { params: { incident_id: string } }) {
  const [incident, setIncident] = useState<Incident | null>(null);

  useEffect(() => {
    const mockIncident: Incident = {
      incident_id: params.incident_id,
      date: "2025-01-01",
      description: "Accident mineur sur route",
      status: "créer",
      comment: "Aucune blessure",
      motorcycleId: 101,
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-05T12:00:00Z",
      updatedBy: "Manager",
    };
    setIncident(mockIncident);
  }, [params.incident_id]);

  if (!incident) return <p>Chargement...</p>;

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
                  <BreadcrumbLink href="/dashboard/incidents">Incident</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Incident {incident.incident_id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-8">
          <h1 className="text-3xl font-bold">Détails de l'incident</h1>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <AlertCircle className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                Incident sur moto {incident.motorcycleId || "N/A"}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {new Date(incident.date).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <strong>Description :</strong> {incident.description}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Statut :</strong> {incident.status}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Commentaire :</strong> {incident.comment || "-"}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong> {new Date(incident.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié le :</strong> {new Date(incident.updatedAt).toLocaleString()}
                  </p>
                  {incident.updatedBy && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifié par :</strong> {incident.updatedBy}
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