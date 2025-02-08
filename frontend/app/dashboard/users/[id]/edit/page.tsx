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

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
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
          phoneNumber: userData.phoneNumber?.value || "",
          licenseNumber: userData.licenseNumber?.value || "",
          experienceLevel: userData.experienceLevel?.value || "",
        };

        setUser(formattedUser);
        setLoading(false);
      } catch {
        toast.error("Erreur lors du chargement de l'utilisateur.");
        router.push("/dashboard/users");
      }
    }
    fetchUser();
  }, [params.id, router]);

  const handleSubmit = async (values: Partial<User>) => {
    if (!user) return;

    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }

    try {
      await updateUser(user.id, values, token);
      toast.success("Utilisateur mis à jour avec succès !");
      router.push("/dashboard/users");
    } catch {
      toast.error("Erreur lors de la mise à jour de l'utilisateur.");
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
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/users">Utilisateurs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{user ? user.username : "Chargement..."}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier l'utilisateur</h1>
          {user && <EditUserForm onSubmit={handleSubmit} defaultValues={user} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
