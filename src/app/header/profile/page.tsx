"use client"
import Link from 'next/link';
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
import Admin from "../admin/page"

const Profile = () => {
  return (
    <>
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
    </>
  )
}

export default Profile