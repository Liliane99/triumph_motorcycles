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
import { EditUserForm } from "@/components/users/edit-user-form";
import { getUserById, updateUser, User } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!authUser) {
        toast.error("Vous devez être connecté.");
        router.push("/login");
        return;
      }

      try {
        const userData = await getUserById(authUser.userId);
        if (!userData) {
          toast.error("Impossible de charger le profil.");
          return;
        }

        const formattedUser: User = {
          id: userData.id,
          username: userData.username.value,
          email: userData.email.value,
          role: userData.role.value,
          createdByName: "N/A",
          updatedByName: "N/A",
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          phoneNumber: userData.phoneNumber?.value || "",
          licenseNumber: userData.licenseNumber?.value || "",
          experienceLevel: userData.experienceLevel?.value || "",
        };

        setUser(formattedUser);
        setLoading(false);
      } catch {
        toast.error("Erreur lors du chargement du profil.");
      }
    }

    fetchUserProfile();
  }, [authUser, router]);

  const handleSubmit = async (values: Partial<User>) => {
    if (!user) return;

    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }

    try {
      await updateUser(user.id, values, token);
      toast.success("Profil mis à jour avec succès !");
    } catch {
      toast.error("Erreur lors de la mise à jour du profil.");
    }
  };

  if (loading) return <p className="text-center p-6 text-lg">Chargement...</p>;

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
                  <BreadcrumbPage>Profil</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier le profil</h1>
          {user && <EditUserForm onSubmit={handleSubmit} defaultValues={user} disableRole />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
