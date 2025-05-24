"use client"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import GenericTable from "@/components/GeneriComponents/genericTable"
import { Service, ServiceColumns } from "@/app/services/Columns"
import { fakeServices } from "@/app/services/dataservice"
export default function Services(){
        const [pageIndex, setPageIndex] = useState(0);
        const pageSize = 10;
        // Simulez des donnees paginees (remplacez par votre vraie logique d'API)
        const paginatedData = fakeServices.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
        const pageCount = Math.ceil(fakeServices.length / pageSize);
    
    return (
        <div className="w-full space-y-10 p-4 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-3xl tracking-tight">Donors Management</h1>
                <div className="flex items-center gap-2">           
                            <Button className="gap-1 bg-red-900 hover:bg-red-800">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline-block">Add Service</span>
                            </Button>                       
                </div>
            </div>
            <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
                <CardHeader>
                        <CardTitle className="text-xl">Donors Table</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full mt-4 p-10">
                        <GenericTable<Service>
                                columns={ServiceColumns}
                                data={paginatedData}
                                pageCount={pageCount}
                                pageIndex={pageIndex}
                                onPageChange={setPageIndex}
                            />
                    </div>
                </CardContent> 
            </Card>
        </div>
    )
}