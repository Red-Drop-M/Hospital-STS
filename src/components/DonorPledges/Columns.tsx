"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DonorPledgeDTO {
  DonorId: string
  DonorName: string
  RequestId: string
  BloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  PledgeDate: string
  Status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}

const bloodTypeMap = {
  'A+': 'bg-red-100 text-red-800 border-red-200',
  'A-': 'bg-red-100 text-red-800 border-red-200',
  'B+': 'bg-red-100 text-red-800 border-red-200',
  'B-': 'bg-red-100 text-red-800 border-red-200',
  'AB+': 'bg-red-100 text-red-800 border-red-200',
  'AB-': 'bg-red-100 text-red-800 border-red-200',
  'O+': 'bg-red-100 text-red-800 border-red-200',
  'O-': 'bg-red-100 text-red-800 border-red-200',
};

const statusConfig = {
  pending: {
    style: "bg-yellow-100 text-yellow-800 border-yellow-200",
    text: "Pending"
  },
  confirmed: {
    style: "bg-blue-100 text-blue-800 border-blue-200",
    text: "Confirmed"
  },
  completed: {
    style: "bg-green-100 text-green-800 border-green-200",
    text: "Completed"
  },
  cancelled: {
    style: "bg-red-100 text-red-800 border-red-200",
    text: "Cancelled"
  }
};

export const donorPledgeColumns = (
  setIsUpdateModalOpen: (open: boolean) => void,
  setSelectedPledge: (pledge: DonorPledgeDTO | null) => void
): ColumnDef<DonorPledgeDTO>[] => [
  {
    accessorKey: "DonorName",
    header: "Donor Name",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="font-medium">{row.getValue("DonorName")}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "BloodType",
    header: "Blood Type",
    cell: ({ row }) => {
      const bloodType = row.getValue("BloodType") as keyof typeof bloodTypeMap;
      return (
        <Badge className={cn(
          bloodTypeMap[bloodType],
          "font-bold min-w-[60px] justify-center"
        )}>
          {bloodType || "N/A"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.length === 0 || value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "PledgeDate",
    header: "Pledge Date",
    cell: ({ row }) => {
      const date = row.getValue("PledgeDate") as string;
      if (!date) return <span className="text-gray-500">-</span>;
      
      return (
        <div className="font-medium">
          {format(new Date(date), "dd/MM/yyyy")}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const [start, end] = value;
      const date = new Date(row.getValue(id));
      if (!start && !end) return true;
      if (start && !end) return date >= start;
      if (!start && end) return date <= end;
      return date >= start && date <= end;
    },
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status") as keyof typeof statusConfig;
      const config = statusConfig[status];
      
      return (
        <Badge className={cn(
          config.style,
          "font-semibold min-w-[100px] justify-center"
        )}>
          {config.text}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.length === 0 || value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "RequestId",
    header: "Request ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.getValue("RequestId")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const pledge = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              •••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => {
                setSelectedPledge(pledge);
                setIsUpdateModalOpen(true);
              }}
              className="text-blue-600"
            >
              <Edit className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];

export const filterOptions = {
  bloodTypes: [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ],
  statuses: [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ],
};