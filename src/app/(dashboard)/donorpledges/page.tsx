"use client"
import { useState, useEffect } from "react"
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Filter, Plus } from 'lucide-react';
import GenericTable from "@/components/GeneriComponents/genericTable";
import { donorPledgeColumns } from "@/components/DonorPledges/Columns";
import { mockDonorPledges, getMockDonorPledges } from "@/components/DonorPledges/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DonorPledgesPage() {
  // État pour la pagination
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10; // Nombre d'éléments par page
  const [showFilters, setShowFilters] = useState(false);

  // Utilisation des données mockées
  const allData = mockDonorPledges; // ou getMockDonorPledges(25) pour générer 25 entrées
  
  // Calcul pour la pagination
  const pageCount = Math.ceil(allData.length / pageSize);
  const paginatedData = allData.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <main className="w-full space-y-10 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Donor Pledges</h1>
      </div>
      <div className="flex items-center gap-2">
        <Card className="w-full mt-3 hover:border-red-900 transition-colors duration-300">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Donor Pledges Table</CardTitle>
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
            <div className="w-full mt-4">
              <GenericTable
                columns={donorPledgeColumns}
                data={paginatedData}
                pageCount={pageCount}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}