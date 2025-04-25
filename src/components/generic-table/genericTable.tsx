"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow} from"@/components/ui/table"

  
  type genericTableType<TData> = {
    columns : ColumnDef<TData>[];
    data: TData[];
  };
  
export default function GenericTable <TData>({columns, data}: genericTableType<TData>){
    
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })
  


  return (
    <div className="flex items-center justify-center  m-auto w-[80%]">
      <div className="w-full rounded-md border ">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroupe => (
              <TableRow key={headerGroupe.id}>
                {headerGroupe.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow>
                {row.getVisibleCells().map(cell => (
                  <TableCell >
                    {flexRender(cell.column.columnDef.cell, cell.getContext()) }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
    </div>
    </div>
    
  );
}
