"use client"
import { useState, useEffect } from "react"
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import GenericTable from "@/components/GeneriComponents/genericTable";
import { donorPledgeColumns } from "@/components/DonorPledges/Columns";
import { getAllDonorPledges, updateDonorPledge } from "@/lib/donorPledgeAPI";
import { DonorPledgeDTO } from "@/components/DonorPledges/Columns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { z } from "zod";
import { FormFieldType, GenericForm } from "@/components/GeneriComponents/GenericForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label"
import { X } from "lucide-react";

type Filters = {
  bloodType: string | undefined;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | undefined;
  searchQuery: string;
};

const updateDonorPledgeSchema = z.object({
  BloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood type is required",
  }),
  Status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
    required_error: "Status is required",
  }),
  PledgeDate: z.string().min(1, "Pledge date is required"),
  DonorName: z.string().min(1, "Donor name is required"),
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
    name: "Status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "cancelled", label: "Cancelled" },
      { value: "completed", label: "Completed" },
    ],
  },
  {
    name: "PledgeDate",
    label: "Pledge Date",
    type: "date",
    required: true,
  },
  {
    name: "DonorName",
    label: "Donor Name",
    type: "text",
    required: true,
  },
];

export default function DonorPledgesPage() {
  const [pledges, setPledges] = useState<DonorPledgeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [showFilters, setShowFilters] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState<DonorPledgeDTO | null>(null);

  // État initial des filtres
  const [filters, setFilters] = useState<Filters>({
    bloodType: undefined,
    status: undefined,
    searchQuery: '',
  });

  useEffect(() => {
    fetchDonorPledges();
  }, [pageIndex, filters]); // Ajout des filtres comme dépendance

  const handleStatusUpdate = async (id: string, newStatus: DonorPledgeDTO['Status']) => {
    try {
      const response = await updateDonorPledge(id, { Status: newStatus });
      if (response.data) {
        setPledges(pledges.map(pledge => 
          pledge.DonorId === id ? { ...pledge, Status: newStatus } : pledge
        ));
      }
    } catch (error) {
      console.error('Error updating donor pledge status:', error);
    }
  };

  const handleUpdate = async (values: z.infer<typeof updateDonorPledgeSchema>) => {
    if (!selectedPledge) return;
    
    try {
      const response = await updateDonorPledge(selectedPledge.DonorId, values);
      if (response.data) {
        setPledges(pledges.map(pledge => 
          pledge.DonorId === selectedPledge.DonorId ? { ...pledge, ...values } : pledge
        ));
        setIsUpdateModalOpen(false);
        toast({
          title: "Success",
          description: "Donor pledge updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating donor pledge:', error);
      toast({
        title: "Error",
        description: "Failed to update donor pledge",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPageIndex(0); // Reset to first page when filter changes
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      bloodType: undefined,
      status: undefined,
      searchQuery: '',
    });
    setPageIndex(0);
  };

  // Modifiez la fonction fetchDonorPledges pour inclure les filtres
  const fetchDonorPledges = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (pageIndex) queryParams.append('_page', (pageIndex + 1).toString());
      if (pageSize) queryParams.append('_limit', pageSize.toString());
      
      // Filtres
      if (filters.bloodType) queryParams.append('BloodType', filters.bloodType);
      if (filters.status) queryParams.append('Status', filters.status);
      if (filters.searchQuery) queryParams.append('q', filters.searchQuery);

      const response = await getAllDonorPledges({
        page: pageIndex + 1,
        pageSize: pageSize,
        bloodType: filters.bloodType,
        status: filters.status,
        searchQuery: filters.searchQuery
      });

      if (response.data) {
        setPledges(response.data.donorPledges);
        setTotalCount(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching donor pledges:', error);
      toast({
        title: "Error",
        description: "Failed to fetch donor pledges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <main className="w-full space-y-4 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Donor Pledges</h1>
      </div>
      
      <Card className="w-full mt-3">
        <CardHeader className="border-b border-border/40 p-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold">Donor Pledges</CardTitle>
            <div className="flex items-center gap-4">
              <Button 
                onClick={toggleFilters}
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {showFilters && (
            <div className="border-b border-border/40 px-4 py-3 sm:px-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <Label>Search by name</Label>
                    <Input
                      placeholder="Search donor name..."
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label>Blood Type</Label>
                    <Select
                      value={filters.bloodType || "default"}
                      onValueChange={(value) => 
                        handleFilterChange('bloodType', value === "default" ? undefined : value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">All Blood Types</SelectItem>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label>Status</Label>
                    <Select
                      value={filters.status || "default"}
                      onValueChange={(value) => 
                        handleFilterChange('status', value === "default" ? undefined : value as any)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3">
                  <p className="text-sm text-muted-foreground">
                    {totalCount} pledges found
                  </p>
                  <Button
                    onClick={resetFilters}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FilterX className="h-4 w-4" />
                    Reset filters
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 sm:p-6">
            <GenericTable
              columns={donorPledgeColumns(setIsUpdateModalOpen, setSelectedPledge)}
              data={pledges}
              pageCount={Math.ceil(totalCount / pageSize)}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Donor Pledge</DialogTitle>
          </DialogHeader>
          {selectedPledge && (
            <GenericForm
              formSchema={updateDonorPledgeSchema}
              fields={formFields}
              onSubmit={handleUpdate}
              defaultValues={{
                BloodType: selectedPledge.BloodType,
                Status: selectedPledge.Status,
                PledgeDate: selectedPledge.PledgeDate,
                DonorName: selectedPledge.DonorName,
              }}
              submitButtonText="Update Pledge"
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}