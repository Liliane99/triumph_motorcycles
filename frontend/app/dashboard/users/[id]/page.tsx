"use client";

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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { UserIcon, Mail, Phone, Calendar, Shield } from "lucide-react";

type User = {
  id: string;
  raisonSociale: string;
  email: string;
  phone_number: string;
  role: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  license_number?: string;
  experience_level?: string;
};

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const mockUser: User = {
      id: params.id,
      raisonSociale: "Exemple Société",
      email: "example@example.com",
      phone_number: "0612345678",
      role: "client",
      createdAt: "2025-01-01T10:00:00Z",
      createdBy: "Admin",
      updatedAt: "2025-01-10T12:00:00Z",
      updatedBy: "Manager",
      license_number: "AA-123-BB",
      experience_level: "Intermédiaire",
    };
    setUser(mockUser);
  }, [params.id]);

  if (!user) return <p>Chargement...</p>;

  const roleColors: Record<string, string> = {
    admin: "bg-red-500 text-white",
    manager: "bg-yellow-500 text-white",
    client: "bg-blue-500 text-white",
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/users">Utilisateurs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{user.raisonSociale}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-6">
          <h1 className="text-3xl font-bold">Détails de utilisateur</h1>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <UserIcon className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                {user.raisonSociale}
              </CardTitle>
              <Badge className={`mt-2 ${roleColors[user.role]}`}>{user.role}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <strong>Email :</strong> {user.email}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <strong>Téléphone :</strong> {user.phone_number}
                  </p>
                  {user.license_number && (
                    <p className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <strong>Plaque immatriculation :</strong> {user.license_number}
                    </p>
                  )}
                  {user.experience_level && (
                    <p className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <strong>Niveau expérience :</strong> {user.experience_level}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong>{" "}
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Créé par :</strong> {user.createdBy}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Modifié le :</strong>{" "}
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié par :</strong> {user.updatedBy}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
