"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { deleteDonor } from "@/lib/donors";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { format } from "date-fns";

// Define DonorDTO here to avoid circular import
export interface DonorDTO {
  id: string;
  Name: string;
  Email: string;
  BloodType: string;
  Address: string;
  NIN: string;
  PhoneNumber: string;
  DateOfBirth: string;
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
      const donor = row.original as DonorDTO;

      const handleDelete = async (id: string) => {
        console.log("Deleting donor with ID:", id); // Vérifiez l'ID ici
        if (confirm("Are you sure you want to delete this donor?")) {
          try {
            const success = await deleteDonor(id);

            if (success) {
              setDonors((prev) => prev.filter((donor) => donor.id !== id));
              toast({
                title: "Success",
                description: "Donor deleted successfully",
              });
            } else {
              toast({
                title: "Error",
                description: "Failed to delete donor",
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
            <DropdownMenuItem
              onClick={() => {
                console.log("Donor object:", donor); // Vérifiez l'objet ici
                handleDelete(donor.id);
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