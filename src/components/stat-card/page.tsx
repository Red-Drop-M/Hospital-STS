import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    icon: LucideIcon;
    value: string | number;
    change: string;
    color?: string ;
  }

export const StatCard = ({ title, icon: Icon,value, change, color = "text-red-600" }: StatCardProps) => {
    
    return (
    <Card className='border-2 border-transparent hover:border-red-300   transition-colors duration-300'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription><Icon className={`h-4 w-4 ${color}`} /></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
};


export default StatCard

 