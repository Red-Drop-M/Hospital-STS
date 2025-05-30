"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type UserDTO = {
  id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
  DateOfBirth?: string | Date;
  PhoneNumber?: string;
  Address?: string;
};

export const UserColumns: ColumnDef<UserDTO>[] = [
  {
    accessorKey: "FirstName",
    header: "Name",
  },

  {
    accessorKey: "Email",
    header: "Email",
  },
  {
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("Role") as string;
      return (
        <Badge variant={role === "Admin" ? "destructive" : "default"}>
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            data-action="edit"
            data-user-id={user.id}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            data-action="delete"
            data-user-id={user.id}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];