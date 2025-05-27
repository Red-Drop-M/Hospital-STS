"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { deleteRequest } from "@/lib/ReqAPI";
import { toast } from "@/hooks/use-toast";

export interface BloodRequest {
  id: string
  bloodType: string
  bloodBagType: string
  priority: 'critical' | 'standard' | 'low'
  status: 'pending' | 'resolved' | 'partial' | 'cancled' | 'rejected'
  requestDate: string
  dueDate?: string
  requiredQty: number
  aquiredQty: number
  moreDetails?: string
  serviceId?: string
  donorId?: string
}

// Couleurs spécifiques pour les groupes sanguins
const bloodTypeMap = {
  'A+': 'bg-red-100 text-red-800 border-red-200',
  'A-': 'bg-red-100 text-red-800 border-red-200',
  'B+': 'bg-red-100 text-red-800 border-red-200',
  'B-': 'bg-red-100 text-red-800 border-red-200',
  'AB+': 'bg-red-100 text-red-800 border-red-200',
  'AB-': 'bg-red-100 text-red-800 border-red-200',
  'O+': 'bg-red-100 text-red-800 border-red-200',
  'O-': 'bg-red-100 text-red-800 border-red-200',
}

// Nouvelles couleurs pour les statuts
const statusMap = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancled: 'bg-gray-100 text-gray-600 border-gray-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
}

// Nouvelles couleurs pour les priorités
const priorityMap = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  standard: 'bg-amber-100 text-amber-800 border-amber-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200'
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'dd/MM/yyyy')
  } catch {
    return 'Invalid Date'
  }
}

export const columns = (
  setRequests: React.Dispatch<React.SetStateAction<BloodRequest[]>>,
  setIsUpdateModalOpen: (open: boolean) => void,
  setSelectedRequest: (request: BloodRequest | null) => void,
): ColumnDef<BloodRequest>[] => [  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("id")}</span>,
  },
    {
    header: "Blood Type",
    accessorKey: "bloodType",
    cell: ({ row }) => {
      const bloodType = row.getValue("bloodType") as keyof typeof bloodTypeMap;
      return (
        <Badge
          className={`${bloodTypeMap[bloodType]} font-bold min-w-[60px] justify-center`}
        >
          {bloodType || "N/A"}
        </Badge>
      );
    },
  },
  {
    header: "Blood Bag Type",
    accessorKey: "bloodBagType",
    cell: ({ row }) => <span className="text-gray-600">{row.getValue("bloodBagType") || "N/A"}</span>,
  },
  {
    header: "Priority",
    accessorKey: "priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as keyof typeof priorityMap;
      return (
        <Badge className={`${priorityMap[priority]} font-semibold`}>
          {priority === "critical" && "Critical"}
          {priority === "standard" && "Standard"}
          {priority === "low" && "Low"}
        </Badge>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusMap;
      return (
        <Badge className={`${statusMap[status] || 'bg-gray-100 text-gray-800'} font-semibold`}>
          {status === "pending" && "Pending"}
          {status === "resolved" && "Resolved"}
          {status === "partial" && "Partial"}
          {status === "cancled" && "Canceled"}
          {status === "rejected" && "Rejected"}
          {!["pending", "resolved", "partial", "cancled", "rejected"].includes(status) && (status || "Unknown")}
        </Badge>
      );
    },
  },
  {
    header: "Request Date",
    accessorKey: "requestDate",
    cell: ({ row }) => <span className="text-gray-600">{formatDate(row.getValue("requestDate"))}</span>,
  },
  {
    header: "Due Date",
    accessorKey: "dueDate",
    cell: ({ row }) => <span className="text-gray-600">{formatDate(row.getValue("dueDate"))}</span>,
  },
  {
    header: "Required Qty",
    accessorKey: "requiredQty",
    cell: ({ row }) => <span className="font-bold text-red-700">{row.getValue("requiredQty")}</span>,
  },
  {
    header: "Acquired Qty",
    accessorKey: "aquiredQty",
    cell: ({ row }) => <span className="font-bold text-green-700">{row.getValue("aquiredQty")}</span>,
  },
  {
    header: "Details",
    accessorKey: "moreDetails",
    cell: ({ row }) => <span className="text-gray-500 italic">{row.getValue("moreDetails") || "No details"}</span>,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      const request = row.original as BloodRequest;

      const handleUpdate = () => {
        setSelectedRequest(request);
        setIsUpdateModalOpen(true);
      };

      const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this request?")) {
          try {
            console.log("Deleting request with ID:", id);

            const response = await deleteRequest(id);

            setRequests((prev) => {
              const updatedRequests = prev.filter((request: BloodRequest) => request.id !== id);
              console.log("Updated requests:", updatedRequests);
              return updatedRequests;
            });

            toast({
              title: "Success",
              description: response.message || "Request deleted successfully",
            });
          } catch (error) {
            console.error("Failed to delete request:", error);
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to delete request",
              variant: "destructive",
            });
          }
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleUpdate}>
              <Edit className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(request.id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];



export default columns;