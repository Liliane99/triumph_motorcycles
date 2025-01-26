"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export type Order = {
  id: string;
  reference: string;
  orderDate: string;
  deliveryDate: string;
  manager: string;
  totalPrice: number;
};

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: "orderDate",
    header: "Date de commande",
    cell: ({ row }) =>
      format(new Date(row.getValue<string>("orderDate")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "deliveryDate",
    header: "Date de livraison",
    cell: ({ row }) =>
      format(new Date(row.getValue<string>("deliveryDate")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "manager",
    header: "Manager",
  },
  {
    accessorKey: "totalPrice",
    header: "Prix Total (€)",
    cell: ({ row }) => {
      const value = row.getValue<number>("totalPrice");
      return `${value.toFixed(2)} €`;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/orders/${order.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>

          <Link href={`/dashboard/orders/${order.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Supprimer :", order.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];

export const orders: Order[] = [
  {
    id: "1",
    reference: "CMD-001",
    orderDate: "2025-01-01",
    deliveryDate: "2025-01-05",
    manager: "Manager A",
    totalPrice: 300,
  },
  {
    id: "2",
    reference: "CMD-002",
    orderDate: "2025-01-10",
    deliveryDate: "2025-01-15",
    manager: "Manager B",
    totalPrice: 500,
  },
  {
    id: "3",
    reference: "CMD-003",
    orderDate: "2025-01-20",
    deliveryDate: "2025-01-25",
    manager: "Manager C",
    totalPrice: 450,
  },
];
