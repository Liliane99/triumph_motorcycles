"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/api";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Nom",
    cell: ({ row }) => <span>{row.getValue("username")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role = row.getValue("role") as User["role"];
      const roleColors: Record<User["role"], string> = {
        admin: "bg-red-500 text-white",
        manager: "bg-yellow-500 text-white",
        client: "bg-blue-500 text-white",
      };
      return <Badge className={roleColors[role] || "bg-gray-500 text-white"}>{role}</Badge>;
    },
  },
  {
    accessorKey: "createdByName",
    header: "Créé par",
    cell: ({ row }) => <span>{row.getValue("createdByName")}</span>,
  },
  {
    accessorKey: "updatedByName",
    header: "Modifié par",
    cell: ({ row }) => <span>{row.getValue("updatedByName")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => <span>{new Date(row.getValue("createdAt")).toLocaleString()}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
    cell: ({ row }) => <span>{new Date(row.getValue("updatedAt")).toLocaleString()}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/users/${user.id}/edit`}>
            <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
          </Link>
          <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4" /></Button>
          <Link href={`/dashboard/users/${user.id}`}>
            <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
          </Link>
        </div>
      );
    },
  },
];
