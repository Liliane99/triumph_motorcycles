"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

export type Client = {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  licenseNumber?: string;
  experienceLevel?: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nom <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Téléphone",
  },
  {
    accessorKey: "licenseNumber",
    header: "Numéro de permis",
  },
  {
    accessorKey: "experienceLevel",
    header: "Niveau d'expérience",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/clients/${client.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
