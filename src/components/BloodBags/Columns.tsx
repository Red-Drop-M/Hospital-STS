import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { deleteBloodBag } from "@/lib/BloodBagAPI";

export interface BloodBagDTO {
  BloodType: any;
  id: string;
  BloodGroup: string;       // Uppercase first letter as expected by your code
  BloodBagType: string;    // Uppercase first letter as expected by your code
  BloodBagStatus: string;  // Uppercase first letter as expected by your code
  ExpirationDate: string | null;
  AcquiredDate: string | null;
  DonorId: string;
  RequestId: string | null;
}

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Style maps for consistent appearance
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

export const bloodBagColumns = (
  setBloodBags: React.Dispatch<React.SetStateAction<BloodBagDTO[]>>,
  setIsUpdateModalOpen: (open: boolean) => void,
  setSelectedBloodBag: (bloodBag: BloodBagDTO | null) => void,
  fetchGlobalStocks: () => void // Ajouter le paramètre ici
): ColumnDef<BloodBagDTO>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "BloodBagType",
    header: "BloodBagType",
    cell: ({ row }) => {
      const value = row.getValue("BloodBagType");
      // Extract the value if it's an object and cast to string
      const displayValue = typeof value === 'object' && value !== null && 'value' in value 
        ? (value as { value: string }).value 
        : String(value);
        
      const displayText: Record<string, string> = {
        blood: "blood",
        plaquette: "plaquette",
        plasma: "plasma"
      };
      
      return (
        <span className="font-medium text-gray-600">
          {displayText[displayValue as keyof typeof displayText] || displayValue}
        </span>
      );
    },
  },
  {
    accessorKey: "BloodType",
    header: "BloodType",
    cell: ({ row }) => {
      const bloodType = row.getValue("BloodType");
      // Check if bloodType is an object with a value property
      const displayValue = typeof bloodType === 'object' && bloodType !== null && 'value' in bloodType 
        ? bloodType.value 
        : bloodType;
        
      return (
        <Badge className={cn(
          bloodTypeMap[displayValue as keyof typeof bloodTypeMap] || "",
          "font-bold min-w-[60px] justify-center"
        )}>
          {displayValue ? (typeof displayValue === 'object' ? 'N/A' : String(displayValue)) : "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "BloodBagStatus",
    header: "BloodBagStatus",
    cell: (info) => {
      // Extract the value if it's an object
      let status = info.getValue();
      
      // Handle case where status is an object with a value property
      if (status && typeof status === 'object' && 'value' in status) {
        status = (status as { value: string }).value;
      }
      
      if (!status) return <span className="text-gray-500">Undefined</span>;      
      type StatusType = 'aquired' | 'ready' | 'expired' | 'using' | 'outforexpired' | 'out of stock';
      
      const statusConfig = {
        aquired: {
          style: "bg-blue-100 text-blue-800 border-blue-200",
          text: "aquired"
        },
        ready: {
          style: "bg-green-100 text-green-800 border-green-200",
          text: "ready"
        },
        expired: {
          style: "bg-red-100 text-red-800 border-red-200",
          text: "expired"
        },
        using: {
          style: "bg-amber-100 text-amber-800 border-amber-200",
          text: "using"
        },
        outforexpired: {
          style: "bg-yellow-100 text-yellow-800 border-yellow-200",
          text: "outforexpired"
        },
        "out of stock": {
          style: "bg-gray-100 text-gray-600 border-gray-200",
          text: "out of stock"
        }
      };

      const config = statusConfig[status as StatusType] || {
        style: "bg-gray-100 text-gray-800 border-gray-200",
        text: status
      };      return (
        <Badge className={cn(
          config.style,
          "font-semibold min-w-[100px] justify-center"
        )}>
          {typeof config.text === 'object' ? 'N/A' : config.text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "AcquiredDate",
    header: "AcquiredDate",    cell: (info) => {
      const date = info.getValue() as string | null;
      if (!date) return <span className="text-gray-500">-</span>;
        return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
  },
  {
    accessorKey: "ExpirationDate",
    header: "ExpirationDate",
    cell: (info) => {
      const date = info.getValue() as string | null;
      if (!date) return <span className="text-gray-500">-</span>;
      
      const expirationDate = new Date(date);
      const today = new Date();
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let textColor = daysUntilExpiration <= 7 ? "text-red-600" :
                      daysUntilExpiration <= 30 ? "text-orange-500" : 
                      "text-green-600";      const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      return (
        <div className="flex items-center space-x-2">
          <span className={cn("font-medium", textColor)}>
            {formattedDate}
          </span>
          {daysUntilExpiration > 0 && (            <Badge variant="outline" className={cn(
              "text-xs",
              daysUntilExpiration <= 7 ? "border-red-200" :
              daysUntilExpiration <= 30 ? "border-orange-200" :
              "border-green-200"
            )}>
              {daysUntilExpiration} days
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const bloodBag = row.original;

      const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this blood bag?")) {
          try {
            const response = await deleteBloodBag(id);
            if (!response.error) {
              setBloodBags(prev => prev.filter(bag => bag.id !== id));
              fetchGlobalStocks(); // Utiliser la fonction passée en paramètre
              toast({
                title: "Success",
                description: "Blood bag successfully deleted",
              });
            } else {
              throw new Error(response.error);
            }
          } catch (error) {
            console.error("Error deleting blood bag:", error);
            toast({
              title: "Error",
              description: "Failed to delete blood bag",
              variant: "destructive",
            });
          }
        }
      };
      
      const handleUpdate = () => {
        setSelectedBloodBag(bloodBag);
        setIsUpdateModalOpen(true);
      };

      return (
        <DropdownMenu>          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              •••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleUpdate} className="text-blue-600">
              <Edit className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(bloodBag.id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
