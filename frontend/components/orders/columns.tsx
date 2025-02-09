import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { Order } from "@/lib/api"; 

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Référence <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "orderDate",
    header: "Date de commande",
    cell: ({ row }) => {
      const dateObj = row.getValue<{ value: string }>("orderDate");
      const dateStr = dateObj?.value;

      if (!dateStr) return "Non spécifiée";
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, "dd/MM/yyyy HH:mm") : "Date invalide";
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "Date de livraison",
    cell: ({ row }) => {
      const dateObj = row.getValue<{ value: string }>("deliveryDate");
      const dateStr = dateObj?.value;

      if (!dateStr) return "Non spécifiée";
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, "dd/MM/yyyy HH:mm") : "Date invalide";
    },
  },
  {
    accessorKey: "createdByName",
    header: "Créé par",
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => {
      const dateStr = row.getValue<string>("createdAt");

      if (!dateStr) return "Non spécifiée";
      return new Date(dateStr).toLocaleString();
    },
  },
  {
    accessorKey: "updatedByName",
    header: "Modifié par",
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
    cell: ({ row }) => {
      const dateStr = row.getValue<string>("updatedAt");

      if (!dateStr) return "Non spécifiée";
      return new Date(dateStr).toLocaleString();
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

          <Button variant="ghost" size="sm" onClick={() => console.log("Supprimer :", order.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];