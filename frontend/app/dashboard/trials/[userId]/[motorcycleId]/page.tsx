"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Calendar, User } from "lucide-react";
import { getTrialById, getUserById, getMotorcycleById, EnrichedTrial } from "@/lib/api";
import { format, parseISO, isValid } from "date-fns";

export default function TrialDetailsPage({ params }: { params: { userId: string; motorcycleId: string } }) {
  const router = useRouter();
  const [trial, setTrial] = useState<EnrichedTrial | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTrialDetails() {
      try {
        console.log(` Récupération de l'essai : ${params.userId} - ${params.motorcycleId}`);
        const fetchedTrial = await getTrialById(params.userId, params.motorcycleId);
        if (!fetchedTrial) {
          console.error("Essai introuvable !");
          router.push("/dashboard/trials");
          return;
        }

        const user = await getUserById(fetchedTrial.userId);
        const motorcycle = await getMotorcycleById(fetchedTrial.motorcycleId);
        const createdByUser = await getUserById(fetchedTrial.createdBy);
        const updatedByUser = fetchedTrial.updatedBy ? await getUserById(fetchedTrial.updatedBy) : null;

        setTrial({
          userId: fetchedTrial.userId,
          username: user?.username.value || "Utilisateur inconnu",
          motorcycleId: fetchedTrial.motorcycleId,
          motorcycleBrand: motorcycle?.brand || "Moto inconnue",
          startDate: fetchedTrial.startDate,
          endDate: fetchedTrial.endDate,
          createdByName: createdByUser?.username.value || "Inconnu",
          updatedByName: updatedByUser?.username.value || "N/A",
          createdAt: fetchedTrial.createdAt,
          updatedAt: fetchedTrial.updatedAt,
        });

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des détails de l'essai :", error);
        router.push("/dashboard/trials");
      }
    }

    fetchTrialDetails();
  }, [params.userId, params.motorcycleId, router]);

  if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;
  if (!trial) return <p className="text-center text-lg font-semibold">Essai introuvable.</p>;

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "Non spécifiée";
    const dateStr = typeof dateValue === "string" ? dateValue : dateValue?.value;
    if (!dateStr) return "Non spécifiée";
    
    const parsedDate = parseISO(dateStr);
    return isValid(parsedDate) ? format(parsedDate, "dd/MM/yyyy HH:mm") : "Date invalide";
  };

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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/trials">Essais</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Essai {trial.username}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-8">
          <h1 className="text-3xl font-bold">Détails de l'essai</h1>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <Calendar className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                Essai pour {trial.username}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {formatDate(trial.startDate)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Moto :</strong> {trial.motorcycleBrand}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Date de début :</strong> {formatDate(trial.startDate)}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Date de fin :</strong> {formatDate(trial.endDate)}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <strong>Créé par :</strong> {trial.createdByName}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Créé le :</strong> {formatDate(trial.createdAt)}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié le :</strong> {formatDate(trial.updatedAt)}
                  </p>
                  {trial.updatedByName && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifié par :</strong> {trial.updatedByName}
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
