"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, CartesianGrid, XAxis, LabelList, ResponsiveContainer } from "recharts";
import { LineChart, Line } from "recharts";
import { getUsers } from "@/lib/api";
import { format } from "date-fns";

const revenueData = [
  { month: "Jan", revenue: 5000 },
  { month: "Feb", revenue: 7500 },
  { month: "Mar", revenue: 6200 },
  { month: "Apr", revenue: 8100 },
  { month: "May", revenue: 9200 },
  { month: "Jun", revenue: 10500 },
];

const topClients = [
  { id: 1, name: "Client A", revenue: 15000 },
  { id: 2, name: "Client B", revenue: 12000 },
  { id: 3, name: "Client C", revenue: 11000 },
  { id: 4, name: "Client D", revenue: 9500 },
  { id: 5, name: "Client E", revenue: 9000 },
  { id: 6, name: "Client F", revenue: 8500 },
  { id: 7, name: "Client G", revenue: 8000 },
  { id: 8, name: "Client H", revenue: 7500 },
  { id: 9, name: "Client I", revenue: 7000 },
  { id: 10, name: "Client J", revenue: 6500 },
];

function DashboardPage() {
  const [totalClients, setTotalClients] = useState(0);
  const [clientData, setClientData] = useState<{ month: string; clients: number }[]>([]);

  useEffect(() => {
    async function fetchClients() {
      try {
        const users = await getUsers();
        const clients = users.filter(user => user.role.value === "client");

        // Mise à jour du nombre total de clients
        setTotalClients(clients.length);

        // Regrouper les clients par mois selon `createdAt`
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyCounts: Record<string, number> = {};

        clients.forEach(client => {
          const month = format(new Date(client.createdAt), "MMM");
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        const formattedClientData = months.map(month => ({
          month,
          clients: monthlyCounts[month] || 0
        }));

        setClientData(formattedClientData);
      } catch (error) {
        console.error("Erreur lors du chargement des clients :", error);
      }
    }

    fetchClients();
  }, []);

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
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Entretiens réalisés</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">320</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Incidents</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">45</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>Nombre de clients</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-3xl font-bold">{totalClients}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} />
                    <Line
                      type="natural"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nouveaux clients</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} />
                    <Bar dataKey="clients" fill="hsl(var(--chart-2))" radius={[10, 10, 0, 0]}>
                      <LabelList position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rang</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Revenus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topClients.map((client, index) => (
                    <TableRow key={client.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.revenue} €</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const DashboardContent = dynamic(() => Promise.resolve(DashboardPage), {
  ssr: false
});

export default DashboardContent;
