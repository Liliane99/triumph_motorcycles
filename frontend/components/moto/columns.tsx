"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export type Moto = {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  price: string;
  date: string;
  warranty: string;
  kilometer: number; 
  maintenanceInterval: number;
  client: string;
};

export const columns: ColumnDef<Moto>[] = [
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
    header: ({ }) => (<div className="text-center">Plaque dimmatriculation</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("licensePlate")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ }) =>(<div className="text-center">Prix (€)</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("price")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date dachat <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{format(new Date(row.getValue("date")), "dd/MM/yyyy")}</div>
    ),
  },
  {
    accessorKey: "warranty",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Garantie <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{format(new Date(row.getValue("warranty")), "dd/MM/yyyy")}</div>
    ),
  },
  {
    accessorKey: "kilometer",
    header: ({ }) => (<div className="text-center">Kilométrage (km)</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("kilometer")}</div>,
  },
  {
    accessorKey: "maintenanceInterval",
    header: ({ }) =>(<div className="text-center">Intervalle de maintenance (km)</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("maintenanceInterval")}</div>,
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
    header: ({ }) =>(<div className="text-center">Actions</div>),
    cell: ({ row }) => {
      const moto = row.original;
      return (
        <div className="flex justify-center gap-2">
          <Link href={`/dashboard/motos/${moto.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(moto.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Link href={`/dashboard/motos/${moto.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const motos: Moto[] = [
  {
    id: "1",
    model: "Bandit 650",
    brand: "Suzuki",
    licensePlate: "AX-840-XC",
    price: "4560",
    date: "2025-01-01",
    warranty: "2027-01-01",
    kilometer: 12000, 
    maintenanceInterval: 10000,
    client: "Liam Macquaire",
  },
  {
    id: "2",
    model: "MT-07",
    brand: "Yamaha",
    licensePlate: "BZ-123-YN",
    price: "5200",
    date: "2025-01-15",
    warranty: "2027-01-15",
    kilometer: 8000, 
    maintenanceInterval: 12000,
    client: "Emma Durand",
  },
  {
    id: "3",
    model: "CB650R",
    brand: "Honda",
    licensePlate: "CD-456-WQ",
    price: "6200",
    date: "2025-02-01",
    warranty: "2027-02-01",
    kilometer: 15000, 
    maintenanceInterval: 15000,
    client: "Noah Lefebvre",
  },
];