"use client"

import { useEffect, useRef, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { fetchBloodStockChartData } from "@/app/services/stockService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { BloodStockChartData } from "@/types/stock"

export default function BloodStockChart() {
  const [data, setData] = useState<BloodStockChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bloodBagType, setBloodBagType] = useState("Plasma");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const chartData = await fetchBloodStockChartData(bloodBagType);
        setData(chartData);
      } catch (error) {
        console.error("Error loading blood stock:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bloodBagType]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[180px] ml-auto" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Stock Sanguin Global</h3>
        <Select value={bloodBagType} onValueChange={setBloodBagType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de poche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Plasma">Plasma</SelectItem>
            <SelectItem value="Plaquette">Plaquette</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} unités`,
                name === 'units' ? 'Disponible' : 'Seuil critique'
              ]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="units"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              name="Disponible"
            />
            <Bar
              dataKey="critical"
              fill="#f87171"
              radius={[4, 4, 0, 0]}
              name="Seuil critique"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}