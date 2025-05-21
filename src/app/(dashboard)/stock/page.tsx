import { Button } from '@/components/ui/button'
import { ChevronDown, Filter } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Stock() {
    const bloodStocks = [ 
        {type:"A+" , stock:78 , critical:20},
        {type:"A-" , stock:62 , critical:23},
        {type:"B+" , stock:98 , critical:15},
        {type:"B-" , stock: 54, critical:15},
        {type:"AB+" , stock:28 , critical:20},
        {type:"AB-" , stock:71 , critical:20},
        {type:"O+" , stock:65 , critical:30},
        {type:"O-" , stock:83 , critical:30},
    ];

    const getProgressColor = (stock: number, critical: number) => {
        if (stock < critical) {
            return "bg-red-600";
        } else if (stock < critical * 2) {
            return "bg-yellow-500";
        }
        return "bg-green-500";
    };

    return (
        <main className="w-full space-y-10 p-4 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">CTS Stock</h1> 
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button className="focus:outline-none focus:ring-0 gap-1 bg-gray-200 text-black hover:bg-gray-100">
                                    <Filter className="h-4 w-4" />
                                    <span className="hidden sm:inline-block">Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <h1>Blood</h1>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <h1 >Plaquette</h1>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Plasma</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button className="gap-1 bg-red-900 hover:bg-red-800">
                                <ChevronDown className="h-4 w-4" />
                                <span className="hidden sm:inline-block">Blood Stock</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="p-6">
                            <div className="mx-auto w-full max-w-md">
                            <h2 className="text-center text-xl font-bold mb-4">Blood Stock Levels</h2>
                                <Carousel>
                                    <CarouselContent>
                                    {bloodStocks.map((blood) => (
                                    <CarouselItem key={blood.type}>
                                        <div className="p-6 bg-white rounded-lg border shadow-sm">
                                            <h3 className="text-lg font-semibold text-center mb-3">
                                                Groupe {blood.type}
                                            </h3>
                                            <div className="flex justify-between mb-1">
                                                <span>Current stock:</span>
                                                <span className="font-medium">{blood.stock}%</span>
                                            </div>
                                            {/* Progress personnalisé avec fond gris et couleur dynamique */}
                                            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${getProgressColor(blood.stock, blood.critical)}`}
                                                    style={{ width: `${blood.stock}%` }}
                                                />
                                            </div>
                                            <div className="mt-2 text-sm">
                                                {blood.stock < blood.critical ? (
                                                <span className="text-red-600 font-medium">Critical stock!</span>
                                                ) : blood.stock < blood.critical * 2 ? (
                                                <span className="text-yellow-600">Low stock</span>
                                                ) : (
                                                <span className="text-green-600">Adequate stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </CarouselItem>
                                    ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
            <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
                <CardHeader>
                    <CardTitle className="text-xl">Stock Table</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full mt-4">
                        
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}