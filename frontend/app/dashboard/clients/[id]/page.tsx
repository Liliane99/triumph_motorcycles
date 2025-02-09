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
import { ClientDetails } from "@/components/clients/client-details";
import { getUserById, User } from "@/lib/api";
import { toast } from "react-toastify";

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<User | null>(null);
  const [createdByName, setCreatedByName] = useState<string>("Inconnu");
  const [updatedByName, setUpdatedByName] = useState<string>("Inconnu");

  useEffect(() => {
    async function fetchClientDetails() {
      try {
        const clientData = await getUserById(params.id);
        if (!clientData || clientData.role.value !== "client") {
          toast.error("Client introuvable.");
          router.push("/dashboard/clients");
          return;
        }

        const formattedClient: User = {
          id: clientData.id,
          username: clientData.username.value,
          email: clientData.email.value,
          role: clientData.role.value,
          createdByName: "Inconnu",
          updatedByName: "Inconnu",
          createdAt: clientData.createdAt,
          updatedAt: clientData.updatedAt,
          phoneNumber: clientData.phoneNumber?.value || undefined,
          licenseNumber: clientData.licenseNumber?.value || undefined,
          experienceLevel: clientData.experienceLevel?.value || undefined,
        };

        setClient(formattedClient);

        if (clientData.createdBy) {
          const createdUser = await getUserById(clientData.createdBy);
          setCreatedByName(createdUser?.username?.value || "Inconnu");
        }
        if (clientData.updatedBy) {
          const updatedUser = await getUserById(clientData.updatedBy);
          setUpdatedByName(updatedUser?.username?.value || "Inconnu");
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des informations.");
        router.push("/dashboard/clients");
      }
    }
    fetchClientDetails();
  }, [params.id, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4 mx-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/clients">Clients</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{client ? client.username : "Chargement..."}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-4">
          {client ? (
            <ClientDetails client={client} createdByName={createdByName} updatedByName={updatedByName} />
          ) : (
            <p className="text-center text-lg font-semibold">Chargement des informations...</p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
