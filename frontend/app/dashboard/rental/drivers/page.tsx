"use client"
import * as React from "react";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const API_URL_BASE = `${process.env.NEXT_PUBLIC_API_URL_EXPRESS}/api`

interface ValueWrapper<T> {
  value: T;
}

interface Driver {
  driverId: string;
  licenseNumber: ValueWrapper<string>;
  experienceLevel: string;
  dateOfBirth: ValueWrapper<string>;
  clientId: string;
  motorcycleId: string;
  client: {
    createdAt: string;
    updatedAt: string;
  };
}

const formatDate = (dateStr: string | null | undefined, formatStr: string = "dd/MM/yyyy"): string => {
  if (!dateStr) return "-";
  try {
    const date = parseISO(dateStr);
    return format(date, formatStr);
  } catch (error) {
    console.error("Erreur de formatage de la date:", error);
    return "-";
  }
};

const DriversPage = () => {
  const [driverData, setDriverData] = React.useState<Driver[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  React.useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${API_URL_BASE}/drivers`);
        if (response.ok) {
          const data = await response.json();
          setDriverData(data);
        } else {
          console.error("Erreur lors de la récupération des conducteurs");
        }
      } catch (error) {
        console.error("Erreur de connexion à l'API:", error);
      }
    };

    fetchDrivers();
  }, []);

  const handleDelete = async (driverId: string) => {
    try {
      const response = await fetch(`${API_URL_BASE}/drivers/${driverId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDriverData((prevData) => prevData.filter((driver) => driver.driverId !== driverId));
      } else {
        console.error("Erreur lors de la suppression du conducteur");
      }
    } catch (error) {
      console.error("Erreur de connexion à l'API:", error);
    }
  };

  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: "driverId",
      header: "ID du Conducteur",
    },
    {
      accessorKey: "licenseNumber",
      header: "Numéro de Permis",
      cell: ({ row }) => row.original.licenseNumber.value,
    },
    {
      accessorKey: "experienceLevel",
      header: "Niveau d'Expérience",
      cell: ({ row }) => <div>{row.original.experienceLevel || "-"}</div>,
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date de Naissance",
      cell: ({ row }) => (
        <div>{formatDate(row.original.dateOfBirth.value)}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.driverId)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: driverData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { 
      sorting, 
      globalFilter 
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId)).toLowerCase();
      return value.includes(filterValue.toLowerCase());
    },
  });

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
                <BreadcrumbPage>Locations</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Conducteurs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
        <div className="p-4 pt-8">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DriversPage;