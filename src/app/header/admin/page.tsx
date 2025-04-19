"use client"
import Link from 'next/link'
import { ShieldUser } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


const Admin = () => {
  return ( 
    <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="focus:outline-none focus:ring-0 border-2 border-transparent hover:border-red-300 transition-colors duration-300">
                <ShieldUser className="h-5 w-5" />
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
    </>
  )
}

export default Admin