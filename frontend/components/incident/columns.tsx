"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export type Incident = {
  incident_id: string;
  date: string;
  description: string;
  status: "créer" | "résolu";
  comment?: string;
  motorcycleId?: number;
};

export const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de l'incident <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{format(new Date(row.getValue("date")), "dd/MM/yyyy")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => (<div className="text-center">Description</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Statut <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "comment",
    header: () => (<div className="text-center">Commentaire</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("comment") || "-"}</div>,
  },
  {
    accessorKey: "motorcycleId",
    header: () => (<div className="text-center">Moto associée</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("motorcycleId") || "N/A"}</div>,
  },
  {
    id: "actions",
    header: () => (<div className="text-center">Actions</div>),
    cell: ({ row }) => {
      const incident = row.original;
      return (
        <div className="flex justify-center gap-2">
          <Link href={`/dashboard/incidents/${incident.incident_id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(incident.incident_id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Link href={`/dashboard/incidents/${incident.incident_id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const incidents: Incident[] = [
  {
    incident_id: "1",
    date: "2025-01-01",
    description: "Accident mineur sur route",
    status: "créer",
    comment: "Aucune blessure",
    motorcycleId: 101,
  },
  {
    incident_id: "2",
    date: "2025-01-15",
    description: "Panne mécanique",
    status: "résolu",
    comment: "Réparé en atelier",
    motorcycleId: 102,
  },
  {
    incident_id: "3",
    date: "2025-02-01",
    description: "Vol signalé",
    status: "créer",
    comment: "Enquête en cours",
    motorcycleId: 103,
  },
];
