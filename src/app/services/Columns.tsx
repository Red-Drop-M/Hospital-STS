import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Service = {
  id: string;
  Name: string;
};

export const ServiceColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "Name",
    header: "Nom du Service",
    cell: ({ row }) => {
      const Name = row.getValue("Name") as string;
      
      return (
        <Badge className="bg-blue-100 text-blue-600">
          {Name}
        </Badge>
      );
    },
  },
];