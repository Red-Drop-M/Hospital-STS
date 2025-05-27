"use client"
import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { getRequests, createRequest , BloodType,Priority,RequestStatus, BloodBagType, updateRequest
 } from "@/lib/ReqAPI"
import GenericTable from "@/components/GeneriComponents/genericTable"
import { columns } from "@/components/requests/columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Filter, ChevronUp, ChevronDown, CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"



// Updated schema to match API interface
const createRequestSchema = z.object({
  bloodType: z.string().min(1, "Blood type is required"),
  bloodBagType: z.string().min(1, "Blood bag type is required"),
  priority: z.enum(["critical", "standard", "low"], {
    required_error: "Priority is required",
  }),
  requestDate: z.date({
    required_error: "Request date is required",
  }),
  requiredQty: z.number().min(1, "Required quantity must be at least 1"),
  status: z.enum(["pending", "resolved", "partial", "cancled", "rejected"], {
    required_error: "Status is required",
  }).optional(),
  dueDate: z.date().optional(),
  aquiredQty: z.number().min(0, "Quantity must be positive").optional(),
  moreDetails: z.string().optional(),
  serviceId: z.string().optional(),
  donorId: z.string().optional(),
});


  
// export type RequestStatus = "pending" | "resolved" | "partial" | "cancled" | "rejected";

type Filters = {
  bloodType?: BloodType;
  priority?: "critical" | "standard" | "low"; // Correspond aux valeurs de l'API
  status?: "pending" | "resolved" | "partial"; // Correspond aux valeurs de l'API
  searchQuery?: string;
};

type FormData = z.infer<typeof createRequestSchema>;

type Request = {
  id: string;
  bloodType: string;
  bloodBagType: string;
  priority: "critical" | "standard" | "low";
  status: "pending" | "resolved" | "partial" | "cancled" | "rejected";
  requestDate: string;
  dueDate?: string;
  requiredQty: number;
  aquiredQty: number;
  moreDetails?: string;
  serviceId?: string;
  donorId?: string;
};

const statusMap = {
  pending: 'Pending',
  resolved: 'Resolved',
  partial: 'Partial',
  cancled: 'Canceled',
  rejected: 'Rejected',
};

export default function Requests() {

  const [open, setOpen] = useState(false)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [filters, setFilters] = useState<Filters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [totalCount, setTotalCount] = useState(0) // Add this line
  const { toast } = useToast()
  const pageSize = 10;

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  // Form configuration
  const form = useForm<FormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      bloodType: "",
      bloodBagType: "",
      priority: "standard",
      status: "pending",
      aquiredQty: 0,
      requiredQty: 1,
      requestDate: new Date(),
      dueDate: undefined,
      moreDetails: "",
      serviceId: "",
      donorId: "",
    },
  })

  // Créez un deuxième formulaire pour la mise à jour
  const updateForm = useForm<FormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      bloodType: "",
      bloodBagType: "",
      priority: "standard",
      status: "pending",
      aquiredQty: 0,
      requiredQty: 1,
      requestDate: new Date(),
      dueDate: undefined,
      moreDetails: "",
      serviceId: "",
      donorId: "",
    },
  });
  ////
  useEffect(() => {
  if (selectedRequest) {
    updateForm.reset({
      bloodType: selectedRequest.bloodType,
      bloodBagType: selectedRequest.bloodBagType,
      priority: selectedRequest.priority,
      status: selectedRequest.status,
      requestDate: new Date(selectedRequest.requestDate),
      dueDate: selectedRequest.dueDate ? new Date(selectedRequest.dueDate) : undefined,
      requiredQty: selectedRequest.requiredQty,
      aquiredQty: selectedRequest.aquiredQty,
      moreDetails: selectedRequest.moreDetails || "",
      serviceId: selectedRequest.serviceId || "",
      donorId: selectedRequest.donorId || "",
    });
  }
}, [selectedRequest, updateForm]);
  // Load requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams({
          Page: (pageIndex + 1).toString(),
          PageSize: pageSize.toString(),
          BloodType: filters.bloodType || "",
          Priority: filters.priority || "",
          Status: filters.status || "",
          searchQuery: filters.searchQuery || "",
        });

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
        const url = `http://localhost:5000/bloodrequests?${query}`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        });

        if (!response.ok) {
          console.error("Fetch failed with status:", response.status);
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const transformedData = data.requests.map((request: any) => ({
          id: request.id,
          bloodType: request.bloodType,
          bloodBagType: request.bloodBagType,
          priority: request.priority,
          status: request.status,  // Note this transformation!
          requestDate: request.requestDate,
          dueDate: request.dueDate,
          requiredQty: request.requiredQty,
          aquiredQty: request.aquiredQty,
          moreDetails: request.moreDetails,
          serviceId: request.serviceId,
          donorId: request.donorId,
        }))
        .sort((a: Request, b: Request) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()); // Tri par date décroissante
        console.log("Transformed data:", transformedData);
        setRequests(transformedData);
        setTotalCount(data.total || 0); // Store the total count from API
   
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRequests()
  }, [pageIndex, pageSize, filters, toast])

  const handleSubmit = async (values: FormData) => {
  try {
    setSubmitLoading(true);

    // const requestData = {

    //   bloodType: values.bloodType as BloodType,
    //   bloodBagType: values.bloodBagType as BloodBagType,
    //   priority: values.priority,
    //   status: values.status || "pending",
    //   requestStatus: values.status || "pending",
    //   requestDate: values.requestDate.toISOString(),
    //   dueDate: values.dueDate?.toISOString() || null,
    //   requiredQty: values.requiredQty,
    //   aquiredQty: values.aquiredQty || 0,
    //   moreDetails: values.moreDetails || "",
    //   serviceId: values.serviceId || "",
    //   donorId: values.donorId || "",
    // };

    // const newRequest = await createRequest(requestData);
    const requestData = {

      bloodType: values.bloodType as BloodType,
      bloodBagType: values.bloodBagType as BloodBagType,
      priority: values.priority,
      status: values.status || "pending",
      requestStatus: values.status || "pending",
      requestDate: values.requestDate.toISOString(),
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      requiredQty: values.requiredQty,
      aquiredQty: values.aquiredQty || 0,
      moreDetails: values.moreDetails || "",
      serviceId: values.serviceId || "",
      donorId: values.donorId || "",
    };
    console.log("Sending request data:", requestData); // Pour le débogage

    const newRequest = await createRequest(requestData);

    // Mettre à jour l'état local avec la nouvelle requête
    setRequests((prev) => {
      const updatedRequests = [newRequest, ...prev];
      return updatedRequests.sort(
        (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
    });

    toast({
      title: "Success",
      description: "Request created successfully",
    });

    setOpen(false);
    form.reset();
  } catch (error) {
    console.error("Create error:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create request",
      variant: "destructive",
    });
  } finally {
    setSubmitLoading(false);
  }
};
  // Filter data
  const filteredData = requests.filter((request) => {
    // Filtrer par statut
    if (filters.status && request.status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }

    // Autres filtres (groupe sanguin, priorité, etc.)
    if (filters.bloodType && request.bloodType.toLowerCase() !== filters.bloodType.toLowerCase()) {
      return false;
    }

    if (filters.priority && request.priority !== filters.priority) {
      return false;
    }

    // Filtrer par recherche
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return (
        request.bloodType.toLowerCase().includes(searchLower) ||
        request.id.toLowerCase().includes(searchLower) ||
        (request.moreDetails && request.moreDetails.toLowerCase().includes(searchLower))
      );
    }

    return true;
  })

  const paginatedData = filteredData;
  const pageCount = Math.ceil(totalCount / pageSize);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(0)
  }

  const resetFilters = () => {
    setFilters({});
    setPageIndex(0);
  }

  const handleUpdate = async (values: FormData) => {
  try {
    if (!selectedRequest) return;

    const requestData = {
      bloodType: values.bloodType as BloodType,
      bloodBagType: values.bloodBagType as BloodBagType,
      priority: values.priority,
      status: values.status,
      requestDate: values.requestDate.toISOString(),
      dueDate: values.dueDate?.toISOString(),
      requiredQty: values.requiredQty,
      aquiredQty: values.aquiredQty,
      moreDetails: values.moreDetails,
      serviceId: values.serviceId,
      donorId: values.donorId,
    };

    const updatedRequest = await updateRequest(selectedRequest.id, requestData);
    console.log("API response:", updatedRequest); // Debug output

    // Fixed update logic with fallbacks
    setRequests((prev) =>
      prev.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request, // Use existing request as base
              ...updatedRequest, // Apply updates that exist
              requestDate: updatedRequest?.requestDate || request.requestDate,
              dueDate: updatedRequest?.dueDate || request.dueDate,
            }
          : request
      )
    );

    toast({
      title: "Success",
      description: "Request updated successfully",
    });

    setIsUpdateModalOpen(false);
    setSelectedRequest(null);
    updateForm.reset();
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update request",
      variant: "destructive",
    });
  }
};

  return (
    <main className="w-full space-y-10 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl tracking-tight">Blood Requests</h1>
        <div className="flex items-center gap-2">
          <Dialog modal={false} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-red-900 hover:bg-red-800">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline-block">New Request</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Blood Request</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Blood Type */}
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Blood Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Blood Bag Type */}
                    <FormField
                      control={form.control}
                      name="bloodBagType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Blood Bag Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bag type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="blood">Blood</SelectItem>
                              <SelectItem value="plasma">Plasma</SelectItem>
                              <SelectItem value="plaquette">Plaquette</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Priority */}
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Priority <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="critical">Critical</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Status <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="cancled">Canceled</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Required Quantity */}
                    <FormField
                      control={form.control}
                      name="requiredQty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Required Quantity <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              placeholder="Enter required quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Acquired Quantity */}
                    <FormField
                      control={form.control}
                      name="aquiredQty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acquired Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              placeholder="Enter acquired quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Request Date */}
                    <FormField
                      control={form.control}
                      name="requestDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            Request Date <span className="text-red-500">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Select date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date)
                                  }
                                }}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                                defaultMonth={field.value}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Due Date */}
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Select date (optional)</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" side="top" onOpenAutoFocus={(e) => e.preventDefault()}>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date)
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                defaultMonth={field.value || new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Service ID */}
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter service ID (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Donor ID */}
                  <FormField
                    control={form.control}
                    name="donorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donor ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter donor ID (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* More Details */}
                  <FormField
                    control={form.control}
                    name="moreDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter any additional information (optional)" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={submitLoading}>
                    {submitLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      "Create Request"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* 2eme dialog */}
              <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Update Blood Request</DialogTitle>
                  </DialogHeader>
                  <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Blood Type */}
                    <FormField
                      control={updateForm.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Blood Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Blood Bag Type */}
                    <FormField
                      control={updateForm.control}
                      name="bloodBagType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Blood Bag Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bag type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="blood">Blood</SelectItem>
                              <SelectItem value="plasma">Plasma</SelectItem>
                              <SelectItem value="plaquette">Plaquette</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Priority */}
                    <FormField
                      control={updateForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Priority <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="critical">Critical</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Status */}
                    <FormField
                      control={updateForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Status <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="cancled">Canceled</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Required Quantity */}
                    <FormField
                      control={updateForm.control}
                      name="requiredQty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Required Quantity <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              placeholder="Enter required quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Acquired Quantity */}
                    <FormField
                      control={updateForm.control}
                      name="aquiredQty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acquired Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              placeholder="Enter acquired quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Request Date */}
                    <FormField
                      control={updateForm.control}
                      name="requestDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            Request Date <span className="text-red-500">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Select date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date)
                                  }
                                }}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                                defaultMonth={field.value}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Due Date */}
                    <FormField
                      control={updateForm.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Select date (optional)</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" side="top" onOpenAutoFocus={(e) => e.preventDefault()}>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date)
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                defaultMonth={field.value || new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Service ID */}
                  <FormField
                    control={updateForm.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter service ID (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Donor ID */}
                  <FormField
                    control={updateForm.control}
                    name="donorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donor ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter donor ID (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* More Details */}
                  <FormField
                    control={updateForm.control}
                    name="moreDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter any additional information (optional)" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Update Request
                 </Button>
                  </form>
                  </Form>
                </DialogContent>
              </Dialog>
        </div>
      </div>

      <Card className="hover:border-red-900 transition-colors duration-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Requests Table</CardTitle>
            <Button variant="ghost" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters</span>
              {showFilters ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search requests..."
              className="w-full md:w-[300px]"
              value={filters.searchQuery || ""}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            />
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <Select onValueChange={(value) => handleFilterChange("bloodType", value)} value={filters.bloodType || ""}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Blood Type" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                    <SelectItem key={type} value={type}>
                      <Badge className="bg-red-100 text-red-600">{type}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange("priority", value)} value={filters.priority || ""}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange("status", value)} value={filters.status || ""}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="cancled">Canceled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" onClick={resetFilters} className="text-red-600 hover:text-red-800">
                Reset Filters
              </Button>
            </div>
          )}

          {loading && <p>Loading...</p>}
          {!loading && requests.length === 0 && (
            <p>No requests found.</p>
          )}
          {!loading && requests.length > 0 && (
            <>
            {console.log("Data before table render:", requests)}
            <GenericTable
              columns={columns(setRequests, setIsUpdateModalOpen, setSelectedRequest)}
              data={paginatedData}
              pageCount={pageCount}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
            />
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
