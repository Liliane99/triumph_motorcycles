"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Incident } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: "reference",
    header: "Référence",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <div className="max-w-[300px] truncate">{description || "Pas de description"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as "opened" | "resolved";
      return (
        <Badge variant={status === "opened" ? "destructive" : "success"}>
          {status === "opened" ? "En cours" : "Résolu"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "motorcycleLicensePlate",
    header: "Moto",
  },
  {
    accessorKey: "createdByName",
    header: "Créé par",
  },
  {
    accessorKey: "updatedByName",
    header: "Modifié par",
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleString("fr-FR");
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return date.toLocaleString("fr-FR");
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const incident = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/incidents/${incident.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button variant="ghost" size="sm" onClick={() => console.log("Supprimer :", incident.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>

          <Link href={`/dashboard/incidents/${incident.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];