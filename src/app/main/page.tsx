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

import DashboardTabs from "./tabs/page"
const Main = () => {
  return (
    <>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">CTS Dashboard</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto flex gap-1 focus:outline-none focus:ring-0 border-2 border-transparent hover:border-red-300 transition-colors duration-300">
                  <Filter className="h-4 w-4 " /> 
                  <span className="hidden sm:inline-block">Filtrer</span>
                  <ChevronDown className="h-4 w-4 " />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <Button className="gap-1" onClick={() => setRequestModalOpen(true)}> */}
            <Button className="gap-1 bg-red-900" >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block">Nouvelle Demande</span>
            </Button>
          </div>
        </div>
         <DashboardTabs />
        </>
  )
}

export default Main