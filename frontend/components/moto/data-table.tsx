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
import { useMotos } from "@/components/moto/columns";
import { Motorcycle } from "@/lib/apiExpress"; 

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
}

export function DataTable({ columns }: DataTableProps<Motorcycle>) { 
  const { motos, loading } = useMotos(); 
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [dateFilter, setDateFilter] = React.useState<Date | undefined>(undefined);

  const table = useReactTable({
    data: motos,
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
      const brand = row.getValue<string>("brand")?.toLowerCase();
      const model = row.getValue<string>("model")?.toLowerCase();
      const licensePlate = row.getValue<string>("licensePlate")?.toLowerCase();
      return (
        brand?.includes(filterValue.toLowerCase()) ||
        model?.includes(filterValue.toLowerCase()) ||
        licensePlate?.includes(filterValue.toLowerCase())
      );
    },
  });

  React.useEffect(() => {
    if (dateFilter) {
      table.getColumn("purchaseDate")?.setFilterValue(format(dateFilter, "yyyy-MM-dd"));
    } else {
      table.getColumn("purchaseDate")?.setFilterValue(undefined);
    }
  }, [dateFilter, table]);

  return (
    <div>
      {loading ? (
        <p className="text-center py-4">Chargement des motos...</p>
      ) : (
        <>
          <div className="flex justify-between items-center py-4">
            <div className="flex gap-4">
              <Input
                placeholder="Rechercher par marque, modèle ou plaque"
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
              <Link href="/dashboard/motos/new">
                <Plus className="w-4 h-4" />
                Ajouter une moto
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
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

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivant
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
