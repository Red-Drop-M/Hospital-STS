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
import { Droplet, Bell, ShieldUser, User, Settings, LogOut, Users, Boxes } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getCurrentUser, logoutUser } from "@/lib/authAPI"

export default function Header() {
    // Remplacer useAuth par des états locaux et appel direct à l'API
    const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const pathname = usePathname()
    const router = useRouter();

    // Charger les données utilisateur au montage du composant
    useEffect(() => {
        async function fetchUser() {
            try {
                setIsLoading(true);
                const userData = await getCurrentUser();
                
                if (userData.success && userData.isAuthenticated) {
                    setUser({
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        role: userData.role
                    });
                    
                    // Ajouter les logs demandés pour afficher l'utilisateur et son rôle
                    console.log('====== UTILISATEUR CONNECTÉ ======');
                    console.log('Utilisateur:', userData.name);
                    console.log('Email:', userData.email);
                    console.log('Rôle:', userData.role);
                    console.log('================================');
                    
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Failed to get current user:', error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchUser();
    }, []);

    const isActive = (path: string) => {
        return pathname === path
    }

    // Liens de navigation standard pour tous les utilisateurs
    const standardNavLinks = [
        { name: "Overview", path: "/overview" },
        { name: "Requests", path: "/requests" },
        { name: "Donors", path: "/donors" },
        { name: "Stock", path: "/stock" },
        { name: "DonorPledges", path: "/donorpledges" },
    ];

    // Liens de navigation pour les administrateurs uniquement
    const adminNavLinks = [
        { name: "Services", path: "/services", icon: <Boxes className="h-4 w-4 mr-2" /> },
        { name: "Users", path: "/users", icon: <Users className="h-4 w-4 mr-2" /> },
        { name: "Admin", path: "/admins", icon: <ShieldUser className="h-4 w-4 mr-2" /> },
    ];

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            console.log('Logout response:', response);
            
            // Nettoyer l'état local
            setUser(null);
            setIsAuthenticated(false);
            
            // Rediriger vers la page de login
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            router.push('/');
        }
    };

    return (
        <>
            <div className="flex gap-6 md:gap-10">
                <Link href="/" className="flex items-center space-x-2">
                    <Droplet className="h-6 w-6 text-red-500" />
                    <span className="inline-block font-bold">RED-DROP</span>
                </Link>
                <nav className="flex gap-6">
                    {standardNavLinks.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`flex items-center text-sm font-medium ${isActive(link.path) ? 'text-foreground' : 'text-foreground/60'
                                } transition-colors hover:text-foreground/80`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className='hover:bg-red-300'>
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className='hover:bg-red-300'>
                            <User className="h-5 w-5" />
                            <span className="sr-only">Menu utilisateur</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            
                            {user?.name || 'Mon compte'}
                           
                            {user?.role && <span className="block text-xs text-muted-foreground">{user.role}</span>}
                            
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        
                        
                        {/* Options Admin uniquement */}
                        {user?.role === 'Admin' && (
                            <>
                                <DropdownMenuSeparator />
                                {adminNavLinks.map((link) => (
                                    <DropdownMenuItem key={link.path} asChild>
                                        <Link href={link.path} className="flex items-center">
                                            {link.icon}
                                            {link.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-500">
                            <LogOut className="h-4 w-4 mr-2" />
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}



