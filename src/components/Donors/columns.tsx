"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { deleteDonor } from "@/lib/donors";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Copy } from "lucide-react";
import { format } from "date-fns";

// Define DonorDTO here to avoid circular import
export interface DonorDTO {
  id: string;
  Name: string;
  Email: string;
  BloodType: string;
  Address: string;
  NIN: string;
  NotesBTC?:string;
  PhoneNumber: string;
  DateOfBirth?: string; // Make it optional with ?
  LastDonationDate?: string;
}
export const DonorColumns = (
  setDonors: React.Dispatch<React.SetStateAction<DonorDTO[]>>,
  setIsUpdateModalOpen: (open: boolean) => void,
  setSelectedDonor: (donor: DonorDTO | null) => void
): ColumnDef<DonorDTO>[] => [
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "Email",
    header: "Email",
  },
  {
    accessorKey: "BloodType",
    header: "Blood Type",
    cell: ({ row }) => {
      const bloodType = row.getValue("BloodType") as string;
      return (
        <Badge className="bg-red-100 text-red-600 border-red-200 font-bold min-w-[60px] justify-center">
          {bloodType || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "Address",
    header: "Address",
  },
  {
    accessorKey: "NIN",
    header: "National ID",
  },
  {
    accessorKey: "PhoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "DateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = row.getValue("DateOfBirth") as string;
      return date ? format(new Date(date), "yyyy-MM-dd") : "-"; // Formate la date
    },
  },
  {
    accessorKey: "LastDonationDate",
    header: "Last Donation",
    cell: ({ row }) => {
      const date = row.getValue("LastDonationDate") as string;
      return date ? format(new Date(date), "yyyy-MM-dd") : "No donation yet"; // Formate la date
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      // Get the donor and validate it exists
      const donor = row.original as DonorDTO;
      
      // Immediately check if donor is valid
      if (!donor) {
        console.error("Donor object is undefined in row:", row);
        return <div>Error: Invalid donor data</div>;
      }
      
      // Log the donor object to confirm it has an id
      console.log("Donor object in cell:", donor);
      
      const handleDelete = async (id: string) => {
        // Add validation to ensure ID exists and is a valid string
        if (!id || typeof id !== 'string' || id.trim() === '') {
          console.error("Cannot delete donor with invalid ID:", id);
          toast({
            title: "Error",
            description: "Cannot delete donor: Invalid ID",
            variant: "destructive",
          });
          return;
        }
        
        console.log("Deleting donor with ID:", id);
        if (confirm("Are you sure you want to delete this donor?")) {
          try {
            const result = await deleteDonor(id);

            if (result.success) {
              setDonors((prev) => prev.filter((donor) => donor.id !== id));
              toast({
                title: "Success",
                description: "Donor deleted successfully",
              });
            } else {
              toast({
                title: "Error",
                description: result.errorMessage || "Failed to delete donor",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error("Error deleting donor:", error);
            toast({
              title: "Error",
              description: "An unexpected error occurred while deleting the donor",
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
              <Edit className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                console.log("Donor object:", donor); // Vérifiez l'objet ici
                setSelectedDonor(donor);
                setIsUpdateModalOpen(true); // Ouvre la boîte de dialogue
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            
            {/* Add the new Copy ID option here */}
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(donor.id);
                toast({
                  title: "ID Copied",
                  description: "Donor ID copied to clipboard",
                  duration: 2000,
                });
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => {
                // Get the ID directly and store it in a variable to ensure it doesn't change
                const donorId = donor?.id;
                
                // Log both the donor object and the extracted ID
                console.log("Donor object for deletion:", donor);
                console.log("Donor ID for deletion:", donorId);
                
                // Validate the ID before proceeding
                if (donorId && typeof donorId === 'string' && donorId.trim() !== '') {
                  handleDelete(donorId);
                } else {
                  console.error("Cannot delete: Invalid or undefined donor ID", {
                    donor,
                    id: donorId
                  });
                  toast({
                    title: "Error",
                    description: "Cannot delete donor: Invalid ID",
                    variant: "destructive",
                  });
                }
              }}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];