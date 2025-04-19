"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { Donor } from "./types/donors"
import { DonorDetailsDialog } from "./donors-details-dialog"

export const columns: ColumnDef<Donor>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "bloodType",
    header: "Groupe Sanguin",
    cell: ({ row }) => {
      const bloodType = row.getValue("bloodType") as string
      return (
        <div className="font-medium">
          <span className={`px-2 py-1 rounded-full ${getBloodTypeColor(bloodType)}`}>{bloodType}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "lastDonation",
    header: "Dernière Donation",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastDonation") as string)
      return <div>{date.toLocaleDateString("fr-FR")}</div>
    },
  },
  {
    accessorKey: "donationsCount",
    header: "Nombre de Donations",
  },
  {
    id: "details",
    header: "Détails",
    cell: ({ row }) => {
      const donor = row.original

      return (
        <DonorDetailsDialog donor={donor}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Détails
          </Button>
        </DonorDetailsDialog>
      )
    },
  },
]

function getBloodTypeColor(bloodType: string): string {
  switch (bloodType) {
    case "A+":
    case "A-":
      return "bg-red-100 text-red-800"
    case "B+":
    case "B-":
      return "bg-blue-100 text-blue-800"
    case "AB+":
    case "AB-":
      return "bg-purple-100 text-purple-800"
    case "O+":
    case "O-":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
