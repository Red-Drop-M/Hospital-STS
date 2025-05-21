"use client"
import { useState } from "react"
import { z } from "zod";
import GenericTable from "@/components/GeneriComponents/genericTable"
import { columns, BloodRequest } from "@/components/requests/columns"
import { bloodRequests } from "@/components/requests/data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Filter, ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import{FormFieldType} from '@/components/GeneriComponents/GenericForm'

import  {GenericForm}  from "@/components/GeneriComponents/GenericForm";
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
type Priority = 'Low' | 'Medium' | 'High'
type Status = 'Pending' | 'Approved' | 'Rejected' | 'Completed'

type Filters = {
  bloodType?: BloodType | ''
  priority?: Priority | ''
  status?: Status | ''
  doctor?: string
  department?: string
  searchQuery?: string
}

export default function Requests() {
  const [open, setOpen] = useState(false);

  const createRequestSchema = z.object({
  BloodType: z.string().min(1, "Blood type is required"),
  BloodBagType: z.string().min(1, "Blood bag type is required"),
  Priority: z.string().min(1, "Priority is required"),
  DueDate: z.date().optional().nullable(),
  MoreDetails: z.string().optional(),
  ServiceId: z.string().optional().nullable(),
  DonorId: z.string().optional().nullable(),
  RequestStatus: z.string().min(1, "Status is required"),
  RequestDate: z.date().optional().nullable(),
  AquiredQty: z.number().min(0, "Quantity must be positive"),
  RequiredQty: z.number().min(1, "Required quantity must be at least 1"),
  });

  const formFields: FormFieldType[] = [
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
        { value: "Blood", label: "Blood" },
        { value: "Plasma", label: "Plasma" },
        { value: "Plaquette", label: "Plaquette" },
      ],
    },
    {
      name: "Priority",
      label: "Priority",
      type: "select",
      required: true,
      options: [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
      ],
    },
    {
      name: "DueDate",
      label: "Due Date",
      type: "date",
      placeholder: "Select a due date",
    },
    {
      name: "MoreDetails",
      label: "Additional Details",
      type: "textarea",
      placeholder: "Enter any additional information",
    },
    {
      name: "RequestStatus",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Completed", label: "Completed" },
        { value: "Canceled", label: "Canceled" },
      ],
    },
    {
      name: "RequestDate",
      label: "Request Date",
      type: "date",
      placeholder: "Select request date",
      required: true,
    },
    {
      name: "AquiredQty",
      label: "Acquired Quantity",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "RequiredQty",
      label: "Required Quantity",
      type: "number",
      required: true,
      defaultValue: 1,
    },
  ];

  const handleSubmit = (values: z.infer<typeof createRequestSchema>) => {
    console.log(values);
    // Ici vous ajouterez votre logique pour envoyer les données au backend
    setOpen(false); // ferme le dialogue après soumission
  };


  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    bloodType: '',
    priority: '',
    status: '',
    doctor: '',
    department: '',
    searchQuery: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  const filterRequests = (): BloodRequest[] => {
    return bloodRequests.filter(request => {
      if (filters.bloodType && request.bloodType !== filters.bloodType) {
        return false
      }
      
      if (filters.priority && request.priority !== filters.priority) {
        return false
      }
      
      if (filters.status && request.status !== filters.status) {
        return false
      }
      
      if (filters.doctor && !request.doctor.toLowerCase().includes(filters.doctor.toLowerCase())) {
        return false
      }
      
      if (filters.department && !request.department.toLowerCase().includes(filters.department.toLowerCase())) {
        return false
      }
      
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase()
        return (
          request.requestId.toLowerCase().includes(searchLower) ||
          request.doctor.toLowerCase().includes(searchLower) ||
          request.department.toLowerCase().includes(searchLower) ||
          request.bloodType.toLowerCase().includes(searchLower)
        )
      }
      
      return true
    })
  }

  const filteredData = filterRequests()
  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(filteredData.length / pageSize)

  const handleFilterChange = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPageIndex(0)
  }

  const resetFilters = () => {
    setFilters({
      bloodType: '',
      priority: '',
      status: '',
      doctor: '',
      department: '',
      searchQuery: ''
    })
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <main className="w-full space-y-10 p-4 md:p-8">
      <div className="flex justify-between items-center">
      <h1 className="font-bold text-3xl tracking-tight">CTS Requests</h1>
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
            <GenericForm
              formSchema={createRequestSchema}
              fields={formFields}
              onSubmit={handleSubmit}
              submitButtonText="Create Request"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>

      <Card className="hover:border-red-900 transition-colors duration-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Requests Table</CardTitle>
            <Button 
              variant="ghost" 
              onClick={toggleFilters}
              className="flex items-center gap-2"
            >
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
          {/* Barre de recherche toujours visible */}
          <div className="mb-4">
            <Input
              placeholder="Search requests..."
              className="w-full md:w-[300px]"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>

          {/* Filtres conditionnels */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <Select 
                onValueChange={(value) => handleFilterChange('bloodType', value as BloodType)} 
                value={filters.bloodType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Blood Type" />
                </SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                    <SelectItem key={type} value={type}>
                      <Badge className="bg-red-100 text-red-600">{type}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                onValueChange={(value) => handleFilterChange('priority', value as Priority)} 
                value={filters.priority}
              >
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

              <Select 
                onValueChange={(value) => handleFilterChange('status', value as Status)} 
                value={filters.status}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">
                    <Badge className="bg-gray-100 text-gray-600">Pending</Badge>
                  </SelectItem>
                  <SelectItem value="Approved">
                    <Badge className="bg-blue-100 text-blue-600">Approved</Badge>
                  </SelectItem>
                  <SelectItem value="Rejected">
                    <Badge className="bg-red-100 text-red-600">Rejected</Badge>
                  </SelectItem>
                  <SelectItem value="Completed">
                    <Badge className="bg-green-100 text-green-600">Completed</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Filter by doctor..."
                className="w-[180px]"
                value={filters.doctor}
                onChange={(e) => handleFilterChange('doctor', e.target.value)}
              />

              <Input
                placeholder="Filter by department..."
                className="w-[180px]"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              />

              <Button 
                variant="ghost" 
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800"
              >
                Reset Filters
              </Button>
            </div>
          )}

          <GenericTable<BloodRequest>
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