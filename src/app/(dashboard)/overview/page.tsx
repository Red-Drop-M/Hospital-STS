// import {Filter ,ChevronDown, Plus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
//   } from "@/components/ui/dropdown-menu"
//   import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
//   } from "@/components/ui/card"
// import GenericCard from "@/components/GeneriComponents/GenericCard";
// import { Droplet } from "lucide-react";
// import BloodStockChart from "@/components/GeneriComponents/chart1"
// import BloodTypeDistribution from "@/components/GeneriComponents/chart2"

// export default function Overview () {
    
//     return ( 
//                   <main className="flex-1 space-y-10 p-4 md:p-8">
//                         <div className="flex items-center justify-between">
//                             <h1 className="text-3xl font-bold tracking-tight">CTS Dashboard</h1>
//                             <div className="flex items-center gap-2">
//                                 <DropdownMenu>
//                                 {/* <DropdownMenuTrigger asChild>
//                                     <Button variant="outline" className="ml-auto flex gap-1 focus:outline-none focus:ring-0 border-2 border-transparent hover:border-red-300 transition-colors duration-300">
//                                     <Filter className="h-4 w-4 " /> 
//                                     <span className="hidden sm:inline-block">Filtrer</span>
//                                     <ChevronDown className="h-4 w-4 " />
//                                     </Button>
//                                 </DropdownMenuTrigger> */}
//                                 <DropdownMenuContent align="end">
//                                 </DropdownMenuContent>
//                                 </DropdownMenu>
//                                     {/* <Button className="gap-1" onClick={() => setRequestModalOpen(true)}> */}
//                                 <Button className="gap-1 bg-red-900" >
//                                         <Plus className="h-4 w-4" />
//                                         <span className="hidden sm:inline-block">New Donor</span>
//                                 </Button>
//                                 <Button className="gap-1 bg-red-900" >
//                                         <Plus className="h-4 w-4" />
//                                         <span className="hidden sm:inline-block">New Request</span>
//                                 </Button>
//                             </div>
//                         </div>
//                         <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
//                             {/* first exemple */}
//                             <GenericCard
//                                 Title = {<p>commandes</p> }
//                                 Description = {
//                                     <Droplet className="h-4 w-4 text-red-500" />
//                                 }
//                                 Content={
//                                     <>
//                                     <div className="text-2xl font-bold mt-5">+250</div>
//                                     <p className="text-xs text-muted-foreground">+12% cette semaine</p>
//                                     </>
//                                 }
//                                 HeaderClassName="flex flex-row items-center justify-between space-y-0 pb-2 "
//                                 TitleClassName="text-sm font-medium"
//                                 ClassName="border-2 border-transparent hover:border-red-300 transition-colors duration-300"/>
//                             {/* seconde exemple */}
//                             <GenericCard
//                                 Title={
//                                     <>
//                                         <span className="text-sm font-medium">Commandes</span>
//                                         <Droplet className="h-4 w-4 text-red-500" />
//                                     </>
//                                 }
//                                 Content={
//                                     <>
//                                     <div className="text-2xl font-bold">+250</div>
//                                     <p className="text-xs text-muted-foreground">+12% cette semaine</p>
//                                     </>
//                                 }
//                                 TitleClassName="flex flex-row items-center justify-between space-y-0 pb-2 "
//                                 ClassName="border-2 border-transparent hover:border-red-300 transition-colors duration-300"/>

//                             <GenericCard
//                                 Title={
//                                     <>
//                                         <span className="text-sm font-medium">Commandes</span>
//                                         <Droplet className="h-4 w-4 text-red-500" />
//                                     </>
//                                 }
//                                 Content={
//                                     <>
//                                     <div className="text-2xl font-bold">+250</div>
//                                     <p className="text-xs text-muted-foreground">+12% cette semaine</p>
//                                     </>
//                                 }
//                                 TitleClassName="flex flex-row items-center justify-between space-y-0 pb-2 "
//                                 ClassName="border-2 border-transparent hover:border-red-300 transition-colors duration-300"/>

//                             <GenericCard
//                                 Title={
//                                     <>
//                                         <span className="text-sm font-medium">Commandes</span>
//                                         <Droplet className="h-4 w-4 text-red-500" />
//                                     </>
//                                 }
//                                 Content={
//                                     <>
//                                     <div className="text-2xl font-bold">+250</div>
//                                     <p className="text-xs text-muted-foreground">+12% cette semaine</p>
//                                     </>
//                                 }
//                                 TitleClassName="flex flex-row items-center justify-between space-y-0 pb-2 "
//                                 ClassName="border-2 border-transparent hover:border-red-300 transition-colors duration-300"/>
//                             {/* classic exemple */}
//                             {/* <StatCard title="imad"
//                                         icon={Droplet}
//                                         value="1 284"
//                                         change="+12% par rapport au mois dernier" /> */}
//                         </div>
//                         <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2 mt-3">
//                             <Card className="h-[600] border-2 border-transparent hover:border-red-900 transition-colors duration-300">
//                                     <CardHeader>
//                                     <CardTitle>Niveaux de Stock de Sang</CardTitle>
//                                     <CardDescription>Inventaire actuel de sang par type</CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="pl-2">
//                                     <BloodStockChart />
//                                     </CardContent>
//                                 </Card>

//                             <Card className="h-[600] border-2 border-transparent hover:border-red-900 transition-colors duration-300">
//                                     <CardHeader>
//                                     <CardTitle>Niveaux de Stock de Sang</CardTitle>
//                                     <CardDescription>Inventaire actuel de sang par type</CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="pl-2">
//                                     <BloodTypeDistribution />
//                                     </CardContent>
//                                 </Card>

//                         </div>
//                   </main>
            
        

//     );
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Mail, Phone, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BloodTransferCenter {
  id: string
  name: string
  address: string
  email: string
  phoneNumber: string
  wilayaId: number
  wilayaName: string
}

export default function CenterPage() {
  const [center, setCenter] = useState<BloodTransferCenter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://localhost:57677/blood-transfer-center')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch center data: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Center data:', data)
        setCenter(data)
      } catch (err) {
        console.error('Error fetching center data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCenterData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <p className="text-lg font-medium">Loading center information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <main className="flex-1 p-4 md:p-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Blood Transfer Center</h1>
      </div>

      {center ? (
        <Card className="flex-1 w-full mx-auto border-2 border-transparent hover:border-red-900 transition-colors duration-300 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-900 to-red-700 text-white py-8">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">{center.name}</CardTitle>
                <CardDescription className="text-gray-100 mt-2 text-lg opacity-90">
                  Transfer Center ID: {center.id}
                </CardDescription>
              </div>
              <Building className="h-16 w-16 text-white opacity-80" />
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg shadow-sm">
                <MapPin className="h-8 w-8 text-red-600 mt-1" />
                <div>
                  <p className="text-base font-medium text-gray-500">Address</p>
                  <p className="text-xl mt-1">{center.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg shadow-sm">
                <MapPin className="h-8 w-8 text-red-600 mt-1" />
                <div>
                  <p className="text-base font-medium text-gray-500">Wilaya</p>
                  <p className="text-xl mt-1">{center.wilayaName} <span className="text-gray-500">(Code: {center.wilayaId})</span></p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg shadow-sm">
                <Mail className="h-8 w-8 text-red-600 mt-1" />
                <div>
                  <p className="text-base font-medium text-gray-500">Email</p>
                  <p className="text-xl mt-1">{center.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg shadow-sm">
                <Phone className="h-8 w-8 text-red-600 mt-1" />
                <div>
                  <p className="text-base font-medium text-gray-500">Phone Number</p>
                  <p className="text-xl mt-1">{center.phoneNumber}</p>
                </div>
              </div>
            </div>
            
            {/* Edit button removed as requested */}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-500">No center information available.</p>
        </div>
      )}
    </main>
  )
}