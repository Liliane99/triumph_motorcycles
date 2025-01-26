"use client";

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
import { useEffect, useState } from "react";

type Client = {
  id: string;
  raisonSociale: string;
  email: string;
  phone: string;
  experience: string;
  motos?: Moto[];
  locations?: Moto[];
  conducteurs?: Conducteur[];
};

type Moto = {
  id: string;
  plaque: string;
  modele: string;
  annee: number;
  dernierKilometrage: number;
  image: string;
};

type Conducteur = {
  id: string;
  raisonSociale: string;
  experience: string;
  dateNaissance: string;
  moto: string; 
};

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const mockClient: Client = {
      id: params.id,
      raisonSociale: "Ines HADIDI",
      email: "ineshadidi@example.com",
      phone: "123456789",
      experience: "Avancé",
      motos: [
        {
          id: "1",
          plaque: "AA-123-BB",
          modele: "Yamaha MT-07",
          annee: 2020,
          dernierKilometrage: 15000,
          image: "/images/moto3.jpg",
        },
        {
          id: "2",
          plaque: "AA-123-BB",
          modele: "Yamaha MT-07",
          annee: 2020,
          dernierKilometrage: 15000,
          image: "/images/moto3.jpg",
        },
      ],
      locations: [
        {
          id: "2",
          plaque: "CC-345-DD",
          modele: "Kawasaki Z650",
          annee: 2018,
          dernierKilometrage: 20000,
          image: "/images/moto2.jpg",
        },
      ],
      conducteurs: [
        {
          id: "1",
          raisonSociale: "Hamid Amchich",
          experience: "Intermédiaire",
          dateNaissance: "1995-06-15",
          moto: "AA-123-BB",
        },
      ],
    };
    setClient(mockClient);
  }, [params.id]);

  if (!client) return <p>Chargement...</p>;

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
                  <BreadcrumbPage>{client.raisonSociale}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-4">
          <ClientDetails client={client} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
