"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/users/data-table";
import { columns } from "../../../components/users/columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUsers, getUserById, User } from "@/lib/api";
import { toast } from "react-toastify";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [adminCount, setAdminCount] = useState<number>(0);
  const [managerCount, setManagerCount] = useState<number>(0);
  const [clientCount, setClientCount] = useState<number>(0);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        const userMap: Record<string, string> = {};

        await Promise.all(
          data.map(async (user) => {
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

        const formattedUsers: User[] = data.map((user) => ({
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

        setUsers(formattedUsers);
        setAdminCount(formattedUsers.filter((user) => user.role === "admin").length);
        setManagerCount(formattedUsers.filter((user) => user.role === "manager").length);
        setClientCount(formattedUsers.filter((user) => user.role === "client").length);
      } catch {
        toast.error("Erreur lors de la récupération des utilisateurs.");
      }
    }
    fetchUsers();
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
                  <BreadcrumbPage>Utilisateurs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Admins</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{adminCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Managers</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{managerCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Clients</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{clientCount}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <DataTable columns={columns} data={users} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
