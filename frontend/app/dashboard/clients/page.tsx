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
import { DataTable } from "../../../components/clients/data-table";
import { columns, clients } from "../../../components/clients/columns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
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
                  <BreadcrumbPage>Clients</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card >
              <CardHeader  className="flex items-center justify-center">
                <CardTitle>Total Clients</CardTitle>
              </CardHeader>
              <CardContent  className="flex items-center justify-center">
                <p className="text-3xl font-bold">{clients.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader  className="flex items-center justify-center">
                <CardTitle>Clients Actifs</CardTitle>
              </CardHeader>
              <CardContent  className="flex items-center justify-center">
                <p className="text-3xl font-bold">120</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader  className="flex items-center justify-center">
                <CardTitle>Nouveaux Clients</CardTitle>
              </CardHeader>
              <CardContent  className="flex items-center justify-center">
                <p className="text-3xl font-bold">10</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <DataTable columns={columns} data={clients} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
