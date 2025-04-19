import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StatCard from "@/components/stat-card/page";
import { Droplet, HeartPulse, Thermometer } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const Overview = () => {
  return (
    <TabsContent value="Overview" className="mt-3">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="imad"
                    icon={Droplet}
                    value="1 284"
                    change="+12% par rapport au mois dernier" />
          <StatCard title="imad"
                    icon={Droplet}
                    value="1 284"
                    change="+12% par rapport au mois dernier" />
          <StatCard title="imad"
                    icon={Droplet}
                    value="1 284"
                    change="+12% par rapport au mois dernier" />
          <StatCard title="imad"
                    icon={Droplet}
                    value="70"
                    change="+12% par rapport au mois dernier" />
        </div>
        <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2 mt-3">
        <Card className="h-32 border-2 border-transparent hover:border-red-900 transition-colors duration-300">
                <CardHeader>
                  <CardTitle>Niveaux de Stock de Sang</CardTitle>
                  <CardDescription>Inventaire actuel de sang par type</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <BloodStockChart /> */}
                </CardContent>
              </Card>

        <Card className="h-32 border-2 border-transparent hover:border-red-900 transition-colors duration-300">
                <CardHeader>
                  <CardTitle>Niveaux de Stock de Sang</CardTitle>
                  <CardDescription>Inventaire actuel de sang par type</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <BloodStockChart /> */}
                </CardContent>
              </Card>

        </div>
    </TabsContent>
  )
}

export default Overview