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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  Settings,
  ClipboardList,
  Truck,
  DollarSign,
  FileText,
} from "lucide-react";

type Entretien = {
  id: string;
  reference: string;
  date: string;
  prix: number;
  technicien: string;
  plaque: string;
  client: string;
  mileage: string;
  recommendations: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  parts: Part[];
};

type Part = {
  name: string;
  reference: string;
  quantity: number;
  unitPrice: number;
};

export default function EntretienDetailsPage({ params }: { params: { id: string } }) {
  const [entretien, setEntretien] = useState<Entretien | null>(null);

  useEffect(() => {
    const mockEntretien: Entretien = {
      id: params.id,
      reference: "ENT-001",
      date: "2025-01-01",
      prix: 150,
      technicien: "Chabane",
      plaque: "AA-123-BB",
      client: "Liliane",
      mileage: "15,000 km",
      recommendations: "Vérifier les freins avant après 1,000 km.",
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-05T12:00:00Z",
      updatedBy: "Manager",
      parts: [
        {
          name: "Filtre à huile",
          reference: "FO-1234",
          quantity: 1,
          unitPrice: 25,
        },
        {
          name: "Huile moteur",
          reference: "HM-5678",
          quantity: 2,
          unitPrice: 15,
        },
        {
          name: "Plaquettes de frein",
          reference: "PB-9012",
          quantity: 1,
          unitPrice: 45,
        },
      ],
    };
    setEntretien(mockEntretien);
  }, [params.id]);

  if (!entretien) return <p>Chargement...</p>;

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
                  <BreadcrumbLink href="/dashboard/maintenance">
                    Entretiens
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{entretien.reference}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-8">
          <h1 className="text-3xl font-bold">Détails de lentretien</h1>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <ClipboardList className="h-16 w-16 rounded-full bg-muted p-3" />
              <CardTitle className="mt-4 text-2xl font-bold">
                Référence : {entretien.reference}
              </CardTitle>
              <Badge className="mt-2 bg-blue-500 text-white">
                {new Date(entretien.date).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <strong>Client :</strong> {entretien.client}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <strong>Plaque :</strong> {entretien.plaque}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <strong>Technicien :</strong> {entretien.technicien}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <strong>Prix :</strong> {entretien.prix} €
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <strong>Recommandation:</strong> {entretien.recommendations}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <strong>Créé le :</strong>{" "}
                    {new Date(entretien.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <strong>Modifié le :</strong>{" "}
                    {new Date(entretien.updatedAt).toLocaleString()}
                  </p>
                  {entretien.updatedBy && (
                    <p className="flex items-center gap-2 text-lg">
                      <strong>Modifié par :</strong> {entretien.updatedBy}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pièces utilisées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix unitaire (€)</TableHead>
                      <TableHead>Prix total (€)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entretien.parts.map((part, index) => (
                      <TableRow key={index}>
                        <TableCell>{part.name}</TableCell>
                        <TableCell>{part.reference}</TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell>{part.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          {(part.unitPrice * part.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
