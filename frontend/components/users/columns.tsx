"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";

export type User = {
  id: string;
  raisonSociale: string;
  email: string;
  role: "admin" | "manager" | "client";
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as User["role"];
      const roleColors: Record<User["role"], string> = {
        admin: "bg-red-500 text-white",
        manager: "bg-yellow-500 text-white",
        client: "bg-blue-500 text-white",
      };
      return <Badge className={roleColors[role]}>{role}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Créé le <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <span>{new Date(row.getValue("createdAt")).toLocaleString()}</span>,
  },
  {
    accessorKey: "createdBy",
    header: "Créé par",
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
    cell: ({ row }) => <span>{new Date(row.getValue("updatedAt")).toLocaleString()}</span>,
  },
  {
    accessorKey: "updatedBy",
    header: "Modifié par",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => console.log("Modifier :", user.id)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => console.log("Supprimer :", user.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => console.log("Détails :", user.id)}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];

export const users: User[] = [
  {
    id: "1",
    raisonSociale: "Liliane MEZANI",
    email: "usera@example.com",
    role: "admin",
    createdAt: "2025-01-01T10:00:00Z",
    createdBy: "System",
    updatedAt: "2025-01-05T12:00:00Z",
    updatedBy: "Admin",
  },
  {
    id: "2",
    raisonSociale: "Cheick LANIKPEKOUN",
    email: "userb@example.com",
    role: "manager",
    createdAt: "2025-01-02T11:00:00Z",
    createdBy: "System",
    updatedAt: "2025-01-06T13:00:00Z",
    updatedBy: "Manager",
  },
  {
    id: "3",
    raisonSociale: "Ines HADIDI",
    email: "userc@example.com",
    role: "client",
    createdAt: "2025-01-03T09:30:00Z",
    createdBy: "System",
    updatedAt: "2025-01-07T14:30:00Z",
    updatedBy: "Client",
  },
];
