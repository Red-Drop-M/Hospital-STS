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

export default function Admins() {
    return (
        <div className="w-full space-y-10 p-4 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-3xl tracking-tight">Users Management</h1>
                <div className="flex items-center gap-2">           
                            <Button className="gap-1 bg-red-900 hover:bg-red-800">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline-block">Add Admin</span>
                            </Button>                       
                </div>
            </div>
            
        </div>
    )
}