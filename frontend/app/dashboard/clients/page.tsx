"use client";

import { useEffect, useState } from "react";
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
import { DataTable } from "@/components/clients/data-table";
import { columns } from "@/components/clients/columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUsers, getUserById, User } from "@/lib/api";
import { toast } from "react-toastify";

export default function ClientsPage() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        const usersData = await getUsers();
        const clientUsers = usersData.filter((user) => user.role.value === "client");

        const userMap: Record<string, string> = {};

        await Promise.all(
          clientUsers.map(async (user) => {
            if (user.createdBy && !userMap[user.createdBy]) {
              const createdUser = await getUserById(user.createdBy);
              userMap[user.createdBy] = createdUser?.username.value || "Inconnu";
            }
            if (user.updatedBy && !userMap[user.updatedBy]) {
              const updatedUser = await getUserById(user.updatedBy);
              userMap[user.updatedBy] = updatedUser?.username.value || "Inconnu";
            }
          })
        );

        const formattedClients: User[] = clientUsers.map((user) => ({
          id: user.id,
          username: user.username.value,
          email: user.email.value,
          role: user.role.value,
          createdByName: user.createdBy ? userMap[user.createdBy] || "Inconnu" : "Inconnu",
          updatedByName: user.updatedBy ? userMap[user.updatedBy] || "Inconnu" : "Inconnu",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          phoneNumber: user.phoneNumber?.value || undefined,
          licenseNumber: user.licenseNumber?.value || undefined,
          experienceLevel: user.experienceLevel?.value || undefined,
        }));

        setClients(formattedClients);
      } catch {
        toast.error("Erreur lors de la récupération des clients.");
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

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
                  <BreadcrumbPage>Clients</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Total Clients</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{clients.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            {loading ? (
              <p className="text-center text-lg font-semibold">Chargement des clients...</p>
            ) : (
              <DataTable columns={columns} data={clients} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
