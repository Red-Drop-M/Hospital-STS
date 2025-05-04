"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"


type BloodType = "+A" | "-A" | "+B" | "-B" | "+AB" | "-AB" | "+O" | "-O";

  
export type Donor = {
    id : string;
    firste_name : string ;
    last_name : string ;
    email : string;
    Blood : BloodType;
    regulier : boolean;
}

export const DonorColumns: ColumnDef<Donor>[] = [
    {
      accessorKey: "firste_name",
      header: "Firste_name",
    },
    {
      accessorKey: "last_name",
      header: "Last_name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
        accessorKey: "Blood",
        header: "Blood",
        cell: ({ row }) => {
          const blood = row.getValue("Blood") as BloodType;
    
          // const getBloodBadgeColor = (blood: BloodType): string => {
          //   switch (blood) {
          //     case "+A":
          //     case "-A":
          //       return "bg-red-500 text-white";
          //     case "+B":
          //     case "-B":
          //       return "bg-blue-500 text-white";
          //     case "+AB":
          //     case "-AB":
          //       return "bg-purple-500 text-white";
          //     case "+O":
          //     case "-O":
          //       return "bg-green-500 text-white";
          //     default:
          //       return "bg-gray-500 text-white";
          //   }
          // };
          const getBloodBadgeColor = (blood: BloodType): string => {
            switch (blood) {
              case "+A":
              case "-A":
                return "bg-red-100 text-red-600";
              case "+B":
              case "-B":
                return "bg-red-100 text-red-600";
              case "+AB":
              case "-AB":
                return "bg-red-100 text-red-600";
              case "+O":
              case "-O":
                return "bg-red-100 text-red-600";
              default:
                return "bg-red-100 text-red-600";
            }
          };
    
          const badgeColor = getBloodBadgeColor(blood);
    
          return (
            <Badge className={badgeColor}>
              {blood}
            </Badge>
        );
      },
    },
    {
      accessorKey: "regulier",
      header: "Regulier",
    },
  ];
  