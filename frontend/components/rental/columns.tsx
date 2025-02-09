"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { getRentals, deleteRental } from "@/lib/apiExpress";

export type Rental = {
  id: string;
  reference: string;  
  rentalDate: string;
  price: number;
  motorcycleId: string;
  ownerId: string;
  ownerName: string; 
};

export const useRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRentals = async () => {
      try {
        const data = await getRentals();

        const rentalsFormatted: Rental[] = data.map((rental: any) => ({
          id: rental.id,
          reference: rental.reference?.reference || "Référence inconnue", 
          rentalDate: rental.rentalDate,
          price: rental.price,
          motorcycleId: rental.motorcycleId,
          ownerId: rental.ownerId,
          ownerName: rental.client?.username || "Utilisateur inconnu",
        }));

        setRentals(rentalsFormatted);
      } catch (error) {
        console.error("Erreur lors du chargement des locations:", error);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    loadRentals();
  }, []);

  return { rentals, setRentals, loading, error };
};

const formatDate = (date: string): string => {
  if (!date) return "Non renseigné";
  try {
    return format(new Date(date), "dd/MM/yyyy");
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return "Date invalide";
  }
};

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

export const columns: ColumnDef<Rental>[] = [
  {
    accessorKey: "reference",
    header: () => <div className="text-center">Référence</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.reference}</div>
    ),
  },
  {
    accessorKey: "rentalDate",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatDate(row.original.rentalDate)}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Prix</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.price.toFixed(2)} €</div>
    ),
  },
  {
    accessorKey: "motorcycleId",
    header: () => <div className="text-center">ID Moto</div>,
    cell: ({ row }) => <div className="text-center">{row.original.motorcycleId}</div>,
  },
  {
    accessorKey: "ownerName",
    header: () => <div className="text-center">Propriétaire</div>,
    cell: ({ row }) => <div className="text-center">{row.original.ownerName}</div>,
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
          onClick={() => deleteRentalById(row.original.id, table.options.meta?.setRentals)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
