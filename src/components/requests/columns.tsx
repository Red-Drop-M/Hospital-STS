"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge" 

export interface BloodRequest {
    requestId: string;    
    bloodType: string;      
    units: number;          
    priority: 'Low' | 'Medium' | 'High'; 
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed'; 
    doctor: string;         
    department: string;     
  } 


export const getBloodBadgeColor = (blood: string): string => {
  switch (blood) {
    case "A+":
    case "A-":
      return "bg-red-100 text-red-600";
    case "B+":
    case "B-":
      return "bg-red-100 text-red-600";
    case "AB+":
    case "AB-":
      return "bg-red-100 text-red-600";
    case "O+":
    case "O-":
      return "bg-red-100 text-red-600";
    default:
      return "bg-red-100 text-red-600";
  }
};

export const columns: ColumnDef<BloodRequest>[] = [
  {
    header: "ID",
    accessorKey: "requestId",
  },
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Groupe Sanguin",
    accessorKey: "bloodType",
    cell: ({ row }) => {
      const blood = row.getValue("bloodType")as string;;
      const badgeColor = getBloodBadgeColor(blood);
      return <Badge className={badgeColor}>{blood}</Badge>;
    },
  },
  {
    header: "Unités",
    accessorKey: "units",
  },
  {
    header: "Priorité",
    accessorKey: "priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority")as 'Low' | 'Medium' | 'High';
      const colorMap = {
        Low: "bg-gray-100 text-gray-600",
        Medium: "bg-yellow-100 text-yellow-600",
        High: "bg-red-100 text-red-600",
      };
      return <Badge className={colorMap[priority]}>{priority}</Badge>;
    },
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as 'Pending' | 'Approved' | 'Rejected' | 'Completed';
      const colorMap = {
        Pending: "bg-gray-100 text-gray-600",
        Approved: "bg-blue-100 text-blue-600",
        Rejected: "bg-red-100 text-red-600",
        Completed: "bg-green-100 text-green-600",
      };
      return <Badge className={colorMap[status]}>{status}</Badge>;
    },
  },
  {
    header: "Médecin",
    accessorKey: "doctor",
  },
  {
    header: "Département",
    accessorKey: "department",
  },
];
