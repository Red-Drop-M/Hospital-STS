"use client"
import { useState, useEffect } from "react"
import { getAllGlobalStocks } from "@/lib/StockAPI"
import { GlobalStock } from "@/types/GlobalStock"
import { Button } from '@/components/ui/button'
import { ChevronDown, Filter, Plus } from 'lucide-react';
import GenericTable from "@/components/GeneriComponents/genericTable";
import { bloodBagColumns } from "@/components/BloodBags/Columns";
import { mockBloodBags, getMockBloodBags } from "@/components/BloodBags/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { z } from "zod";
import { GenericForm } from '@/components/GeneriComponents/GenericForm';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const createBloodBagSchema = z.object({
  BloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood group is required",
  }),
  BloodBagType: z.enum(["blood", "plaquette", "plasma"], {
    required_error: "Blood bag type is required",
  }),
  ExpirationDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Invalid date format. Please use YYYY-MM-DD."
    )
    .transform((value) => (value ? new Date(value) : null)),
  AquieredDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Invalid date format. Please use YYYY-MM-DD."
    )
    .transform((value) => (value ? new Date(value) : null)),
  DonorId: z.string().uuid({ message: "Invalid Donor ID" }),
  RequestId: z.string().uuid().optional().nullable(),
});

import type { FormFieldType } from "@/components/GeneriComponents/GenericForm";

export const formFields: FormFieldType[] = [
  {
    name: "BloodGroup",
    label: "Blood Group",
    type: "select",
    required: true,
    options: [
      { value: "A+", label: "A+" },
      { value: "A-", label: "A-" },
      { value: "B+", label: "B+" },
      { value: "B-", label: "B-" },
      { value: "AB+", label: "AB+" },
      { value: "AB-", label: "AB-" },
      { value: "O+", label: "O+" },
      { value: "O-", label: "O-" },
    ],
  },
  {
    name: "BloodBagType",
    label: "Blood Bag Type",
    type: "select",
    required: true,
    options: [
      { value: "blood", label: "Blood" },
      { value: "plaquette", label: "Plaquette" },
      { value: "plasma", label: "Plasma" },
    ],
  },
  {
    name: "ExpirationDate",
    label: "Expiration Date",
    type: "text",
    placeholder: "YYYY-MM-DD",
    description: "Leave empty if no expiration date",
  },
  {
    name: "AquieredDate",
    label: "Acquired Date",
    type: "text",
    placeholder: "YYYY-MM-DD",
    description: "Leave empty if no acquired date",
  },
  {
    name: "DonorId",
    label: "Donor ID",
    type: "text",
    required: true,
    placeholder: "Enter Donor ID (UUID format)",
  },
  {
    name: "RequestId",
    label: "Request ID",
    type: "text",
    placeholder: "Enter Request ID (UUID format, optional)",
  },
];

export default function Stock() {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bloodStocks, setBloodStocks] = useState<GlobalStock[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [test, settest] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedBloodBagType, setSelectedBloodBagType] = useState<string>("blood");

    // Constants
    const pageSize = 10;
    const allData = mockBloodBags;
    const pageCount = Math.ceil(allData.length / pageSize);
    const paginatedData = allData.slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize
    );
    // const bloodStocks = [ 
    //     {type:"A+" , stock:78 , critical:20},
    //     {type:"A-" , stock:62 , critical:23},
    //     {type:"B+" , stock:98 , critical:15},
    //     {type:"B-" , stock: 54, critical:15},
    //     {type:"AB+" , stock:28 , critical:20},
    //     {type:"AB-" , stock:71 , critical:20},
    //     {type:"O+" , stock:65 , critical:30},
    //     {type:"O-" , stock:83 , critical:30},
    // ];

    useEffect(() => {
        fetchGlobalStocks()
    }, [])

    const fetchGlobalStocks = async () => {
    try {
        setLoading(true)
        console.log("Fetching stocks...")
        const response = await getAllGlobalStocks()  // Retirez "blood" car ce n'est pas nécessaire ici
        console.log("API Response:", response)
        
        if (response.error) {
            console.error("API Error:", response.error)
            throw new Error(response.error)
        }

        if (response.data && response.data.length > 0) {
            console.log("Setting stocks:", response.data)
            setBloodStocks(response.data)
            setDataLoaded(true)
        } else {
            console.log("No stocks data received")
            setError("No stocks data available")
        }
    } catch (error) {
        console.error("Fetch error:", error)
        setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
        setLoading(false)
    }
}

    const getProgressColor = (readyCount: number, criticalStock: number) => {
        if (readyCount < criticalStock) {
            return "bg-red-600"
        } else if (readyCount < criticalStock * 2) {
            return "bg-yellow-500"
        }
        return "bg-green-500"
    }

    const getStockStatus = (readyCount: number, minStock: number, criticalStock: number) => {
        const percentage = (readyCount / minStock) * 100;
        
        if (readyCount <= criticalStock) {
            return {
                color: "bg-red-500",
                status: "Critical",
                textColor: "text-red-700",
                percentage
            };
        } else if (readyCount <= minStock) {
            return {
                color: "bg-yellow-500",
                status: "Warning",
                textColor: "text-yellow-700",
                percentage
            };
        } else {
            return {
                color: "bg-green-500",
                status: "Good",
                textColor: "text-green-700",
                percentage
            };
        }
    };

    if (loading) {
        return <div>Loading stocks...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }
     

         const defaultValues = {
            BloodGroup: "",
            BloodBagType: "",
            ExpirationDate: null,
            AquieredDate: null,
            DonorId: "",
            RequestId: null,
        };
        
        const handleSubmit = async (values: z.infer<typeof createBloodBagSchema>) => {
            console.log("Form submitted with values:", values);
            // Ajoutez ici la logique pour envoyer les données au backend
        };
        
    return (
        <main className="w-full space-y-10 p-4 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">CTS Stock</h1> 
                <div className="flex items-center gap-2">
                    <Select
                        value={selectedBloodBagType}
                        onValueChange={setSelectedBloodBagType}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="blood">Blood</SelectItem>
                            <SelectItem value="plasma">Plasma</SelectItem>
                            <SelectItem value="plaquette">Plaquette</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button 
                        className="gap-1 bg-red-900 hover:bg-red-800"
                        onClick={() => {
                        settest(!test); // Ferme l'autre carte si ouverte
                        }}
                        >
                        <ChevronDown className="h-4 w-4" />
                        <span className="hidden sm:inline-block">Show Blood</span>
                </Button>
                    <Dialog modal={false} open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                  <Button className="gap-1 bg-red-900 hover:bg-red-800">
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden sm:inline-block">Add BloodBag</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Register New Donor</DialogTitle>
                                  </DialogHeader>
                                  <GenericForm
                                    formSchema={createBloodBagSchema}
                                    fields={formFields}
                                    onSubmit={handleSubmit}
                                    submitButtonText="Register Donor"
                                    defaultValues={defaultValues} 
                                  />
                                </DialogContent>
                              </Dialog>
                </div>
            </div>
            {test && dataLoaded && bloodStocks.length > 0 && (
                <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl">Blood Stock Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bloodStocks
                                .filter(stock => stock.BloodBagType === selectedBloodBagType)
                                .map((stock) => {
                                    // Détermine la couleur basée sur le niveau de stock
                                    let statusColor = "bg-red-500"; // Par défaut rouge
                                    let statusText = "Critical";
                                    
                                    if (stock.ReadyCount > stock.MinStock) {
                                        statusColor = "bg-green-500";
                                        statusText = "Good";
                                    } else if (stock.ReadyCount > stock.CriticalStock) {
                                        statusColor = "bg-yellow-500";
                                        statusText = "Warning";
                                    }
                                    
                                    return (
                                        <div
                                            key={`${stock.BloodType}-${stock.BloodBagType}`}
                                            className="bg-white rounded-lg border p-4 space-y-4"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold">
                                                    {stock.BloodType}
                                                </h3>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Current Stock:</span>
                                                    <span className={`font-medium ${
                                                        stock.ReadyCount > stock.MinStock ? "text-green-600" :
                                                        stock.ReadyCount > stock.CriticalStock ? "text-yellow-600" :
                                                        "text-red-600"
                                                    }`}>
                                                        {stock.ReadyCount}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Critical Level:</span>
                                                    <span className="font-medium text-red-600">
                                                        {stock.CriticalStock}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Min Stock:</span>
                                                    <span className="font-medium text-yellow-600">
                                                        {stock.MinStock}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${
                                                        stock.ReadyCount > stock.MinStock ? "bg-green-500" :
                                                        stock.ReadyCount > stock.CriticalStock ? "bg-yellow-500" :
                                                        "bg-red-500"
                                                    } transition-all duration-300`}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <span className={`text-sm font-medium ${
                                                stock.ReadyCount > stock.MinStock ? "text-green-700" :
                                                stock.ReadyCount > stock.CriticalStock ? "text-yellow-700" :
                                                "text-red-700"
                                            }`}>
                                                {stock.ReadyCount > stock.MinStock ? "Good" :
                                                 stock.ReadyCount > stock.CriticalStock ? "Warning" :
                                                 "Critical"}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </CardContent>
                </Card>
            )}
            <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Blood Bag Table</CardTitle>
                    <Button 
                      variant="ghost" 
                    //   onClick={toggleFilters}
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Filters</span>
                      {/* {showFilters ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )} */}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full mt-4">
                        <GenericTable
                            columns={bloodBagColumns}
                            data={paginatedData}
                            pageCount={pageCount}
                            pageIndex={pageIndex}
                            onPageChange={setPageIndex}
                        />
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}