import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export type Service = {
  id: string;
  Name: string;
};

export const ServiceColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="truncate max-w-[100px]">{id}</div>;
    },
  },
  {
    accessorKey: "Name",
    header: "Nom du Service",
    cell: ({ row }) => {
      const Name = row.getValue("Name") as string;
      
      return (
        <Badge className="bg-blue-100 w-28 text-blue-600">
          {Name}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex items-center space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            data-action="edit"
            data-service-id={service.id}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            data-action="delete"
            data-service-id={service.id}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];