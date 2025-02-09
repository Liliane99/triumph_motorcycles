"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { getMotorcycles, deleteMotorcycle } from "@/lib/apiExpress";
import { getUserById } from "@/lib/api";

// Types
export type User = {
  user_id: string;
  user_name: string;
  role: string;
};

export type Moto = {
  id: string;
  brand: { value: string } | string;
  model: { value: string } | string;
  licensePlate: { value: string } | string;
  purchaseDate: { value: string } | string;
  warrantyDate: { value: string } | string;
  kilometers: { value: number } | number;
  maintenanceInterval: { value: number } | number;
  ownerId: string;
  ownerName: { value: string } | string;
  ownerRole?: string;
};


export const useMotos = () => {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerMotos = async () => {
      try {
        const data = await getMotorcycles();
        
        const motosFormatees: Moto[] = await Promise.all(
          data.map(async (moto: any) => {
            const utilisateur = await getUserById(moto.ownerId);
            
            
            const role = utilisateur?.role?.value; 
            
            
            const nomAffiche = role === 'admin' || role === 'manager' 
              ? "Triumph Motorcycles"
              : utilisateur?.username || "Utilisateur inconnu";
            
            return {
              id: moto.id,
              brand: moto.brand,
              model: moto.model,
              licensePlate: moto.licensePlate,
              purchaseDate: moto.purchaseDate || "",
              warrantyDate: moto.warrantyDate || "",
              kilometers: moto.kilometers,
              maintenanceInterval: moto.maintenanceInterval,
              ownerId: moto.ownerId,
              ownerName: nomAffiche,
              ownerRole: utilisateur?.role
            };
          })
        );

        setMotos(motosFormatees);
      } catch (error) {
        console.error("Erreur lors du chargement des motos:", error);
      } finally {
        setLoading(false);
      }
    };

    chargerMotos();
  }, []);

  return { motos, setMotos, loading };
};


const extraireValeur = (valeur: any): string => {
  if (valeur === null || valeur === undefined) return "Non renseigné";
  if (typeof valeur === "object" && "value" in valeur) {
    return valeur.value?.toString() || "Non renseigné";
  }
  return String(valeur);
};


const formaterDate = (date: any): string => {
  if (!date) return "Non renseigné";
  try {
    const valeurDate = typeof date === "object" && "value" in date ? date.value : date;
    return format(new Date(valeurDate), "dd/MM/yyyy");
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return "Date invalide";
  }
};


const supprimerMoto = async (id: string, setMotos: React.Dispatch<React.SetStateAction<Moto[]>>) => {
  if (confirm("Voulez-vous vraiment supprimer cette moto ?")) {
    try {
      const token = localStorage.getItem("token") || "";
      await deleteMotorcycle(id, token);
      
      setMotos((motosActuelles) => 
        motosActuelles.filter((moto) => moto.id !== id)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }
};


export const columns: ColumnDef<Moto>[] = [
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <div className="text-center">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Marque <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {extraireValeur(row.getValue("brand"))}
      </div>
    ),
  },
  {
    accessorKey: "model",
    header: () => <div className="text-center">Modèle</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {extraireValeur(row.getValue("model"))}
      </div>
    ),
  },
  {
    accessorKey: "licensePlate",
    header: () => <div className="text-center">Plaque d'immatriculation</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {extraireValeur(row.getValue("licensePlate"))}
      </div>
    ),
  },
  {
    accessorKey: "purchaseDate",
    header: () => <div className="text-center">Date d'achat</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {formaterDate(row.getValue("purchaseDate"))}
      </div>
    ),
  },
  {
    accessorKey: "warrantyDate",
    header: () => <div className="text-center">Date de garantie</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {formaterDate(row.getValue("warrantyDate"))}
      </div>
    ),
  },
  {
    accessorKey: "kilometers",
    header: () => <div className="text-center">Kilométrage</div>,
    cell: ({ row }) => {
      const km = extraireValeur(row.getValue("kilometers"));
      return (
        <div className="text-center">
          {km !== "Non renseigné" ? `${km} km` : "Non renseigné"}
        </div>
      );
    },
  },
  {
    accessorKey: "maintenanceInterval",
    header: () => <div className="text-center">Intervalle maintenance</div>,
    cell: ({ row }) => {
      const intervalle = extraireValeur(row.getValue("maintenanceInterval"));
      return (
        <div className="text-center">
          {intervalle !== "Non renseigné" ? `${intervalle} km` : "Non renseigné"}
        </div>
      );
    },
  },
  {
    accessorKey: "ownerName",
    header: () => <div className="text-center">Appartenance</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {extraireValeur(row.getValue("ownerName"))}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row, table }) => {
      const moto = row.original;
      return (
        <div className="flex justify-center gap-2">
          <Link href={`/dashboard/motos/${moto.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => supprimerMoto(moto.id, table.options.meta?.setMotos)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Link href={`/dashboard/motos/${moto.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];