"use client"

import { Bell, Check, Clock, Droplet, Info, User } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const Notification = () => {
    
    // const [userNotifications, setUserNotifications] = useState<string>();// type of notification
    // const markAllAsRead = () => {
    //     setUserNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    //     setUnreadCount(0)
    //}
    return (
        <div className="flex flex-1 justify-end items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative  hover:bg-red-300">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[380px]">
                <DropdownMenuLabel >Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator  />
                    <DropdownMenuLabel></DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        
       
    )
}

export default Notification