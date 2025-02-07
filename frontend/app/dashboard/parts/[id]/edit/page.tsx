"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AddPartForm } from "@/components/parts/add-part-form";
import { useEffect, useState } from "react";

type Part = {
  id: string;
  reference: string;
  type: string;
  name: string;
  quantity_in_stock: number;
  part_threshold: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};

type AddPartFormValues = Omit<Part, "id" | "created_at" | "updated_at" | "created_by" | "updated_by">;

export default function EditPartPage({ params }: { params: { id: string } }) {
  const [part, setPart] = useState<Part | null>(null);

  useEffect(() => {
    const mockPart: Part = {
      id: params.id,
      reference: "P12345",
      type: "brake",
      name: "Disque de frein",
      quantity_in_stock: 10,
      part_threshold: 5,
      unit_price: 50.99,
      created_at: "2025-01-01T10:00:00Z",
      updated_at: "2025-01-10T12:00:00Z",
      created_by: "Admin",
      updated_by: "Manager",
    };
    setPart(mockPart);
  }, [params.id]);

  if (!part) return <p>Chargement...</p>;

  const handleSubmit = (values: AddPartFormValues) => {
    const updatedPart: Part = { ...values, id: part.id, created_at: part.created_at, updated_at: new Date().toISOString(), created_by: part.created_by, updated_by: "Admin" };
    console.log("Pièce mise à jour :", updatedPart);
  };

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
                  <BreadcrumbLink href="/dashboard/parts">Pièces détachées</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{part.reference}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Modifier la pièce</h1>
          <AddPartForm onSubmit={handleSubmit} defaultValues={part} mode="edit" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
