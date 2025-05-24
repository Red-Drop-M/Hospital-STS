"use client"
import { useState, useEffect } from "react"
import { z } from "zod"
import GenericTable from "@/components/GeneriComponents/genericTable"
import { DonorColumns, Donor } from "@/components/Donors/columns"
import { Droplet, ChevronDown, ChevronUp, Filter, Plus } from "lucide-react"
import { FormFieldType } from '@/components/GeneriComponents/GenericForm'
import { GenericForm } from "@/components/GeneriComponents/GenericForm"
import StatCard from "@/components/stat-card/page"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, parseISO } from 'date-fns'
import { getAllDonors, createDonor } from "@/lib/donors"

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
type Filters = {
  Blood?: BloodType | ''
  regular?: boolean | ''
  searchQuery?: string
}

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [totalDonors, setTotalDonors] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    Blood: '',
    regular: '',
    searchQuery: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10

  const createDonorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    Blood: z.string().min(1, "Blood type is required"),
    lastDonationDate: z.date().optional().nullable(),
    address: z.string().min(1, "Address is required"),
    NIN: z.string().min(1, "National ID is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Please select a valid date",
    }),
  })

  const formFields: FormFieldType[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "John Doe",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "john.doe@example.com",
    },
    {
      name: "Blood",
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
      name: "lastDonationDate",
      label: "Last Donation Date",
      type: "date",
      placeholder: "Select last donation date",
      description: "Leave empty if never donated",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: true,
      placeholder: "123 Main St, City",
    },
    {
      name: "NIN",
      label: "National ID Number",
      type: "text",
      required: true,
      placeholder: "Enter national ID",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      required: true,
      placeholder: "+1234567890",
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      required: true,
      placeholder: "Select date of birth",
      description: "Donor must be at least 18 years old",
    },
  ]

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setIsLoading(true)
        const { donors, total } = await getAllDonors(pageIndex + 1, pageSize)
        setDonors(donors)
        setTotalDonors(total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDonors()
  }, [pageIndex, pageSize])

  const handleSubmit = async (values: z.infer<typeof createDonorSchema>) => {
    try {
      const formattedValues = {
        ...values,
        lastDonationDate: values.lastDonationDate ? format(values.lastDonationDate, 'yyyy-MM-dd') : undefined,
        dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
        regulier: false,
        Blood: values.Blood as BloodType
      }
      
      const newDonor = await createDonor(formattedValues)
      setDonors(prev => [newDonor, ...prev])
      setTotalDonors(prev => prev + 1)
      setOpen(false)
    } catch (err) {
      console.error("Error creating donor:", err)
      setError("Failed to create donor")
    }
  }

  const filterRequests = (): Donor[] => {
    return donors.filter(donor => {
      if (filters.Blood && donor.Blood !== filters.Blood) {
        return false
      }
      if (filters.regular !== undefined && donor.regulier !== filters.regular) {
        return false
      }
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase()
        return (
          donor.name.toLowerCase().includes(searchLower) ||
          donor.email.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }

  const handleFilterChange = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPageIndex(0)
  }

  const resetFilters = () => {
    setFilters({
      Blood: '',
      regular: '',
      searchQuery: '',
    })
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const filteredData = filterRequests()
  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(filteredData.length / pageSize)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <main className="w-full space-y-10 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl tracking-tight">Donors Management</h1>
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-red-900 hover:bg-red-800">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline-block">Add Donor</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register New Donor</DialogTitle>
              </DialogHeader>
              <GenericForm
                formSchema={createDonorSchema}
                fields={formFields}
                onSubmit={handleSubmit}
                submitButtonText="Register Donor"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Donors"
          icon={Droplet}
          value={totalDonors.toString()}
          change="+12% from last month" 
        />
        <StatCard 
          title="Active Donors"
          icon={Droplet}
          value={donors.filter(d => d.regulier).length.toString()}
          change="+5% from last month" 
        />
        <StatCard 
          title="Inactive Donors"
          icon={Droplet}
          value={donors.filter(d => !d.regulier).length.toString()}
          change="+7% from last month" 
        />
        <StatCard 
          title="Avg. Donations"
          icon={Droplet}
          value="2.4"
          change="+0.3 from last month" 
        />
      </div>

      <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Donors Table</CardTitle>
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
          <div className="mb-4">
            <Input
              placeholder="Search donors..."
              className="w-full md:w-[300px]"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 mb-6 bg-muted/50 p-4 rounded-lg">
              <Select
                onValueChange={(value) => handleFilterChange('Blood', value as BloodType)} 
                value={filters.Blood}
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
                onValueChange={(value) => handleFilterChange('regular', value === "true")} 
                value={filters.regular?.toString() || ""}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Regular Donor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">
                    <Badge className="bg-green-100 text-green-600">Regular</Badge>
                  </SelectItem>
                  <SelectItem value="false">
                    <Badge className="bg-yellow-100 text-yellow-600">Non-Regular</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="ghost" 
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800"
              >
                Reset Filters
              </Button>
            </div>
          )}

          <div className="w-full mt-4">
            <GenericTable<Donor>
              columns={DonorColumns}
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