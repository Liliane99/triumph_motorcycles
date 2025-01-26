"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export type Entretien = {
  id: string;
  reference: string;
  date: string;
  prix: number;
  technicien: string;
  plaque: string;
  client: string;
};

export const columns: ColumnDef<Entretien>[] = [
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Référence <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.getValue("date")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "prix",
    header: "Prix (€)",
  },
  {
    accessorKey: "technicien",
    header: "Technicien",
  },
  {
    accessorKey: "plaque",
    header: "Plaque d'immatriculation",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const entretien = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/maintenance/${entretien.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(entretien.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Link href={`/dashboard/maintenance/${entretien.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      );
    },
  },
];

export const entretiens: Entretien[] = [
  {
    id: "1",
    reference: "ENT-001",
    date: "2025-01-01",
    prix: 150,
    technicien: "Chabane",
    plaque: "AA-123-BB",
    client: "Liliane",
  },
  {
    id: "2",
    reference: "ENT-002",
    date: "2025-01-05",
    prix: 200,
    technicien: "Mokrane",
    plaque: "CC-456-DD",
    client: "Cheick",
  },
  {
    id: "3",
    reference: "ENT-003",
    date: "2025-01-10",
    prix: 120,
    technicien: "Hamid",
    plaque: "EE-789-FF",
    client: "Ines",
  },
];
