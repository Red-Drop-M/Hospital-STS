"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {Droplet, Bell, ShieldUser, User} from "lucide-react"
import { usePathname } from "next/navigation"

export default function  Header () {
    
    // const [userNotifications, setUserNotifications] = useState<string>();// type of notification
    // const markAllAsRead = () => {
    //     setUserNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    //     setUnreadCount(0)
    //}

    const pathname = usePathname()
    const isActive = (path: string) => {
        return pathname === path
      }

    const navLinks = [
        {name : "Overview ", path: "/overview"},
        {name : "Requests ", path: "/requests"},
        {name : "Donors ", path: "/donors"},
        {name : "Stock ", path: "/stock"},
        {name : "DonorPledges ", path: "/donorpledges"},
    ]

    return (
        <>
            {/* logo section  */}
            <div className="flex gap-2 items-center p-2">
                <Droplet className="text-white bg-red-900 p-1 h-8 w-8 rounded-full  "/>
                <span className="text-xl font-semibold tracking-tight"> Red Drop </span>
            </div>
            {/* nav bar  */}
            <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                <Link href={link.path} key={link.path} className="h-full">
                    <Button
                    variant="ghost"
                    className={`relative px-4 h-full ${
                        isActive(link.path)
                        ? "bg-[hsla(var(--hover),0.1)] font-medium border-b-2 border-[hsl(var(--hover))] rounded-none"
                        : "hover:bg-[hsla(var(--hover),0.05)]"
                    }`}
                    >
                    {link.name}
                    </Button>
                </Link>
                ))}
            </nav>

            {/* settings */}
            <div className="flex justify-end items-center gap-4 pr-2"> 
                
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="relative  hover:bg-red-300">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[380px]">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Admin */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="focus:outline-none focus:ring-0 border-2 border-transparent hover:border-red-300 transition-colors duration-300">
                            <ShieldUser className="h-5 w-5" />
                            <span className="sr-only">Menu utilisateur</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/services">Services</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/users">Users</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admins">Admin</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className='hover:bg-red-300'>
                            <User className="h-5 w-5" />
                            <span className="sr-only">Menu utilisateur</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/account">Profil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings">Parametres</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Deconnexion</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            
            </div>
        </>
    )

}



