"use client"
import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { getRequests, createRequest } from "@/lib/reqAPI"
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

type Filters = {
  bloodType?: string
  priority?: string
  status?: string
  searchQuery?: string
}

// Schéma de validation pour la création
const createRequestSchema = z.object({
  BloodType: z.string().min(1, "Blood type is required"),
  BloodBagType: z.string().min(1, "Blood bag type is required"),
  Priority: z.string().min(1, "Priority is required"),
  DueDate: z.date().optional(),
  MoreDetails: z.string().optional(),
  ServiceId: z.string().optional(),
  DonorId: z.string().optional(),
  RequestStatus: z.string().min(1, "Status is required"),
  RequestDate: z.date({
    required_error: "Request date is required",
  }),
  AquiredQty: z.number().min(0, "Quantity must be positive"),
  RequiredQty: z.number().min(1, "Required quantity must be at least 1"),
})

type FormData = z.infer<typeof createRequestSchema>

export default function Requests() {
  const [open, setOpen] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [filters, setFilters] = useState<Filters>({})
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()
  const pageSize = 10

  // Configuration du formulaire avec react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      BloodType: "",
      BloodBagType: "",
      Priority: "",
      RequestStatus: "",
      AquiredQty: 0,
      RequiredQty: 1,
      RequestDate: new Date(),
      DueDate: undefined,
      MoreDetails: "",
      ServiceId: "",
      DonorId: "",
    },
  })

  // Chargement des requêtes
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log("Fetching with filters:", filters)
        setLoading(true)

        // Correct priority mapping
        let priorityValue
        if (filters.priority === "High") priorityValue = "critical"
        else if (filters.priority === "Medium") priorityValue = "standard"
        else if (filters.priority === "Low") priorityValue = "low"

        const { requests } = await getRequests({
          Page: pageIndex + 1,
          PageSize: pageSize,
          BloodType: filters.bloodType,
          Priority: priorityValue,
          Status: filters.status?.toLowerCase(),
        })
        setRequests(requests)
      } catch (error) {
        console.error("Fetch error:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load requests",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [pageIndex, pageSize, filters, toast])

  const handleSubmit = async (values: FormData) => {
    try {
      setSubmitLoading(true)
      const newRequest = await createRequest({
        ...values,
        dueDate: values.DueDate?.toISOString().split("T")[0],
        requestDate: values.RequestDate.toISOString().split("T")[0],
        status: values.RequestStatus as "pending" | "resolved" | "partial",
      })

      setRequests((prev) => [newRequest, ...prev])
      toast({
        title: "Success",
        description: "Request created successfully",
      })
      setOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create request",
        variant: "destructive",
      })
    } finally {
      setSubmitLoading(false)
    }
  }

  // Filtrage des données
  const filteredData = requests.filter((request: any) => {
    if (filters.bloodType && request.bloodType !== filters.bloodType) return false
    if (filters.priority) {
      const requestPriority =
        request.priority === "critical" ? "High" : request.priority === "standard" ? "Medium" : "Low"
      if (requestPriority !== filters.priority) return false
    }
    if (filters.status) {
      const requestStatus = request.status.charAt(0).toUpperCase() + request.status.slice(1)
      if (requestStatus !== filters.status) return false
    }
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase()
      return request.bloodType.toLowerCase().includes(searchLower) || request.id.toLowerCase().includes(searchLower)
    }
    return true
  })

  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(filteredData.length / pageSize)

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(0)
  }

  const resetFilters = () => {
    setFilters({})
    setPageIndex(0)
  }

  return (
    <main className="w-full space-y-10 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl tracking-tight">Blood Requests</h1>
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
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

              {/* Formulaire intégré directement */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Blood Type */}
                    <FormField
                      control={form.control}
                      name="BloodType"
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
                      name="BloodBagType"
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
                      name="Priority"
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
                      name="RequestStatus"
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
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Required Quantity */}
                    <FormField
                      control={form.control}
                      name="RequiredQty"
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
                      name="AquiredQty"
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
                      name="RequestDate"
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
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Sélectionner une date</span>}
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
                      name="DueDate"
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
                                    <span>Sélectionner une date (optionnel)</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
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
                    name="ServiceId"
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
                    name="DonorId"
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
                    name="MoreDetails"
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
                  <SelectItem value="Low">
                    <Badge className="bg-gray-100 text-gray-600">Low</Badge>
                  </SelectItem>
                  <SelectItem value="Medium">
                    <Badge className="bg-yellow-100 text-yellow-600">Medium</Badge>
                  </SelectItem>
                  <SelectItem value="High">
                    <Badge className="bg-red-100 text-red-600">High</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange("status", value)} value={filters.status || ""}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">
                    <Badge className="bg-gray-100 text-gray-600">Pending</Badge>
                  </SelectItem>
                  <SelectItem value="Resolved">
                    <Badge className="bg-blue-100 text-blue-600">Resolved</Badge>
                  </SelectItem>
                  <SelectItem value="Partial">
                    <Badge className="bg-green-100 text-green-600">Partial</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" onClick={resetFilters} className="text-red-600 hover:text-red-800">
                Reset Filters
              </Button>
            </div>
          )}

          <GenericTable
            columns={columns}
            data={paginatedData}
            pageCount={pageCount}
            pageIndex={pageIndex}
            onPageChange={setPageIndex}
          />
        </CardContent>
      </Card>
    </main>
  )
}
