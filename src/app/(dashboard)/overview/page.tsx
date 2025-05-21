import {Filter ,ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import GenericCard from "@/components/GeneriComponents/GenericCard";
import { Droplet } from "lucide-react";
import BloodStockChart from "@/components/GeneriComponents/chart1"
import BloodTypeDistribution from "@/components/GeneriComponents/chart2"

export default function Overview () {
    
    return ( 
                  <main className="flex-1 space-y-10 p-4 md:p-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold tracking-tight">CTS Dashboard</h1>
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                {/* <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto flex gap-1 focus:outline-none focus:ring-0 border-2 border-transparent hover:border-red-300 transition-colors duration-300">
                                    <Filter className="h-4 w-4 " /> 
                                    <span className="hidden sm:inline-block">Filtrer</span>
                                    <ChevronDown className="h-4 w-4 " />
                                    </Button>
                                </DropdownMenuTrigger> */}
                                <DropdownMenuContent align="end">
                                </DropdownMenuContent>
                                </DropdownMenu>
                                    {/* <Button className="gap-1" onClick={() => setRequestModalOpen(true)}> */}
                                <Button className="gap-1 bg-red-900" >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline-block">New Donor</span>
                                </Button>
                                <Button className="gap-1 bg-red-900" >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline-block">New Request</span>
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {/* first exemple */}
                            <GenericCard
                                Title = {<p>commandes</p> }
                                Description = {
                                    <Droplet className="h-4 w-4 text-red-500" />
                                }
                                Content={
                                    <>
                                    <div className="text-2xl font-bold mt-5">+250</div>
                                    <p className="text-xs text-muted-foreground">+12% cette semaine</p>
                                    </>
                                }
                                HeaderClassName="flex flex-row items-center justify-between space-y-0 pb-2 "
                                TitleClassName="text-sm font-medium"
                                ClassName="border-2 border-transparent hover:border-red-300 transition-colors duration-300"/>
                            {/* seconde exemple */}
                            <GenericCard
                                Title={
                                    <>
                                        <span className="text-sm font-medium">Commandes</span>
                                        <Droplet className="h-4 w-4 text-red-500" />
                                    </>
                                }
                                Content={
                                    <>
                                    <div className="text-2xl font-bold">+250</div>
                                    <p className="text-xs text-muted-foreground">+12% cette semaine</p>
                                    </>
                                }
                                TitleClassName="flex flex-row items-center justify-between space-y-0 pb-2 "
                                ClassName="border-2 border-transparent hover:border-red-300 transition-colors duration-300"/>

                            <GenericCard
                                Title={
                                    <>
                                        <span className="text-sm font-medium">Commandes</span>
                                        <Droplet className="h-4 w-4 text-red-500" />
                                    </>
                                }
                                Content={
                                    <>
                                    <div className="text-2xl font-bold">+250</div>
                                    <p className="text-xs text-muted-foreground">+12% cette semaine</p>
                                    </>
                                }
                                TitleClassName="flex flex-row items-center justify-between space-y-0 pb-2 "
                                ClassName="border-2 border-transparent hover:border-red-300 transition-colors duration-300"/>

                            <GenericCard
                                Title={
                                    <>
                                        <span className="text-sm font-medium">Commandes</span>
                                        <Droplet className="h-4 w-4 text-red-500" />
                                    </>
                                }
                                Content={
                                    <>
                                    <div className="text-2xl font-bold">+250</div>
                                    <p className="text-xs text-muted-foreground">+12% cette semaine</p>
                                    </>
                                }
                                TitleClassName="flex flex-row items-center justify-between space-y-0 pb-2 "
                                ClassName="border-2 border-transparent hover:border-red-300 transition-colors duration-300"/>
                            {/* classic exemple */}
                            {/* <StatCard title="imad"
                                        icon={Droplet}
                                        value="1 284"
                                        change="+12% par rapport au mois dernier" /> */}
                        </div>
                        <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2 mt-3">
                            <Card className="h-[600] border-2 border-transparent hover:border-red-900 transition-colors duration-300">
                                    <CardHeader>
                                    <CardTitle>Niveaux de Stock de Sang</CardTitle>
                                    <CardDescription>Inventaire actuel de sang par type</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                    <BloodStockChart />
                                    </CardContent>
                                </Card>

                            <Card className="h-[600] border-2 border-transparent hover:border-red-900 transition-colors duration-300">
                                    <CardHeader>
                                    <CardTitle>Niveaux de Stock de Sang</CardTitle>
                                    <CardDescription>Inventaire actuel de sang par type</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                    <BloodTypeDistribution />
                                    </CardContent>
                                </Card>

                        </div>
                  </main>
            
        

    );
}