"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type User = {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isAdmin",
    header: "Rôle",
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin") as boolean
      return <Badge variant={isAdmin ? "default" : "outline"}>{isAdmin ? "Admin" : "Utilisateur"}</Badge>
    },
  },
]
