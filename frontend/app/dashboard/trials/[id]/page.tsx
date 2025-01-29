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
import { Calendar, User } from "lucide-react";

type Trial = {
  trial_id: string;
  user_id: string;
  motorcycle_id: string;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
};

export default function TrialDetailsPage({ params }: { params: { trial_id: string } }) {
  const [trial, setTrial] = useState<Trial | null>(null);

  useEffect(() => {
    const mockTrial: Trial = {
      trial_id: params.trial_id,
      user_id: "U12345",
      motorcycle_id: "MOTO-789",
      start_date: "2025-01-01",
      end_date: "2025-01-10",
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-05T12:00:00Z",
      updatedBy: "Manager",
    };
    setTrial(mockTrial);
  }, [params.trial_id]);

  if (!trial) return <p>Chargement...</p>;

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
                  <BreadcrumbLink href="/dashboard/trials">Essais</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Essai {trial.trial_id}</BreadcrumbPage>
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
                Essai pour l'utilisateur {trial.user_id}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {new Date(trial.start_date).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Moto :</strong> {trial.motorcycle_id}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Date de début :</strong> {new Date(trial.start_date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Date de fin :</strong> {new Date(trial.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Créé le :</strong> {new Date(trial.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié le :</strong> {new Date(trial.updatedAt).toLocaleString()}
                  </p>
                  {trial.updatedBy && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifié par :</strong> {trial.updatedBy}
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
