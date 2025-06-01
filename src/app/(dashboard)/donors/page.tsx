"use client"
import { useState, useEffect } from "react"
import { z } from "zod"
import GenericTable from "@/components/GeneriComponents/genericTable"
import { DonorColumns, DonorDTO } from "@/components/Donors/columns"
import { Droplet, ChevronDown, ChevronUp, Filter, Plus } from "lucide-react"
import { FormFieldType } from '@/components/GeneriComponents/GenericForm'
import { GenericForm } from "@/components/GeneriComponents/GenericForm"
import StatCard from "@/components/stat-card/page"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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
import { getAllDonors, createDonor, deleteDonor, updateDonor } from "@/lib/donors"
// Importez d'abord le DatePicker de react-datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "@/hooks/use-toast"
import debounce from "lodash/debounce";

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
type Filters = {
  Blood?: BloodType | ''
  regular?: boolean | ''
  searchQuery?: string
}
function parseDate(dateString: string): Date | null {
  const [day, month, year] = dateString.split("-").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day); // Les mois commencent à 0 en JavaScript
}
export default function Donors() {
  const [donors, setDonors] = useState<DonorDTO[]>([]);
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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorDTO | null>(null);
  const [searchInputValue, setSearchInputValue] = useState("");

  const createDonorSchema = z.object({
    Name: z.string().min(1, "Name is required"),
    Email: z.string().email("Invalid email address"),
    BloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      required_error: "Blood type is required",
    }),
    LastDonationDate: z
      .string()
      .optional()
      .nullable()
      .refine(
        (value) => !value || /^\d{2}-\d{2}-\d{4}$/.test(value),
        "Invalid date format. Please use dd-mm-yyyy."
      )
      .transform((value) => (value ? parseDate(value) : null)),
    Address: z.string().min(1, "Address is required"),
    NIN: z.string().min(1, "National ID is required"),
    PhoneNumber: z.string().min(1, "Phone number is required"),
    DateOfBirth: z
      .string()
      .refine(
        (value) => /^\d{2}-\d{2}-\d{4}$/.test(value),
        "Invalid date format. Please use dd-mm-yyyy."
      )
      .refine((value) => {
        const date = parseDate(value);
        if (!date) return false;
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
          return age - 1 >= 18;
        }
        return age >= 18;
      }, "Donor must be at least 18 years old")
      .transform((value) => parseDate(value)),
    NotesBTC: z.string().optional(), // Add this line
  })

  const updateDonorSchema = createDonorSchema.partial();

  const formFields: FormFieldType[] = [
    {
      name: "Name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "John Doe",
    },
    {
      name: "Email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "john.doe@example.com",
    },
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
  name: "LastDonationDate",
  label: "Last Donation Date",
  type: "text",
  placeholder: "Enter last donation date (dd-mm-yyyy)",
  description: "Leave empty if never donated",
  defaultValue: "",
  customInput: ({ field }: { field: any }) => (
    <input
      type="text"
      value={field.value || ""}
      onChange={(e) => field.onChange(e.target.value)}
      placeholder="dd-mm-yyyy"
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      onBlur={(e) => {
        const value = e.target.value;
        const isValid = /^\d{2}-\d{2}-\d{4}$/.test(value);
        if (!isValid && value) {
          alert("Invalid date format. Please use dd-mm-yyyy.");
        }
      }}
    />
  ),
},
    {
      name: "Address",
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
      name: "PhoneNumber",
      label: "Phone Number",
      type: "text",
      required: true,
      placeholder: "+1234567890",
    },
    {
  name: "DateOfBirth",
  label: "Date of Birth",
  type: "text",
  placeholder: "Enter date of birth (dd-mm-yyyy)",
  description: "Donor must be at least 18 years old",
  defaultValue: "",
  customInput: ({ field }: { field: any }) => (
    <input
      type="text"
      value={field.value || ""}
      onChange={(e) => field.onChange(e.target.value)}
      placeholder="dd-mm-yyyy"
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      onBlur={(e) => {
        const value = e.target.value;
        const isValid = /^\d{2}-\d{2}-\d{4}$/.test(value);
        if (!isValid) {
          alert("Invalid date format. Please use dd-mm-yyyy.");
        }
      }}
    />
  ),
}
  ];
  // filepath: c:\Users\admin\Desktop\PFE\RED-DROP\src\app\(dashboard)\donors\page.tsx
const defaultValues = {
  Name: '',
  Email: '',
  BloodType: '',
  LastDonationDate: null,
  Address: '',
  NIN: '',
  PhoneNumber: '',
  DateOfBirth: null,
  NotesBTC: '',  // Add this line
};
  
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setIsLoading(true);
        // Add filter parameters to the API call
        const response = await getAllDonors(pageIndex + 1, pageSize);
        
        console.log("getAllDonors response:", response);
        const { donors, total } = response;

        // Transform the donor data to match expected structure
        const transformedDonors = donors.map(donor => ({
          id: donor.id || "",
          Name: donor.name || "",
          Email: donor.email || "",
          // Handle the nested bloodType object structure
          BloodType: donor.bloodType?.value || donor.bloodType || "Unknown",
          Address: donor.address || "",
          NIN: donor.nin || "",
          PhoneNumber: donor.phoneNumber || "",
          DateOfBirth: donor.dateOfBirth || "",
          LastDonationDate: donor.lastDonationDate || "",
          NotesBTC: donor.notesBTC || ""
        }));

        console.log("Transformed donors:", transformedDonors);

        // Use transformed data instead
        setDonors(transformedDonors);
        setTotalDonors(total);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setDonors([]);
        setTotalDonors(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonors();
  }, [pageIndex, pageSize, filters]); // Include filters in dependencies

  const handleSubmit = async (values: z.infer<typeof createDonorSchema>) => {
    try {
      const formattedValues = {
        name: values.Name,
        email: values.Email,
        bloodType: values.BloodType,
        lastDonationDate: values.LastDonationDate
          ? format(values.LastDonationDate, "yyyy-MM-dd")
          : "",
        address: values.Address,
        nin: values.NIN,
        phoneNumber: values.PhoneNumber,
        dateOfBirth: values.DateOfBirth
          ? format(values.DateOfBirth, "yyyy-MM-dd")
          : "",
        notesBTC: values.NotesBTC || ""
      };

      const response = await createDonor(formattedValues);

      if (response.success) {
        // Transformer le nouveau donneur
        const newDonor: DonorDTO = {
          id: response.content!.id,
          Name: values.Name,
          Email: values.Email,
          BloodType: values.BloodType,
          Address: values.Address,
          NIN: values.NIN,
          PhoneNumber: values.PhoneNumber,
          DateOfBirth: values.DateOfBirth ? format(values.DateOfBirth, "yyyy-MM-dd") : "",
          LastDonationDate: values.LastDonationDate ? format(values.LastDonationDate, "yyyy-MM-dd") : "",
          NotesBTC: values.NotesBTC || ""
        };
        
        setDonors((prev) => [newDonor, ...prev]);
        setTotalDonors((prev) => prev + 1);
        setOpen(false);
        
        toast({
          title: "Success",
          description: "Donor created successfully",
        });
      } else {
        setError(response.Error || "Failed to create donor");
      }
    } catch (err) {
      console.error("Error creating donor:", err);
      setError(err instanceof Error ? err.message : "Failed to create donor");
    }
  };

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

const handleUpdate = async (values: z.infer<typeof createDonorSchema>) => {
  if (!selectedDonor) return;
  console.log("Updating donor with ID:", selectedDonor.id);
  try {
    // Create the formatted values with the exact structure the API expects
    const formattedValues = {
      name: values.Name,
      email: values.Email,
      bloodType: values.BloodType,
      lastDonationDate: values.LastDonationDate
        ? format(values.LastDonationDate, "yyyy-MM-dd") 
        : "",
      address: values.Address,
      nin: values.NIN,
      phoneNumber: values.PhoneNumber,
      dateOfBirth: values.DateOfBirth
        ? format(values.DateOfBirth, "yyyy-MM-dd")
        : "",
      notesBTC: values.NotesBTC || ""
    };

    console.log("Formatted values for update:", formattedValues);
    
    const response = await updateDonor(selectedDonor.id, formattedValues);

    if (response.success) {
      console.log("Donor updated successfully:", {
        id: selectedDonor.id,
        before: selectedDonor,
        after: {
          ...selectedDonor,
          Name: values.Name,
          Email: values.Email,
          BloodType: values.BloodType,
          Address: values.Address,
          NIN: values.NIN,
          PhoneNumber: values.PhoneNumber,
          DateOfBirth: formattedValues.dateOfBirth ?? selectedDonor.DateOfBirth, // Fixed: use selectedDonor
          LastDonationDate: formattedValues.lastDonationDate ?? selectedDonor.LastDonationDate, // Fixed: use selectedDonor
          NotesBTC: values.NotesBTC || ""
        },
        apiResponse: response
      });
      // Rest of the function remains the same
      setDonors((prev) =>
        prev.map((donor) =>
          donor.id === selectedDonor.id
            ? {
                ...donor,
                Name: values.Name,
                Email: values.Email,
                BloodType: values.BloodType,
                Address: values.Address, 
                NIN: values.NIN,
                PhoneNumber: values.PhoneNumber,
                DateOfBirth: values.DateOfBirth 
                  ? format(values.DateOfBirth, "yyyy-MM-dd")
                  : donor.DateOfBirth,
                LastDonationDate: values.LastDonationDate
                  ? format(values.LastDonationDate, "yyyy-MM-dd")
                  : donor.LastDonationDate,
                NotesBTC: values.NotesBTC || ""
              }
            : donor
        )
      );
      
      toast({
        title: "Success",
        description: "Donor updated successfully",
      });
      setIsUpdateModalOpen(false);
      setSelectedDonor(null);
    } else {
      toast({
        title: "Error",
        description: response.Error || "Failed to update donor",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error updating donor:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while updating the donor",
      variant: "destructive",
    });
  }
};
  const filterRequests = (): DonorDTO[] => {
    return donors.filter(donor => {
      // Check for BloodType filter (uppercase "B")
      if (filters.Blood && donor.BloodType !== filters.Blood) {
        return false;
      }
      
      // Check for regular donor filter
      if (filters.regular !== '' && donor.regular !== filters.regular) {
        return false;
      }
      
      // Check for search query
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        return (
          donor.Name.toLowerCase().includes(searchLower) ||
          donor.Email.toLowerCase().includes(searchLower) ||
          donor.PhoneNumber.toLowerCase().includes(searchLower) ||
          (donor.NotesBTC && donor.NotesBTC.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
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

  // Handle input change without triggering search
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
  };

  // Only apply search filter when Enter key is pressed
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFilterChange('searchQuery', searchInputValue);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // You create filtered data here
  const filteredData = filterRequests()
  const paginatedData = filteredData // No slicing needed - API already returns paginated data
  const pageCount = Math.ceil(totalDonors / pageSize)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <main className="w-full space-y-10 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl tracking-tight">Donors Management</h1>
        <div className="flex items-center gap-2">
          <Dialog modal={false} open={open} onOpenChange={setOpen}>
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
                defaultValues={defaultValues} // Ajout des valeurs par défaut
              />
            </DialogContent>
          </Dialog>
          <Dialog modal={false} open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
  <DialogContent
    className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto"
    aria-describedby="update-donor-description"
  >
    <DialogHeader>
      <DialogTitle>Update Donor</DialogTitle>
      <DialogDescription id="update-donor-description">
        Use the form below to update the donor's information.
      </DialogDescription>
    </DialogHeader>
    {selectedDonor && (
      <GenericForm
        formSchema={updateDonorSchema}
        fields={formFields}
        onSubmit={handleUpdate}
        submitButtonText="Update Donor"
        defaultValues={{
          Name: selectedDonor.Name,
          Email: selectedDonor.Email,
          BloodType: selectedDonor.BloodType,
          LastDonationDate: selectedDonor.LastDonationDate
            ? format(parseISO(selectedDonor.LastDonationDate), "dd-MM-yyyy") // Format as string
            : "",
          Address: selectedDonor.Address,
          NIN: selectedDonor.NIN,
          PhoneNumber: selectedDonor.PhoneNumber,
          DateOfBirth: selectedDonor.DateOfBirth
            ? format(parseISO(selectedDonor.DateOfBirth), "dd-MM-yyyy") // Format as string
            : "",
          NotesBTC: selectedDonor.NotesBTC || '',
        }}
      />
    )}
  </DialogContent>
</Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* <StatCard 
          title="Total Donors"
          icon={Droplet}
          value={totalDonors.toString()}
          change="+12% from last month" 
        /> */}
        {/* <StatCard 
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
        /> */}
        {/* <StatCard 
          title="Avg. Donations"
          icon={Droplet}
          value="2.4"
          change="+0.3 from last month" 
        /> */}
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
              value={searchInputValue}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown} // Add this line
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
            {donors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No donors found. Try adjusting your filters or add new donors.
              </div>
            ) : (
              <GenericTable<DonorDTO>
                columns={DonorColumns(setDonors, setIsUpdateModalOpen, setSelectedDonor)}
                data={filteredData} // Use filtered data
                pageCount={pageCount}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}