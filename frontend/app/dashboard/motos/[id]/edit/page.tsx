"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AddMotoForm, MotoFormValues } from "@/components/moto/add-moto-form";
import { useEffect, useState } from "react";
import { getMotorcycleById, updateMotorcycle } from "@/lib/apiExpress";
import { getUsers } from "@/lib/api";

export default function EditMaintenancePage({ params }: { params: { id: string } }) {
  const [defaultValues, setDefaultValues] = useState<MotoFormValues | null>(null);
  const [users, setUsers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const motorcycle = await getMotorcycleById(params.id);
        if (motorcycle) {
          setDefaultValues({
            id: motorcycle.id,
            model: motorcycle.model,
            brand: motorcycle.brand,
            licensePlate: motorcycle.licensePlate,
            price: motorcycle.kilometers.toString(),
            date: new Date(motorcycle.purchaseDate),
            warranty: new Date(motorcycle.warrantyDate),
            maintenanceInterval: motorcycle.maintenanceInterval,
            kilometer: motorcycle.kilometers,
            client: motorcycle.ownerId, 
          });
        }
        
        
        const userList = await getUsers();
        setUsers(userList);
      } catch (err) {
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

      await updateMotorcycle(params.id, {
        model: values.model,
        brand: values.brand,
        licensePlate: values.licensePlate,
        maintenanceInterval: values.maintenanceInterval,
        kilometers: values.kilometer,
        purchaseDate: values.date.toISOString(),
        warrantyDate: values.warranty.toISOString(),
        ownerId: values.client, 
      }, token);

      alert("La moto a été mise à jour avec succès !");
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour de la moto.");
      console.error(err);
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
                  <BreadcrumbPage>{defaultValues?.licensePlate}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier la moto</h1>
          <AddMotoForm 
            onSubmit={handleSubmit} 
            defaultValues={defaultValues} 
            mode="edit" 
            users={users} 
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
