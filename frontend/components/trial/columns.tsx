"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export type Trial = {
  user_id: number | string;
  motorcycle_id: number | string;
  start_date: string;
  end_date: string;
};

export const columns: ColumnDef<Trial>[] = [
  {
    accessorKey: "user_id",
    header: () => (<div className="text-center">Client</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("user_id")}</div>,
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de début <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{format(new Date(row.getValue("start_date")), "dd/MM/yyyy")}</div>
    ),
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de fin <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{format(new Date(row.getValue("end_date")), "dd/MM/yyyy")}</div>
    ),
  },
  {
    accessorKey: "motorcycle_id",
    header: () => (<div className="text-center">Moto associée</div>),
    cell: ({ row }) => <div className="text-center">{row.getValue("motorcycle_id")}</div>,
  },
  {
    id: "actions",
    header: () => (<div className="text-center">Actions</div>),
    cell: ({ row }) => {
      const trial = row.original;
      return (
        <div className="flex justify-center gap-2">
          <Link href={`/dashboard/trials/${trial.user_id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(trial.user_id, trial.motorcycle_id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Link href={`/dashboard/trials/${trial.user_id}/`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const trials: Trial[] = [
  {
    user_id: 1,
    motorcycle_id: 101,
    start_date: "2025-01-01",
    end_date: "2025-01-05",
  },
  {
    user_id: 2,
    motorcycle_id: 102,
    start_date: "2025-02-10",
    end_date: "2025-02-15",
  },
  {
    user_id: 3,
    motorcycle_id: 103,
    start_date: "2025-03-20",
    end_date: "2025-03-25",
  },
];