"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export type Part = {
  id: string;
  reference: string;
  type: string;
  name: string;
  quantityInStock: number;
  partThreshold: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

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
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => <span>{new Date(row.getValue("createdAt")).toLocaleString()}</span>,
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

export const mockParts: Part[] = [
  {
    id: "1",
    reference: "P12345",
    type: "brake",
    name: "Disque de frein",
    quantityInStock: 10,
    partThreshold: 5,
    unitPrice: 50.99,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-10T12:00:00Z",
    createdBy: "Admin",
    updatedBy: "Manager",
  },
  {
    id: "2",
    reference: "P67890",
    type: "tire",
    name: "Pneu avant",
    quantityInStock: 20,
    partThreshold: 8,
    unitPrice: 75.99,
    createdAt: "2025-01-02T11:00:00Z",
    updatedAt: "2025-01-12T14:00:00Z",
    createdBy: "Admin",
    updatedBy: "Manager",
  },
];
