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
import { Calendar, User, AlertCircle, Bike } from "lucide-react";
import { Incident, getIncidentById } from "@/lib/api";
import { toast } from "react-toastify";
import { format, parseISO, isValid } from "date-fns";

export default function IncidentDetailsPage({ params }: { params: { id: string } }) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const incidentData = await getIncidentById(params.id);
        if (!incidentData) {
          setError("Incident non trouvé");
          return;
        }
        setIncident(incidentData);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'incident:", err);
        toast.error("Erreur lors de la récupération de l'incident");
        setError("Erreur lors de la récupération de l'incident");
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [params.id]);

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <p className="text-lg">Chargement des détails de l'incident...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !incident) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-red-500">{error || "Incident non trouvé"}</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
                  <BreadcrumbLink href="/dashboard/incidents">Incidents</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Incident {incident.reference}</BreadcrumbPage>
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
                Incident {incident.reference}
              </CardTitle>
              <Badge 
                variant={incident.status === "opened" ? "destructive" : "success"}
                className="mt-2"
              >
                {incident.status === "opened" ? "En cours" : "Résolu"}
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
                    <Bike className="h-5 w-5 text-muted-foreground" />
                    <strong>Moto :</strong> {incident.motorcycleLicensePlate}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Date de lincident :</strong>{" "}
                    {new Date(incident.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé par :</strong> {incident.createdByName}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong>{" "}
                    {new Date(incident.createdAt).toLocaleString()}
                  </p>
                  {incident.updatedByName && (
                    <>
                      <p className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <strong>Modifié par :</strong> {incident.updatedByName}
                      </p>
                      <p className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <strong>Modifié le :</strong>{" "}
                        {new Date(incident.updatedAt).toLocaleString()}
                      </p>
                    </>
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