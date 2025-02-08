"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { getUserById, User } from "@/lib/api";
import { toast } from "react-toastify";
import { UserIcon, Mail, Phone, Calendar, Shield } from "lucide-react";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [createdByName, setCreatedByName] = useState<string>("Inconnu");
  const [updatedByName, setUpdatedByName] = useState<string>("Inconnu");

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const userData = await getUserById(params.id);
        if (!userData) {
          toast.error("Utilisateur introuvable.");
          router.push("/dashboard/users");
          return;
        }

        const formattedUser: User = {
          id: userData.id,
          username: userData.username.value,
          email: userData.email.value,
          role: userData.role.value,
          createdByName: "Inconnu",
          updatedByName: "Inconnu",
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          phoneNumber: userData.phoneNumber?.value || undefined,
          licenseNumber: userData.licenseNumber?.value || undefined,
          experienceLevel: userData.experienceLevel?.value || undefined,
        };

        setUser(formattedUser);

        if (userData.createdBy) {
          const createdUser = await getUserById(userData.createdBy);
          setCreatedByName(createdUser?.username?.value || "Inconnu");
        }
        if (userData.updatedBy) {
          const updatedUser = await getUserById(userData.updatedBy);
          setUpdatedByName(updatedUser?.username?.value || "Inconnu");
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des informations.");
        router.push("/dashboard/users");
      }
    }
    fetchUserDetails();
  }, [params.id, router]);

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
                  <BreadcrumbPage>
                    {user ? user.username : "Chargement..."}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-6">
          <h1 className="text-3xl font-bold">
            {user ? `Détails de ${user.username}` : "Chargement..."}
          </h1>

          {user && (
            <Card>
              <CardHeader className="flex flex-col items-center">
                <UserIcon className="h-16 w-16 rounded-full bg-muted p-3" />
                <CardTitle className="mt-4 text-2xl font-bold">{user.username}</CardTitle>
                <Badge className={`mt-2 ${roleColors[user.role]}`}>{user.role}</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="flex items-center gap-2 text-lg">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <strong>Email :</strong> {user.email}
                    </p>
                    {user.phoneNumber && (
                      <p className="flex items-center gap-2 text-lg">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <strong>Téléphone :</strong> {user.phoneNumber}
                      </p>
                    )}
                    {user.licenseNumber && (
                      <p className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <strong>Plaque immatriculation :</strong> {user.licenseNumber}
                      </p>
                    )}
                    {user.experienceLevel && (
                      <p className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <strong>Niveau expérience :</strong> {user.experienceLevel}
                      </p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <p className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <strong>Créé le :</strong> {new Date(user.createdAt).toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Créé par :</strong> {createdByName}
                    </p>
                    <p className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <strong>Modifié le :</strong> {new Date(user.updatedAt).toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifié par :</strong> {updatedByName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
