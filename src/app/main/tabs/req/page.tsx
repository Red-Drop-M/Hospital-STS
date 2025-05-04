"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GenericTable from "@/components/GeneriComponents/genericTable"
import {columns ,BloodRequest } from "@/components/requests/columns"
import {bloodRequests} from "@/components/requests/data"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const Requests = () => {
    const [pageIndex, setPageIndex] = useState(0)
      const pageSize = 10
      
      
      const paginatedData = bloodRequests.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
      const pageCount = Math.ceil(bloodRequests.length / pageSize)
  return (
      <TabsContent value="Requests" className="mt-14 w-full">
        <div className="w-full ">
          <Card className=" hover:border-red-900 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Requests Table</CardTitle>
            </CardHeader>
            <CardContent>
              <GenericTable<BloodRequest>
                      columns={columns}
                      data={paginatedData}
                      pageCount={pageCount}
                      pageIndex={pageIndex}
                      onPageChange={setPageIndex}
                    />
            </CardContent>
          </Card>
          
        </div>
      </TabsContent>
    )
  }
  
export default Requests