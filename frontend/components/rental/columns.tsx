"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export type Location = {
  id: string;
  reference: string;
  brand: string;
  model: string;
  licensePlate: string;
  date: string;
  client: string;
};

export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Référence <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("reference")}</div>,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Marque <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("brand")}</div>,
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modèle <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("model")}</div>,
  },
  {
    accessorKey: "licensePlate",
    header: () => (<div className="text-center">Plaque dimmatriculation</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("licensePlate")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de location <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{format(new Date(row.getValue("date")), "dd/MM/yyyy")}</div>
    ),
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("client")}</div>,
  },
  {
    id: "actions",
    header: () => (<div className="text-center">Actions</div>),
    cell: ({ row }) => {
      const location = row.original;
      return (
        <div className="flex justify-center gap-2">
          <Link href={`/dashboard/rental/${location.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(location.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Link href={`/dashboard/rental/${location.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const locations: Location[] = [
  {
    id: "1",
    reference: "LOC001",
    brand: "Suzuki",
    model: "Bandit 650",
    licensePlate: "AX-840-XC",
    date: "2025-01-01",
    client: "Liam Macquaire",
  },
  {
    id: "2",
    reference: "LOC002",
    brand: "Yamaha",
    model: "MT-07",
    licensePlate: "BZ-123-YN",
    date: "2025-01-15",
    client: "Emma Durand",
  },
  {
    id: "3",
    reference: "LOC003",
    brand: "Honda",
    model: "CB650R",
    licensePlate: "CD-456-WQ",
    date: "2025-02-01",
    client: "Noah Lefebvre",
  },
];
