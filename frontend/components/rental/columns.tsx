"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { getRentals, deleteRental } from "@/lib/apiExpress";
import { getUserById } from "@/lib/api";

// Types
export type User = {
  user_id: string;
  user_name: string;
  role: string;
};

export type Rental = {
  id: string;
  reference: string;
  rentalDate: string;
  price: number;
  motorcycleId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  ownerName?: string;
};

// Custom hook for fetching rentals
export const useRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRentals = async () => {
      try {
        const data = await getRentals();

        const rentalsFormatted: Rental[] = await Promise.all(
          data.map(async (rental: any) => {
            const user = await getUserById(rental.ownerId);
            const ownerName = user?.user_name || "Utilisateur inconnu";

            return {
              id: rental.id,
              reference: rental.reference,
              rentalDate: rental.rentalDate,
              price: rental.price,
              motorcycleId: rental.motorcycleId,
              ownerId: rental.ownerId,
              createdAt: rental.createdAt,
              updatedAt: rental.updatedAt,
              ownerName: ownerName
            };
          })
        );

        setRentals(rentalsFormatted);
      } catch (error) {
        console.error("Erreur lors du chargement des locations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRentals();
  }, []);

  return { rentals, setRentals, loading };
};

// Helper function to format date
const formatDate = (date: string): string => {
  if (!date) return "Non renseigné";
  try {
    return format(new Date(date), "dd/MM/yyyy");
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return "Date invalide";
  }
};

// Function to delete a rental
const deleteRentalById = async (id: string, setRentals: React.Dispatch<React.SetStateAction<Rental[]>>) => {
  if (confirm("Voulez-vous vraiment supprimer cette location ?")) {
    try {
      const token = localStorage.getItem("token") || "";
      await deleteRental(id, token);

      setRentals((currentRentals) =>
        currentRentals.filter((rental) => rental.id !== id)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de la location:", error);
    }
  }
};

// Columns definition for rental data table
export const columns: ColumnDef<Rental>[] = [
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <div className="text-center">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Référence <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("reference") as string}
      </div>
    ),
  },
  {
    accessorKey: "rentalDate",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatDate(row.getValue("rentalDate") as string)}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Prix</div>,
    cell: ({ row }) => (
      <div className="text-center">{(row.getValue("price") as number).toFixed(2)} €</div>
    ),
  },
  {
    accessorKey: "motorcycleId",
    header: () => <div className="text-center">ID Moto</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("motorcycleId") as string}</div>,
  },
  {
    accessorKey: "ownerName",
    header: () => <div className="text-center">Propriétaire</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("ownerName") as string}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row, table }) => (
      <div className="text-center">
        <Link href={`/dashboard/rentals/edit/${row.original.id}`}>
          <Button variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => deleteRentalById(row.original.id, table.options.meta?.setRentals)
          }
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
