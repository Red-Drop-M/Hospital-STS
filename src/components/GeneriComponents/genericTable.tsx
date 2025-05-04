// "use client"

// import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
// import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow} from"@/components/ui/table"

  
//   type genericTableType<TData> = {
//     columns : ColumnDef<TData>[];
//     data: TData[];
//   };
  
// export default function GenericTable <TData>({columns, data}: genericTableType<TData>){
    
//     const table = useReactTable({
//       data,
//       columns,
//       getCoreRowModel: getCoreRowModel(),
//     })
  


//   return (
//     <div className="flex items-center justify-center  m-auto w-[80%]">
//       <div className="w-full rounded-md border ">
//         <Table className="w-full">
//           <TableHeader>
//             {table.getHeaderGroups().map(headerGroupe => (
//               <TableRow key={headerGroupe.id}>
//                 {headerGroupe.headers.map(header => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.map(row => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map(cell => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext()) }
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
        
//     </div>
//     </div>
    
//   );
// }


"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import  PaginationComponent  from "./PaginationComponent" // Importez votre composant de pagination

type GenericTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  pageCount?: number
  pageIndex?: number
  onPageChange?: (page: number) => void
}

export default function GenericTable<TData>({
  columns,
  data,
  pageCount,
  pageIndex,
  onPageChange
}: GenericTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pageCount !== undefined && pageIndex !== undefined && onPageChange && (
        <PaginationComponent
          pageCount={pageCount}
          pageIndex={pageIndex}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}