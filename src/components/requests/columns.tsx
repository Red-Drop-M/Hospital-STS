"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export interface BloodRequest {
  id: string;
  bloodType: string;
  bloodBagType: string;
  priority: 'critical' | 'standard' | 'low';
  status: 'pending' | 'resolved' | 'partial' | 'cancled' | 'rejected';
  requestDate: string;
  dueDate?: string;
  requiredQty: number;
  aquiredQty: number;
  moreDetails?: string;
  serviceId?: string;
  donorId?: string;
}

const priorityMap = {
  critical: { text: 'High', class: 'bg-red-100 text-red-600' },
  standard: { text: 'Medium', class: 'bg-yellow-100 text-yellow-600' },
  low: { text: 'Low', class: 'bg-gray-100 text-gray-600' }
} as const;

const statusMap = {
  pending: { text: 'Pending', class: 'bg-gray-100 text-gray-600' },
  resolved: { text: 'Resolved', class: 'bg-green-100 text-green-600' },
  partial: { text: 'Partial', class: 'bg-blue-100 text-blue-600' },
  cancled: { text: 'Canceled', class: 'bg-orange-100 text-orange-600' },
  rejected: { text: 'Rejected', class: 'bg-red-100 text-red-600' }
} as const;

export const columns: ColumnDef<BloodRequest>[] = [
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("id") as string}</span>
  },
  {
    header: "Request Date",
    accessorKey: "requestDate",
    cell: ({ row }) => new Date(row.getValue("requestDate") as string).toLocaleDateString('fr-FR'),
    size: 120
  },
  {
    header: "Blood Type",
    accessorKey: "bloodType",
    cell: ({ row }) => (
      <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
        {row.getValue("bloodType") as string}
      </Badge>
    ),
    size: 100
  },
  {
    header: "Blood Bag",
    accessorKey: "bloodBagType",
    cell: ({ row }) => {
      const type = row.getValue("bloodBagType") as string;
      return (
        <span className="capitalize">
          {type}
        </span>
      );
    },
    size: 100
  },
  {
    header: "Quantity",
    cell: ({ row }) => {
      const { aquiredQty, requiredQty } = row.original;
      return (
        <div className="text-center font-medium">
          <span className={aquiredQty >= requiredQty ? 'text-green-600' : 'text-red-600'}>
            {aquiredQty}/{requiredQty}
          </span>
        </div>
      );
    },
    size: 100
  },
  {
    header: "Priority",
    accessorKey: "priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as keyof typeof priorityMap;
      const config = priorityMap[priority] || { text: priority, class: 'bg-gray-100 text-gray-600' };
      return <Badge className={config.class}>{config.text}</Badge>;
    },
    size: 120
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusMap;
      const config = statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-600' };
      return <Badge className={config.class}>{config.text}</Badge>;
    },
    size: 120
  },
  {
    header: "Due Date",
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string | undefined;
      return date ? new Date(date).toLocaleDateString('fr-FR') : 'N/A';
    },
    size: 120
  }
];