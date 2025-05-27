"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export interface DonorPledgeDTO {
  Id: string
  DonorId: string
  PlannedDate: string
  Status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  BloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  DonorName?: string
  DonorContact?: string
  CreatedAt: string
}

export const donorPledgeColumns: ColumnDef<DonorPledgeDTO>[] = [
  {
    accessorKey: "Id",
    header: "ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "DonorName",
    header: "Nom du Donneur",
    cell: (info) => info.getValue() || "N/A",
  },
  {
    accessorKey: "BloodType",
    header: "Groupe Sanguin",
    cell: (info) => {
      const value = info.getValue() as DonorPledgeDTO["BloodType"]
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          {value?.replace("+", "⁺").replace("-", "⁻")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "Status",
    header: "Statut",
    cell: (info) => {
      const status = info.getValue() as DonorPledgeDTO["Status"]
      
      const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
      }

      return (
        <Badge className={statusStyles[status]}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "PlannedDate",
    header: "Date Prévue",
    cell: (info) => {
      const date = info.getValue() as string
      return format(new Date(date), "dd/MM/yyyy")
    },
  },
  {
    accessorKey: "DonorContact",
    header: "Contact",
    cell: (info) => info.getValue() || "N/A",
  },
  {
    accessorKey: "CreatedAt",
    header: "Date de Création",
    cell: (info) => {
      const date = info.getValue() as string
      return format(new Date(date), "dd/MM/yyyy")
    },
  }
]