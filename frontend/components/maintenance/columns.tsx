import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { Maintenance } from "@/lib/api";

export const columns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Référence <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const dateValue = row.getValue<string>("date");
      if (!dateValue) return "Non spécifiée";
      const date = parseISO(dateValue);
      return isValid(date) ? format(date, "dd/MM/yyyy HH:mm") : "Date invalide";
    },
  },
  {
    accessorKey: "motorcycleBrand",
    header: "Moto",
    cell: ({ row }) => row.getValue("motorcycleBrand") || "Non spécifiée",
  },
  {
    accessorKey: "recommendation",
    header: "Recommandation",
    cell: ({ row }) => row.getValue("recommendation") || "Non spécifiée",
  },
  {
    accessorKey: "createdByName",
    header: "Créé par",
    cell: ({ row }) => row.getValue("createdByName") || "Inconnu",
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => {
      const dateStr = row.getValue<string>("createdAt");
      return dateStr || "Non spécifiée";
    },
  },
  {
    accessorKey: "updatedByName",
    header: "Modifié par",
    cell: ({ row }) => row.getValue("updatedByName") || "—",
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
    cell: ({ row }) => {
      const dateStr = row.getValue<string>("updatedAt");
      return dateStr || "Non spécifiée";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const maintenance = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/maintenance/${maintenance.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>

          <Link href={`/dashboard/maintenance/${maintenance.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button variant="ghost" size="sm" onClick={() => console.log("Supprimer :", maintenance.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];