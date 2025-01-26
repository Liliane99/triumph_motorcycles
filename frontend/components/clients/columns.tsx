"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export type Client = {
  id: string;
  raisonSociale: string;
  email: string;
  phone: string;
  plaque: string;
  experience: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "raisonSociale",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Raison Sociale <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "plaque",
    header: "Plaque d'immatriculation",
  },
  {
    accessorKey: "experience",
    header: "Niveau d'expérience",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const client = row.original; 
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => console.log("Modifier :", client.id)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => console.log("Supprimer :", client.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Link href={`/dashboard/clients/${client.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

export const clients: Client[] = [
  { id: "1", raisonSociale: "Ines HADIDI", email: "ineshadidi@example.com", phone: "123456789", plaque: "AA-123-BB", experience: "Avancé" },
  { id: "2", raisonSociale: "Liliane MEZANI", email: "lilianemezani@example.com", phone: "987654321", plaque: "BB-234-CC", experience: "Débutant" },
  { id: "3", raisonSociale: "Cheick LANIKPEKOUN", email: "cheicklanikpekoun@example.com", phone: "456123789", plaque: "CC-345-DD", experience: "Intermédiaire" },
  { id: "4", raisonSociale: "Zoe le test", email: "zoeletest@example.com", phone: "321654987", plaque: "DD-456-EE", experience: "Avancé" },
  { id: "5", raisonSociale: "Testings", email: "testings@example.com", phone: "789123456", plaque: "EE-567-FF", experience: "" },
  { id: "6", raisonSociale: "Tim", email: "tim@example.com", phone: "987321654", plaque: "FF-678-GG", experience: "Débutant" },
  { id: "7", raisonSociale: "Client G", email: "clientG@example.com", phone: "654789123", plaque: "GG-789-HH", experience: "Intermédiaire" },
  { id: "8", raisonSociale: "Client H", email: "clientH@example.com", phone: "123789456", plaque: "", experience: "Avancé" },
  { id: "9", raisonSociale: "Client I", email: "clientI@example.com", phone: "456987321", plaque: "HH-890-II", experience: "" },
  { id: "10", raisonSociale: "Client J", email: "clientJ@example.com", phone: "321123456", plaque: "II-901-JJ", experience: "Débutant" },
  { id: "11", raisonSociale: "Client K", email: "clientK@example.com", phone: "789321654", plaque: "JJ-012-KK", experience: "Avancé" },
  { id: "12", raisonSociale: "Client L", email: "clientL@example.com", phone: "987654321", plaque: "KK-123-LL", experience: "Intermédiaire" },
  { id: "13", raisonSociale: "Client M", email: "clientM@example.com", phone: "456123987", plaque: "", experience: "Débutant" },
  { id: "14", raisonSociale: "Client N", email: "clientN@example.com", phone: "321987654", plaque: "LL-234-MM", experience: "Avancé" },
  { id: "15", raisonSociale: "Client O", email: "clientO@example.com", phone: "123654789", plaque: "MM-345-NN", experience: "" },
];
