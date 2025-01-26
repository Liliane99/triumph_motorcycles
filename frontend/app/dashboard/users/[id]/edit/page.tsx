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
import { AddUserForm } from "@/components/users/add-user-form";
import { useEffect, useState } from "react";

type User = {
  id: string;
  user_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: "manager" | "client" | "admin";
  license_number?: string;
  experience_level?: string;
};

type AddUserFormValues = Omit<User, "id">;

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const mockUser: User = {
      id: params.id,
      user_name: "Liliane MEZANI",
      email: "usera@example.com",
      phone_number: "0612345678",
      password: "",
      role: "admin",
      license_number: "AA-123-BB",
      experience_level: "Intermédiaire",
    };
    setUser(mockUser);
  }, [params.id]);

  if (!user) return <p>Chargement...</p>;

  const handleSubmit = (values: AddUserFormValues) => {
    const updatedUser: User = { ...values, id: user.id };
    console.log("Utilisateur mis à jour :", updatedUser);
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
                  <BreadcrumbPage>{user.user_name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier utilisateur</h1>
          <AddUserForm onSubmit={handleSubmit} defaultValues={user} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
