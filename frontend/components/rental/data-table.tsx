"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Link from "next/link";
import { useRentals } from "@/components/rental/columns"; 
import { Rental } from "@/lib/apiExpress"; 

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
}

export function RentalDataTable({
  columns,
}: DataTableProps<Rental>) {
  const { rentals, setRentals, loading } = useRentals(); // Utilisation d'un hook pour récupérer les locations

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [dateFilter, setDateFilter] = React.useState<Date | undefined>(undefined);

  // Initialisation du tableau avec les données et les colonnes
  const table = useReactTable({
    data: rentals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const reference = row.getValue("reference")?.toLowerCase() || "";
      const price = row.getValue("price")?.toString() || "";
      const motorcycleId = row.getValue("motorcycleId")?.toLowerCase() || "";
      return (
        reference.includes(filterValue.toLowerCase()) ||
        price.includes(filterValue.toLowerCase()) ||
        motorcycleId.includes(filterValue.toLowerCase())
      );
    },
  });

  React.useEffect(() => {
    // Gestion du filtre de date
    if (dateFilter) {
      table.getColumn("rentalDate")?.setFilterValue(format(dateFilter, "yyyy-MM-dd"));
    } else {
      table.getColumn("rentalDate")?.setFilterValue(undefined);
    }
  }, [dateFilter, table]);

  return (
    <div>
      {loading ? (
        <p className="text-center py-4">Chargement des locations...</p>
      ) : (
        <>
          <div className="flex justify-between items-center py-4">
            <div className="flex gap-4">
              <Input
                placeholder="Rechercher par référence, prix ou moto"
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm"
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[250px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "dd/MM/yyyy") : "Filtrer par date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button asChild className="flex gap-2" variant="default">
              <Link href="/dashboard/rental/new">
                <Plus className="w-4 h-4" />
                Ajouter une location
              </Link>
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {typeof cell.getValue() === "object"
                            ? JSON.stringify(cell.getValue()) // Si la valeur est un objet, on le transforme en chaîne
                            : flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Aucun résultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              Première
            </Button>
            <Button
              variant="ghost"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédente
            </Button>
            <Button
              variant="ghost"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivante
            </Button>
            <Button
              variant="ghost"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Dernière
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
