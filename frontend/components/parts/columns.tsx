"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Part } from "@/lib/api"; 

export const columns: ColumnDef<Part>[] = [
  {
    accessorKey: "reference",
    header: "Référence",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "quantityInStock",
    header: "Stock",
  },
  {
    accessorKey: "partThreshold",
    header: "Seuil d'alerte",
  },
  {
    accessorKey: "unitPrice",
    header: "Prix unitaire (€)",
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
    cell: ({ row }) => <span>{row.getValue("createdAt")}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
    cell: ({ row }) => <span>{row.getValue("updatedAt")}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const part = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/parts/${part.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button variant="ghost" size="sm" onClick={() => console.log("Supprimer :", part.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>

          <Link href={`/dashboard/parts/${part.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
