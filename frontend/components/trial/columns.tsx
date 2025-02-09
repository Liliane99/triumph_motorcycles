"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import Link from "next/link";
import { EnrichedTrial } from "@/lib/api";

export const columns: ColumnDef<EnrichedTrial>[] = [
  {
    accessorKey: "username",
    header: () => <div className="text-center">Client</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("username")}</div>,
  },
  {
    accessorKey: "motorcycleBrand",
    header: () => <div className="text-center">Moto associée</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("motorcycleBrand")}</div>,
  },
  {
    accessorKey: "startDate",
    header: "Date de début",
    cell: ({ row }) => {
      const dateValue = row.getValue("startDate");
      const dateStr = typeof dateValue === "string" ? dateValue : dateValue?.value;

      if (!dateStr) return <div className="text-center">Non spécifiée</div>;
      const date = parseISO(dateStr);
      return isValid(date) ? <div className="text-center">{format(date, "dd/MM/yyyy HH:mm")}</div> : <div className="text-center">Date invalide</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: "Date de fin",
    cell: ({ row }) => {
      const dateValue = row.getValue("endDate");
      const dateStr = typeof dateValue === "string" ? dateValue : dateValue?.value;

      if (!dateStr) return <div className="text-center">Non spécifiée</div>;
      const date = parseISO(dateStr);
      return isValid(date) ? <div className="text-center">{format(date, "dd/MM/yyyy HH:mm")}</div> : <div className="text-center">Date invalide</div>;
    },
  },
  {
    accessorKey: "createdByName",
    header: "Créé par",
    cell: ({ row }) => <div className="text-center">{row.getValue("createdByName")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => {
      const dateStr = row.getValue<string>("createdAt");
      return dateStr ? <div className="text-center">{new Date(dateStr).toLocaleString()}</div> : <div className="text-center">Non spécifiée</div>;
    },
  },
  {
    accessorKey: "updatedByName",
    header: "Modifié par",
    cell: ({ row }) => <div className="text-center">{row.getValue("updatedByName") || "—"}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
    cell: ({ row }) => {
      const dateStr = row.getValue<string>("updatedAt");
      return dateStr ? <div className="text-center">{new Date(dateStr).toLocaleString()}</div> : <div className="text-center">Non spécifiée</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const trial = row.original;
      return (
        <div className="flex justify-center gap-2">
          <Link href={`/dashboard/trials/${trial.userId}/${trial.motorcycleId}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => console.log("Supprimer", trial.userId, trial.motorcycleId)}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Link href={`/dashboard/trials/${trial.userId}/${trial.motorcycleId}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
