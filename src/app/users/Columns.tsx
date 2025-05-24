"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
};

export const UserColumns: ColumnDef<UserDTO>[] = [
  {
    accessorKey: "name",
    header: "Nom complet",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const getRoleBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
          case "admin":
            return "bg-purple-100 text-purple-800";
          case "doctor":
            return "bg-blue-100 text-blue-800";
          case "nurse":
            return "bg-green-100 text-green-800";
          case "patient":
            return "bg-yellow-100 text-yellow-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };
      return <Badge className={getRoleBadgeColor(role)}>{role}</Badge>;
    },
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date de naissance",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateOfBirth"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Téléphone",
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return <span className="truncate max-w-[200px] block">{address}</span>;
    },
  },
];