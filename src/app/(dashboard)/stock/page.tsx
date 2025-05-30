"use client"
import { useState, useEffect } from "react"
import { getAllGlobalStocks } from "@/lib/StockAPI"
import { GlobalStock } from "@/types/GlobalStock"
import { Button } from '@/components/ui/button'
import { toast } from "@/hooks/use-toast"
import { ChevronDown, Filter, Plus } from 'lucide-react';
import GenericTable from "@/components/GeneriComponents/genericTable";
import { bloodBagColumns, BloodBagDTO } from "@/components/BloodBags/Columns";
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
import { getAllBloodBags, createBloodBag, updateBloodBag, deleteBloodBag } from "@/lib/BloodBagAPI";

// Ajoutez cette fonction d'aide pour valider les UUIDs
const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

// Mise à jour du schéma de validation
export const createBloodBagSchema = z.object({
    BloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        required_error: "Blood type is required",
    }),
    BloodBagType: z.enum(["blood", "plaquette", "plasma"], {
        required_error: "Blood bag type is required",
    }),
    BloodBagStatus: z.enum(["acquired", "ready", "expired", "using", "outforexpired", "out of stock"], {//hna
        required_error: "Blood bag status is required",
    }),
    ExpirationDate: z
        .string()
        .optional()
        .nullable()
        .refine(
            (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
            "Invalid date format. Please use YYYY-MM-DD."
        ),
    AquieredDate: z
        .string()
        .optional()
        .nullable()
        .refine(
            (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
            "Invalid date format. Please use YYYY-MM-DD."
        ),
    DonorId: z.string().min(1, "Donor ID is required"),
    RequestId: z.string().optional().nullable(),
});

export const updateBloodBagSchema = z.object({
    BloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        required_error: "Blood type is required",
    }).optional(), // Make it optional for updates
    BloodBagType: z.enum(["blood", "plaquette", "plasma"], {
        required_error: "Blood bag type is required",
    }).optional(), // Make it optional for updates
    BloodBagStatus: z.enum(["acquired", "ready", "expired", "using", "outforexpired", "out of stock"], {//hna
        required_error: "Blood bag status is required",
    }),
    ExpirationDate: z
        .string()
        .optional()
        .nullable()
        .refine(
            (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
            "Invalid date format. Please use YYYY-MM-DD."
        ),
    AquieredDate: z
        .string()
        .optional()
        .nullable()
        .refine(
            (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
            "Invalid date format. Please use YYYY-MM-DD."
        ),
    DonorId: z.string().optional().nullable(),
    RequestId: z.string().optional().nullable(),
});

import type { FormFieldType } from "@/components/GeneriComponents/GenericForm";

export const formFields: FormFieldType[] = [
  {
    name: "BloodType", 
    label: "Blood Type",
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
    name: "BloodBagStatus",
    label: "Blood Bag Status",
    type: "select",
    required: true,
    options: [
      { value: "acquired", label: "Acquired" },//hna
      { value: "ready", label: "Ready" },
      { value: "expired", label: "Expired" },
      { value: "using", label: "In Use" },
      { value: "outforexpired", label: "Out for Expired" },
      { value: "out of stock", label: "Out of Stock" },
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
  const [bloodStocks, setBloodStocks] = useState<GlobalStock[]>([])
  const [paginatedData, setPaginatedData] = useState<BloodBagDTO[]>([])
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedBloodBag, setSelectedBloodBag] = useState<BloodBagDTO | null>(null)
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [test, settest] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedBloodBagType, setSelectedBloodBagType] = useState<string>("blood");
  const [totalCount, setTotalCount] = useState(0);

  // Constants
  const pageSize = 10;

  const pageCount = Math.ceil(length / pageSize);
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
      fetchGlobalStocks();
      fetchBloodBags();
  }, [pageIndex, selectedBloodBagType]); // Ajoutez les dépendances

  const fetchGlobalStocks = async () => {
  try {
      setLoading(true)
      console.log("Fetching stocks...")
      const response = await getAllGlobalStocks()
      console.log("API Response:", response)
      
      if (response.error) {
          console.error("API Error:", response.error)
          throw new Error(response.error)
      }

      // Check if we have data
      if (response.data) {
          console.log("Setting stocks:", response.data)
          
          let stocksData = [];
          
          // Cast response.data to any to allow property access
          const responseData = response.data as any;
          
          // Case 1: response.data is directly an array of stocks
          if (Array.isArray(responseData)) {
              stocksData = responseData;
              console.log("Found direct array of stocks");
          } 
          // Case 2: response.data.globalStocks (lowercase) exists
          else if (responseData.globalStocks && Array.isArray(responseData.globalStocks)) {
              stocksData = responseData.globalStocks;
              console.log("Found globalStocks (lowercase)");
          }
          // Case 3: response.data.GlobalStocks (uppercase) exists
          else if (responseData.GlobalStocks && Array.isArray(responseData.GlobalStocks)) {
              stocksData = responseData.GlobalStocks;
              console.log("Found GlobalStocks (uppercase)");
          }
          // Case 4: Find any array property in response.data
          else {
              console.log("Looking for array properties in response.data");
              // Try to find any array property in the response
              for (const key in response.data) {
                  if (Array.isArray(response.data[key])) {
                      stocksData = response.data[key];
                      console.log(`Found array in property: ${key}`);
                      break;
                  }
              }
          }
          
          // If we found stocks data
          if (stocksData && stocksData.length > 0) {
              // Transform to match your expected structure with capitalized properties
              const transformedStocks = stocksData.map((stock: { bloodType: any; BloodType: any; bloodBagType: any; BloodBagType: any; acquiredCount: any; AcquiredCount: any; countExpired: any; CountExpired: any; countExpiring: any; CountExpiring: any; readyCount: any; minStock: any; MinStock: any; criticalStock: any; CriticalStock: any }) => ({
                  BloodType: stock.bloodType || stock.BloodType || "",
                  BloodBagType: stock.bloodBagType || stock.BloodBagType || "",
                    AcquiredCount: stock.acquiredCount || stock.AcquiredCount || 0,
                  CountExpired: stock.countExpired || stock.CountExpired || 0,
                  CountExpiring: stock.countExpiring || stock.CountExpiring || 0,
                  readyCount: stock.readyCount || 0,  // Minuscule "r"
                  MinStock: stock.minStock || stock.MinStock || 0,
                  CriticalStock: stock.criticalStock || stock.CriticalStock || 0
              }));
              
              console.log("Transformed stocks:", transformedStocks);
              setBloodStocks(transformedStocks)
              setDataLoaded(true)
          } else {
              console.error("No stock data found in API response")
              setBloodStocks([])
          }
      } else {
          console.error("No data in API response")
          setBloodStocks([])
      }
  } catch (error) {
      console.error("Fetch error:", error)
      setError(error instanceof Error ? error.message : 'An error occurred')
  } finally {
      setLoading(false)
  }
}

  const fetchBloodBags = async () => {
    try {
        console.log("Fetching blood bags...");
        setLoading(true);
        
        // Log the request parameters for debugging
        console.log("Request parameters:", {
            page: pageIndex + 1,
            pageSize: pageSize,
            bloodBagType: selectedBloodBagType
        });
        
        console.log(`Fetching page ${pageIndex + 1} of blood bags, type: ${selectedBloodBagType}`);
        const response = await getAllBloodBags({
            page: pageIndex + 1,
            pageSize: pageSize,
            bloodBagType: selectedBloodBagType  // Ajouter ce paramètre
        });

        console.log("Blood bags response:", response);
        
        if (response.data) {
            console.log("Full API response:", response.data);
            
            let bloodBagsArray: any[] = [];
            let total = 0;
            
            // Extract the total count
            if (response.data.total) {
                total = response.data.total;
                console.log("Found total directly in response.data:", total);
            }
            
            // Handle various response structures
            if (Array.isArray(response.data)) {
                // If response.data is directly an array of blood bags
                bloodBagsArray = response.data;
                if (!total) {
                    total = bloodBagsArray.length;
                }
            } else {
                // If response.data is an object that might contain bloodBags
                const responseObj = response.data as any; // Cast to any to handle various structures
                if (responseObj.bloodBags && responseObj.bloodBags.bloodBags && 
                    Array.isArray(responseObj.bloodBags.bloodBags)) {
                    
                    bloodBagsArray = responseObj.bloodBags.bloodBags;
                    if (!total && responseObj.bloodBags.total) {
                        total = responseObj.bloodBags.total;
                    }
                } 
                else if (responseObj.bloodBags && Array.isArray(responseObj.bloodBags)) {
                    bloodBagsArray = responseObj.bloodBags;
                    if (!total) {
                        total = bloodBagsArray.length;
                    }
                }
            }
            
            // Check if we're on the last page and need to limit displayed items
            const totalPages = Math.ceil(total / pageSize);
            const isLastPage = pageIndex === totalPages - 1;
            const remainingItems = total % pageSize;
            
            console.log("Pagination details:", {
                totalItems: total,
                totalPages,
                currentPage: pageIndex + 1,
                isLastPage,
                remainingItems: isLastPage && remainingItems !== 0 ? remainingItems : pageSize
            });
            
            // If we're receiving all data at once (not properly paginated by the server)
            // we need to manually paginate on the client
            setPaginatedData([]); // Au début de fetchBloodBags, vider les données précédentes
            if (bloodBagsArray.length > pageSize || 
                (isLastPage && remainingItems !== 0 && bloodBagsArray.length > remainingItems)) {
                
                console.log("Analyzing if client-side pagination is needed:", {
                    arrayLength: bloodBagsArray.length,
                    pageSize,
                    currentPage: pageIndex + 1,
                    isServerPaginated: bloodBagsArray.length <= pageSize
                });
                
                // N'appliquez la pagination côté client QUE si l'API renvoie toutes les données
                // On peut le détecter si la longueur du tableau est significativement plus grande que pageSize
                if (bloodBagsArray.length > pageSize * 1.5) { // Si l'API renvoie beaucoup plus que pageSize
                    const startIndex = pageIndex * pageSize;
                    const endIndex = Math.min(startIndex + pageSize, bloodBagsArray.length);
                    
                    console.log(`Applying client-side pagination: items ${startIndex} to ${endIndex} from ${bloodBagsArray.length}`);
                    bloodBagsArray = bloodBagsArray.slice(startIndex, endIndex);
                } else {
                    console.log("Using server-paginated data directly");
                }
            }
            
            if (bloodBagsArray && bloodBagsArray.length > 0) {
                const transformedData = [];
                
                for (const bag of bloodBagsArray) {
                    // Debug the structure
                    console.log("Processing bag:", bag);
                    
                    // Safely extract values from possibly nested objects
                    const getNestedValue = (obj: any, key: string) => {
                        if (!obj) return "";
                        // If the property is an object with a value field, return that value
                        if (obj[key] && typeof obj[key] === 'object' && 'value' in obj[key]) {
                            return obj[key].value;
                        }
                        // Otherwise return the direct value
                        return obj[key] || "";
                    };
                    
                    const transformedBag = {
                        id: bag.id,
                        BloodGroup: getNestedValue(bag, 'bloodType'), // Map to BloodGroup as required by BloodBagDTO
                        BloodType: getNestedValue(bag, 'bloodType'),  // Keep BloodType as well if needed elsewhere
                        BloodBagType: getNestedValue(bag, 'bloodBagType'),
                        BloodBagStatus: bag.status || "aquired",
                        ExpirationDate: bag.expirationDate || null,
                        AcquiredDate: bag.acquiredDate || null,
                        DonorId: bag.donorId || "",
                        RequestId: bag.requestId || null
                    };
                    
                    transformedData.push(transformedBag);
                }
                
                setPaginatedData(transformedData);
                setTotalCount(total);
                console.log("Transformed data for current page:", {
                    items: transformedData.length,
                    totalItems: total,
                    currentPage: pageIndex + 1
                });
              console.log("Page index:", pageIndex);
              console.log("Full data received:", bloodBagsArray.length, "items");
              console.log("Final data for display:", paginatedData.length, "items");
            } else {
                setPaginatedData([]);
                setTotalCount(0);
            }
        }
    } catch (error) {
        console.error("Error fetching blood bags:", error);
        setPaginatedData([]);
        setTotalCount(0);
    } finally {
        setLoading(false);
    }
};

  const handleCreate = async (values: BloodBagDTO) => {
      const bloodBagData = {
          BloodType: values.BloodGroup as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-", // Cast to allowed blood types
          BloodBagType: values.BloodBagType as "blood" | "plaquette" | "plasma",
          Status: values.BloodBagStatus,
          ExpirationDate: values.ExpirationDate,
          AcquiredDate: values.AcquiredDate,
          DonorId: values.DonorId,
          RequestId: values.RequestId
      };
      console.log("Creating blood bag with data:", bloodBagData);
      const response = await createBloodBag(bloodBagData);
      if (response.data) {
        // Rafraîchir la liste
        fetchBloodBags();
      }
    };

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
          BloodType: "", // Changed from BloodGroup to BloodType
          BloodBagType: "",
          BloodBagStatus: "acquired", // Default status for new blood bags
          ExpirationDate: null,
          AquieredDate: null,
          DonorId: "",
          RequestId: null,
      };
      
      const handleSubmit = async (values: z.infer<typeof createBloodBagSchema>) => {
    try {
        // Ajoutez un log pour voir ce que contient values
        console.log("Form values:", values);
        
        const newBloodBag = {
            BloodType: values.BloodType,
            BloodBagType: values.BloodBagType as "blood" | "plaquette" | "plasma",
            Status: values.BloodBagStatus, // Assurez-vous que cette propriété existe dans values
            ExpirationDate: values.ExpirationDate?.toString().split('T')[0] || null,
            AcquiredDate: values.AquieredDate?.toString().split('T')[0] || null,
            DonorId: values.DonorId,
            RequestId: values.RequestId || null
        };
        
        console.log("Creating new blood bag:", newBloodBag);
        const response = await createBloodBag(newBloodBag);
        
        if (response.data) {
            fetchBloodBags();
            setOpen(false);
            toast({
                title: "Success",
                description: "Blood bag created successfully",
            });
        }
    } catch (error) {
        console.error("Error creating blood bag:", error);
        toast({
            title: "Error",
            description: "Failed to create blood bag",
            variant: "destructive",
        });
    }
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
                                  submitButtonText="Create Blood Bag"
                                  defaultValues={defaultValues} 
                                />
                              </DialogContent>
                            </Dialog>
              </div>
          </div>
          {test && dataLoaded && bloodStocks && bloodStocks.length > 0 && (
              <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
                  <CardHeader>
                      <CardTitle className="text-xl">Blood Stock Levels</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {bloodStocks
                              .filter(stock => stock && stock.BloodBagType === selectedBloodBagType)
                              .map((stock) => {
                                  // Détermine la couleur basée sur le niveau de stock
                                  let statusColor = "bg-red-500"; // Par défaut rouge
                                  let statusText = "Critical";
                                  
                                  if (stock.readyCount > stock.MinStock) {
                                      statusColor = "bg-green-500";
                                      statusText = "Good";
                                  } else if (stock.readyCount >= stock.MinStock) {
                                      statusColor = "bg-yellow-500";
                                      statusText = "Warning";
                                  } else if (stock.readyCount >stock.CriticalStock){
                                      statusColor = "bg-orange-500";
                                      statusText="7adary";
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
                                                      stock.readyCount > stock.MinStock ? "text-green-600" :
                                                      stock.readyCount > stock.CriticalStock ? "text-yellow-600" :
                                                      "text-red-600"
                                                  }`}>
                                                      {stock.readyCount}  
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
                                                      stock.readyCount > stock.MinStock ? "bg-green-500" :
                                                      stock.readyCount > stock.CriticalStock ? "bg-yellow-500" :
                                                      "bg-red-500"
                                                  } transition-all duration-300`}
                                                  style={{ width: '100%' }}
                                              />
                                          </div>
                                          <span className={`text-sm font-medium ${
                                              stock.readyCount > stock.MinStock ? "text-green-700" :
                                              stock.readyCount > stock.CriticalStock ? "text-yellow-700" :
                                              "text-red-700"
                                          }`}>
                                              {stock.readyCount > stock.MinStock ? "Good" :
                                               stock.readyCount > stock.CriticalStock ? "Warning" :
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

    
    {/* Fallback message when no data */}
    {(!paginatedData || paginatedData.length === 0) && (
        <div className="text-center py-8 text-gray-500">
            No blood bags found. Try changing the filter or adding new blood bags.
        </div>
    )}
    
    {paginatedData && paginatedData.length > 0 && (
        <GenericTable
            columns={bloodBagColumns(
              setPaginatedData, 
              setIsUpdateModalOpen, 
              setSelectedBloodBag,
              fetchGlobalStocks // Ajouter cette fonction ici
            )}
            data={paginatedData}
            pageCount={Math.ceil(totalCount / pageSize)}
            pageIndex={pageIndex}
            onPageChange={setPageIndex}
        />
    )}
</div>
              </CardContent>
          </Card>
          <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Modifier la poche de sang</DialogTitle>
    </DialogHeader>
    {selectedBloodBag && (
      <GenericForm
        formSchema={updateBloodBagSchema}
        fields={formFields}
        onSubmit={async (values) => {
          try {
            // Start with the current values
            const updateRequest = {
              Id: selectedBloodBag.id,
              BloodType: selectedBloodBag.BloodType,
              BloodBagType: selectedBloodBag.BloodBagType,
              Status: selectedBloodBag.BloodBagStatus,
              ExpirationDate: selectedBloodBag.ExpirationDate,
              AcquiredDate: selectedBloodBag.AcquiredDate,
              DonorId: selectedBloodBag.DonorId,
              RequestId: selectedBloodBag.RequestId
            };
            
            // Update with form values - correctly check each field
            if (values.BloodType && values.BloodType !== selectedBloodBag.BloodType) {
              updateRequest.BloodType = values.BloodType;
            }
            
            if (values.BloodBagType && values.BloodBagType !== selectedBloodBag.BloodBagType) {
              updateRequest.BloodBagType = values.BloodBagType as "blood" | "plaquette" | "plasma";
            }
            
            if (values.BloodBagStatus && values.BloodBagStatus !== selectedBloodBag.BloodBagStatus) {
              updateRequest.Status = values.BloodBagStatus;
            }
            
            if (values.ExpirationDate !== selectedBloodBag.ExpirationDate) {
              updateRequest.ExpirationDate = values.ExpirationDate;
            }
            
            if (values.AquieredDate !== selectedBloodBag.AcquiredDate) {
              updateRequest.AcquiredDate = values.AquieredDate;
            }
            
            if (values.DonorId && values.DonorId !== selectedBloodBag.DonorId) {
              updateRequest.DonorId = values.DonorId;
            }
            
            if (values.RequestId !== selectedBloodBag.RequestId) {
              updateRequest.RequestId = values.RequestId;
            }
            
            console.log("Update request:", updateRequest);
            const response = await updateBloodBag(selectedBloodBag.id, updateRequest);
            
            if (response.data) {
              fetchBloodBags();
              fetchGlobalStocks(); // Ajoutez cette ligne
              setIsUpdateModalOpen(false);
              toast({
                title: "Success",
                description: "Blood bag updated successfully",
              });
            }
          } catch (error) {
            console.error("Error updating blood bag:", error);
            toast({
              title: "Error",
              description: "Failed to update blood bag",
              variant: "destructive",
            });
          }
        }}
        submitButtonText="Update Blood Bag"
        defaultValues={{
          // Assurez-vous que toutes les valeurs sont du type attendu par le schéma
          id: selectedBloodBag.id,
          BloodType: selectedBloodBag.BloodType,
          BloodBagType: selectedBloodBag.BloodBagType,
          // Assurez-vous que BloodBagStatus est une chaîne qui correspond exactement à une des options du select
          BloodBagStatus: selectedBloodBag.BloodBagStatus || "aquired",
          ExpirationDate: selectedBloodBag.ExpirationDate,
          AquieredDate: selectedBloodBag.AcquiredDate,
          DonorId: selectedBloodBag.DonorId,
          RequestId: selectedBloodBag.RequestId
        }}
      />
    )}
  </DialogContent>
</Dialog>
    </main>
  )
}