"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GenericTable from "@/components/GeneriComponents/genericTable"
import {DonorColumns ,Donor } from "@/components/Donors/columns"
import {donors} from "@/components/Donors/data"
import { Droplet } from "lucide-react"
import StatCard from "@/components/stat-card/page"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const Donors = () => {
    const [pageIndex, setPageIndex] = useState(0)
      const pageSize = 10
      
      // Simulez des données paginées (remplacez par votre vraie logique d'API)
      const paginatedData = donors.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
      const pageCount = Math.ceil(donors.length / pageSize)
  return (
      <TabsContent value="Donors" className=" w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Donors"
                      icon={Droplet}
                      value="1 284"
                      change="+12% par rapport au mois dernier" />
          <StatCard title="Active Donors"
                      icon={Droplet}
                      value="284"
                      change="+5% from last month" />
          <StatCard title="Inactive Donors"
                      icon={Droplet}
                      value="1000"
                      change="+12% par rapport au mois dernier" />
          <StatCard title="Avg. Donations"
                      icon={Droplet}
                      value="2.4"
                      change="+0.3 from last month" />
        </div>
        <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-xl">Donors Table</CardTitle>
          </CardHeader>
          <CardContent>
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
      </TabsContent>
    )
  }
  
export default Donors