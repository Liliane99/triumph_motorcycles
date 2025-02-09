"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AddMotoForm, MotoFormValues } from "@/components/moto/add-moto-form";
import { useEffect, useState } from "react";
import { getMotorcycleById, updateMotorcycle } from "@/lib/apiExpress";
import { getUsers } from "@/lib/api";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function EditMaintenancePage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<MotoFormValues | null>(null);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const motorcycle = await getMotorcycleById(params.id);
        console.log("Moto récupérée :", motorcycle); // Debug

        if (motorcycle) {
          setDefaultValues({
            id: motorcycle.id,
            brand: motorcycle.brand?.value ?? "",
            model: motorcycle.model?.value ?? "",
            licensePlate: motorcycle.licensePlate?.value ?? "",
            kilometers: motorcycle.kilometers?.value ?? 0,
            maintenanceInterval: motorcycle.maintenanceInterval?.value ?? 0,
            purchaseDate: motorcycle.purchaseDate?.value ? new Date(motorcycle.purchaseDate.value) : null,
            warrantyDate: motorcycle.warrantyDate?.value ? new Date(motorcycle.warrantyDate.value) : null,
            ownerId: motorcycle.ownerId?.value ?? "",
          });
        }

        const userList = await getUsers();
        const formattedUsers = userList.map(user => ({
          id: user.id,
          name: user.role.value === 'admin' || user.role.value === 'manager'
            ? `${user.username.value} (Triumph Motorcycle)`
            : user.username.value
        }));
        setUsers(formattedUsers);
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        setError("Une erreur est survenue lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (values: MotoFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token introuvable");

      console.log("Données envoyées à updateMotorcycle :", values); // Debug

      await updateMotorcycle(
        params.id,
        {
          brand: values.brand,
          model: values.model,
          licensePlate: values.licensePlate,
          kilometers: values.kilometers,
          maintenanceInterval: values.maintenanceInterval,
          purchaseDate: values.purchaseDate ? format(values.purchaseDate, "yyyy-MM-dd") : null,
          warrantyDate: values.warrantyDate ? format(values.warrantyDate, "yyyy-MM-dd") : null,
          ownerId: values.ownerId,
        },
        token
      );

      alert("La moto a été mise à jour avec succès !");
      router.push("/dashboard/motos"); // Redirection après mise à jour
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError("Une erreur est survenue lors de la mise à jour de la moto.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/motos">Motos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{defaultValues?.licensePlate ?? "Plaque inconnue"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier la moto</h1>
          {defaultValues && (
            <AddMotoForm 
              defaultValues={defaultValues} 
              mode="edit" 
              onSubmit={handleSubmit} 
              users={users} 
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
