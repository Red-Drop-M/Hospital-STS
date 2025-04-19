"use client"

import { useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious, } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import {BloodTypeFilter} from "./filter/blood-type-filter"
import { DonationsCountFilter } from "./filter/donations-count-filter"
import { DateRangeFilter } from "./filter/date-range-filter"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageIndex: number
  onPageChange: (page: number) => void
  globalFilter: string
  setGlobalFilter: (value: string) => void
  columnFilters: { id: string; value: any }[]
  setColumnFilters: (filters: { id: string; value: any }[]) => void
  totalRows: number
}

// Pagination Component Implementation
interface PaginationComponentProps {
  pageCount: number
  pageIndex: number
  onPageChange: (page: number) => void
}

function PaginationComponent({ pageCount, pageIndex, onPageChange }: PaginationComponentProps) {
  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of pages to show
    const startPage = Math.max(0, Math.min(pageIndex - Math.floor(showPages / 2), pageCount - showPages));
    const endPage = Math.min(pageCount - 1, startPage + showPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
            className={pageIndex === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
          />
        </PaginationItem>
        
        {pageIndex > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(0)}>1</PaginationLink>
            </PaginationItem>
            {pageIndex > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        
        {getPageNumbers().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              isActive={page === pageIndex}
              onClick={() => onPageChange(page)}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {pageIndex < pageCount - 2 && (
          <>
            {pageIndex < pageCount - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(pageCount - 1)}>
                {pageCount}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(pageCount - 1, pageIndex + 1))}
            className={pageIndex === pageCount - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  onPageChange,
  globalFilter,
  setGlobalFilter,
  columnFilters,
  setColumnFilters,
  totalRows,
}: DataTableProps<TData, TValue>) {
  const [showFilters, setShowFilters] = useState(false)
  const pageSize = 10 // You can adjust the default page size here

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  })

 
  const updateColumnFilter = (columnId: string, value: any) => {
    const updatedFilters = [...columnFilters];
    const existingFilterIndex = updatedFilters.findIndex((filter) => filter.id === columnId);
    
    if (existingFilterIndex >= 0) {
      updatedFilters[existingFilterIndex] = { ...updatedFilters[existingFilterIndex], value };
    } else {
      updatedFilters.push({ id: columnId, value });
    }
    
    setColumnFilters(updatedFilters);
  }
  
  const removeColumnFilter = (columnId: string) => {
    const updatedFilters = columnFilters.filter((filter) => filter.id !== columnId);
    setColumnFilters(updatedFilters);
  }
  

  // Fonction pour supprimer tous les filtres
  const clearAllFilters = () => {
    setGlobalFilter("")
    setColumnFilters([])
    setShowFilters(false)
  }

  // Vérifier si un filtre est actif pour une colonne
  const isFilterActive = (columnId: string) => {
    return columnFilters.some((filter) => filter.id === columnId)
  }

  // Obtenir les filtres actifs pour l'affichage
  const getActiveFilters = () => {
    return columnFilters.map((filter) => {
      let displayValue = ""

      if (filter.id === "bloodType") {
        displayValue = filter.value.join(", ")
      } else if (filter.id === "donationsCount") {
        displayValue = `${filter.value[0]} - ${filter.value[1]}`
      } else if (filter.id === "lastDonation") {
        const [start, end] = filter.value
        displayValue = `${new Date(start).toLocaleDateString("fr-FR")} - ${new Date(end).toLocaleDateString("fr-FR")}`
      }

      return {
        id: filter.id,
        displayName: getColumnDisplayName(filter.id),
        value: displayValue,
      }
    })
  }

  // Obtenir le nom d'affichage d'une colonne
  const getColumnDisplayName = (columnId: string) => {
    switch (columnId) {
      case "bloodType":
        return "Groupe Sanguin"
      case "donationsCount":
        return "Nombre de Donations"
      case "lastDonation":
        return "Dernière Donation"
      default:
        return columnId
    }
  }

  const activeFilters = getActiveFilters()

  return (
    <div>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un donneur..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setGlobalFilter("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onSelect={() => setShowFilters(!showFilters)}>
                {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={clearAllFilters}>Effacer tous les filtres</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Affichage des filtres actifs */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div key={filter.id} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                <span className="font-medium mr-1">{filter.displayName}:</span>
                <span className="mr-2">{filter.value}</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => removeColumnFilter(filter.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <Button variant="ghost" size="sm" className="text-sm h-7" onClick={clearAllFilters}>
              Effacer tout
            </Button>
          </div>
        )}

        {/* Panneau de filtres */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <BloodTypeFilter
                  value={columnFilters.find((f) => f.id === "bloodType")?.value || []}
                  onChange={(value) => updateColumnFilter("bloodType", value)}
                  isActive={isFilterActive("bloodType")}
                  onClear={() => removeColumnFilter("bloodType")}
                />

                <DonationsCountFilter
                  value={columnFilters.find((f) => f.id === "donationsCount")?.value || [0, 20]}
                  onChange={(value) => updateColumnFilter("donationsCount", value)}
                  isActive={isFilterActive("donationsCount")}
                  onClear={() => removeColumnFilter("donationsCount")}
                />

                <DateRangeFilter
                  value={columnFilters.find((f) => f.id === "lastDonation")?.value || ["", ""]}
                  onChange={(value) => updateColumnFilter("lastDonation", value)}
                  isActive={isFilterActive("lastDonation")}
                  onClear={() => removeColumnFilter("lastDonation")}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Affichage de {data.length > 0 ? pageIndex * pageSize + 1 : 0} à{" "}
          {Math.min((pageIndex + 1) * pageSize, totalRows)} sur {totalRows} donneurs
        </div>
        <PaginationComponent pageCount={pageCount} pageIndex={pageIndex} onPageChange={onPageChange} />
      </div>
    </div>
  )
}