
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Overview from "./overview/page";
import Donors from "./donors/page"
import Requests from "./req/page";
const DashboardTabs= () => {
  return (
    
        <Tabs defaultValue="Overview">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="Overview">Overview</TabsTrigger>
            <TabsTrigger value="Requests" data-value="requests">
              Requests
            </TabsTrigger>
            <TabsTrigger value="Donors">Donors</TabsTrigger>
            <TabsTrigger value="Stock">Stock</TabsTrigger>
          </TabsList>
          <Overview />
          <Donors />
          <Requests/>
        </Tabs>
  );
}

export default DashboardTabs