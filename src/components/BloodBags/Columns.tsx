

export interface BloodBagDTO {
    id: string; // Guid est représenté par string en TypeScript
    BloodBagType: 'blood' | 'plaquette' | 'plasma';
    BloodType: 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+' | 'O-' | 'O+';
    BloodBagStatus?: "aquired" | "ready" | "expired" | "using" | "outforexpired" | "out of stock" | null; // équivalent à BloodBagStatus?
    ExpirationDate?: string | null; // DateOnly représenté comme string (format ISO)
    AcquiredDate?: string | null; // DateOnly représenté comme string (format ISO)
    DonorId?: string | null; // Guid?
    RequestId?: string | null; // Guid?
}

import { ColumnDef } from "@tanstack/react-table";

export const bloodBagColumns: ColumnDef<BloodBagDTO>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "BloodBagType",
    header: "Type de Poche",
    cell: (info) => {
      const value = info.getValue() as BloodBagDTO["BloodBagType"];
      return (
        <span className="capitalize">
          {value === "blood" ? "Sang" : value === "plaquette" ? "Plaquettes" : "Plasma"}
        </span>
      );
    },
  },
  {
    accessorKey: "BloodType",
    header: "Groupe Sanguin",
    cell: (info) => {
      const value = info.getValue() as BloodBagDTO["BloodType"];
      return <span>{value.replace("+", "⁺").replace("-", "⁻")}</span>;
    },
  },
  {
    accessorKey: "BloodBagStatus",
    header: "Statut",
    cell: (info) => {
      const status = info.getValue() as BloodBagDTO["BloodBagStatus"];
      if (!status) return <span className="text-gray-500">Non défini</span>;

      const statusStyles = {
        aquired: "bg-blue-100 text-blue-800",
        ready: "bg-green-100 text-green-800",
        expired: "bg-red-100 text-red-800",
        using: "bg-yellow-100 text-yellow-800",
        outforexpired: "bg-orange-100 text-orange-800",
        "out of stock": "bg-gray-100 text-gray-800",
      };

      const displayText = {
        aquired: "aquired",
        ready: "ready",
        expired: "expired",
        using: "using",
        outforexpired: "outforexpired",
        "out of stock": "out of stock",
      };

      return (
        <span className={`px-2 py-1 rounded-md text-xs ${statusStyles[status as keyof typeof statusStyles]}`}>
          {displayText[status as keyof typeof displayText]}
        </span>
      );
    },
  },
  {
    accessorKey: "AcquiredDate",
    header: "Date d'Acquisition",
    cell: (info) => {
      const date = info.getValue() as string | null;
      return date ? new Date(date).toLocaleDateString("fr-FR") : "N/A";
    },
  },
  {
    accessorKey: "ExpirationDate",
    header: "Date d'Expiration",
    cell: (info) => {
      const date = info.getValue() as string | null;
      return date ? new Date(date).toLocaleDateString("fr-FR") : "N/A";
    },
  },
  
];