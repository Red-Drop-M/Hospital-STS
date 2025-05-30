"use client"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import GenericTable from "@/components/GeneriComponents/genericTable"
import { UserDTO, UserColumns } from "@/app/users/Columns"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GenericForm } from '@/components/GeneriComponents/GenericForm'
import { Input } from "@/components/ui/input"
import PaginationComponent from "@/components/GeneriComponents/PaginationComponent"
import { getAllUsers, createUser, updateUser, deleteUser } from "@/lib/userAPI"

// Schéma de validation pour le formulaire utilisateur
const userSchema = z.object({
    FirstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    LastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    Email: z.string().email("Email invalide"),
    Role: z.enum(["Admin", "User"], {
        required_error: "Veuillez sélectionner un rôle",
    }),
    Password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .optional()
        .or(z.literal('')),
});

export default function Users() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;
    const pageCount = Math.ceil(totalCount / pageSize);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    
    const { toast } = useToast();

    // Fonction pour récupérer les utilisateurs depuis l'API
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            console.log("Tentative de récupération des utilisateurs...");
            const { data, error } = await getAllUsers({ 
                page: pageIndex + 1, 
                pageSize 
            });

            if (error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
                toast({
                    title: "Erreur",
                    description: "Impossible de récupérer les utilisateurs. " + error,
                    variant: "destructive",
                });
                return;
            }

            if (data && data.users) {
                console.log("Utilisateurs récupérés:", data.users);
                setUsers(data.users);
                setTotalCount(data.total || data.users.length);
            } else {
                console.error("Format de données inattendu:", data);
                toast({
                    title: "Erreur",
                    description: "Format de données inattendu de l'API",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
            toast({
                title: "Erreur",
                description: "Une erreur s'est produite lors de la récupération des utilisateurs.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Charger les utilisateurs au chargement de la page et lors du changement de page
    useEffect(() => {
        fetchUsers();
    }, [pageIndex]);

    // Gérer l'ajout d'un utilisateur
    const handleAddUser = async (values: z.infer<typeof userSchema>) => {
        try {
            setSubmitLoading(true);
            console.log("Soumission du formulaire avec les valeurs:", values);
            
            const response = await createUser(values);
            console.log("Réponse du serveur:", response);

            if (response.data) {
                toast({
                    title: "Succès",
                    description: "Utilisateur créé avec succès",
                });
                setAddModalOpen(false);
                fetchUsers(); // Rafraîchir la liste
            } else {
                toast({
                    title: "Erreur",
                    description: response.error || "Impossible de créer l'utilisateur",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error);
            toast({
                title: "Erreur",
                description: "Impossible de créer l'utilisateur",
                variant: "destructive",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    // Gérer la mise à jour d'un utilisateur
    const handleUpdateUser = async (values: z.infer<typeof userSchema>) => {
        if (!selectedUser) return;

        try {
            setSubmitLoading(true);
            console.log("Mise à jour de l'utilisateur avec les valeurs:", values);
            
            const response = await updateUser(selectedUser.id, values);
            console.log("Réponse du serveur pour la mise à jour:", response);

            if (response.data) {
                toast({
                    title: "Succès",
                    description: "Utilisateur mis à jour avec succès",
                });
                setEditModalOpen(false);
                fetchUsers(); // Rafraîchir la liste
            } else {
                toast({
                    title: "Erreur",
                    description: response.error || "Impossible de mettre à jour l'utilisateur",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour l'utilisateur",
                variant: "destructive",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    // Gérer la suppression d'un utilisateur
    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        try {
            setSubmitLoading(true);
            console.log("Suppression de l'utilisateur:", selectedUser.id);
            
            const response = await deleteUser(selectedUser.id);
            console.log("Réponse du serveur pour la suppression:", response);
            
            if (response.statusCode === 204 || response.statusCode === 200) {
                toast({
                    title: "Succès",
                    description: "Utilisateur supprimé avec succès",
                });
                setDeleteConfirmOpen(false);
                fetchUsers(); // Rafraîchir la liste
            } else {
                toast({
                    title: "Erreur",
                    description: response.error || "Impossible de supprimer l'utilisateur",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error);
            toast({
                title: "Erreur",
                description: "Impossible de supprimer l'utilisateur",
                variant: "destructive",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    // Ouvrir la modale d'édition
    const openEditModal = (user: UserDTO) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    // Ouvrir la confirmation de suppression
    const openDeleteConfirm = (user: UserDTO) => {
        setSelectedUser(user);
        setDeleteConfirmOpen(true);
    };

    // Filtrer les utilisateurs en fonction de la recherche
    const filteredUsers = users.filter(user => 
        (user?.FirstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user?.LastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user?.Email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    // Gérer les clics sur les boutons d'action
    const handleActionClick = (e: React.MouseEvent<HTMLElement>) => {
        console.log("Action click detected");
        const target = e.target as HTMLElement;
        const button = target.closest('button[data-action]');
        
        if (!button) {
            console.log("No action button found");
            return;
        }
        
        const action = button.getAttribute('data-action');
        const userId = button.getAttribute('data-user-id');
        
        console.log(`Action: ${action}, UserID: ${userId}`);
        
        if (!userId) return;
        
        const user = users.find(u => u.id === userId);
        if (!user) {
            console.log("User not found");
            return;
        }
        
        if (action === 'edit') {
            console.log("Opening edit modal for user:", user);
            openEditModal(user);
        } else if (action === 'delete') {
            console.log("Opening delete confirmation for user:", user);
            openDeleteConfirm(user);
        }
    };

    return (
        <ProtectedRoute requiredRole="Admin">
            <div className="w-full space-y-10 p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-3xl tracking-tight">Users Management</h1>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un utilisateur..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>           
                        <Button 
                            className="gap-1 bg-red-900 hover:bg-red-800"
                            onClick={() => setAddModalOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline-block">Add User</span>
                        </Button>                       
                    </div>
                </div>
                <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl">Users Table</CardTitle>
                        <CardDescription>
                            Manage system users and their permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-10">
                                <p>Chargement des utilisateurs...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-10">
                                <p>Aucun utilisateur trouvé.</p>
                            </div>
                        ) : (
                            <div className="w-full mt-4" onClick={handleActionClick}>
                                <GenericTable<UserDTO>
                                    columns={UserColumns}
                                    data={filteredUsers}
                                    pageCount={pageCount}
                                    pageIndex={pageIndex}
                                    onPageChange={setPageIndex}
                                />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {pageCount > 1 && (
                            <PaginationComponent
                                currentPage={pageIndex}
                                pageCount={pageCount}
                                onPageChange={setPageIndex}
                            />
                        )}
                    </CardFooter>
                </Card>

                {/* Modal d'ajout d'utilisateur */}
                <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                            <DialogDescription>
                                Créez un nouvel utilisateur avec les permissions appropriées.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <GenericForm
                            formSchema={userSchema}
                            fields={[
                                {
                                    name: "FirstName",
                                    label: "Prénom",
                                    type: "text",
                                    placeholder: "Entrez le prénom",
                                    required: true
                                },
                                {
                                    name: "LastName",
                                    label: "Nom",
                                    type: "text",
                                    placeholder: "Entrez le nom",
                                    required: true
                                },
                                {
                                    name: "Email",
                                    label: "Email",
                                    type: "email",
                                    placeholder: "Entrez l'email",
                                    required: true
                                },
                                {
                                    name: "Password",
                                    label: "Mot de passe",
                                    type: "password",
                                    placeholder: "Entrez le mot de passe",
                                    required: true
                                },
                                {
                                    name: "Role",
                                    label: "Rôle",
                                    type: "select",
                                    options: [
                                        { value: "User", label: "Utilisateur" },
                                        { value: "Admin", label: "Administrateur" }
                                    ],
                                    placeholder: "Sélectionnez un rôle",
                                    required: true
                                }
                            ]}
                            onSubmit={handleAddUser}
                            loading={submitLoading}
                            submitButtonText="Ajouter"
                            defaultValues={{
                                FirstName: "",
                                LastName: "",
                                Email: "",
                                Password: "",
                                Role: "User"
                            }}
                        />
                    </DialogContent>
                </Dialog>

                {/* Modal de modification d'utilisateur */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                            <DialogDescription>
                                Modifiez les informations de l'utilisateur.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <GenericForm
                            formSchema={userSchema}
                            fields={[
                                {
                                    name: "FirstName",
                                    label: "Prénom",
                                    type: "text",
                                    placeholder: "Entrez le prénom",
                                    required: true
                                },
                                {
                                    name: "LastName",
                                    label: "Nom",
                                    type: "text",
                                    placeholder: "Entrez le nom",
                                    required: true
                                },
                                {
                                    name: "Email",
                                    label: "Email",
                                    type: "email",
                                    placeholder: "Entrez l'email",
                                    required: true
                                },
                                {
                                    name: "Password",
                                    label: "Mot de passe",
                                    type: "password",
                                    placeholder: "Laissez vide pour ne pas changer",
                                    required: false
                                },
                                {
                                    name: "Role",
                                    label: "Rôle",
                                    type: "select",
                                    options: [
                                        { value: "User", label: "Utilisateur" },
                                        { value: "Admin", label: "Administrateur" }
                                    ],
                                    placeholder: "Sélectionnez un rôle",
                                    required: true
                                }
                            ]}
                            onSubmit={handleUpdateUser}
                            loading={submitLoading}
                            submitButtonText="Mettre à jour"
                            defaultValues={{
                                FirstName: selectedUser?.FirstName || "",
                                LastName: selectedUser?.LastName || "",
                                Email: selectedUser?.Email || "",
                                Password: "",
                                Role: selectedUser?.Role || "User"
                            }}
                        />
                    </DialogContent>
                </Dialog>

                {/* Modal de confirmation de suppression */}
                <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer cet utilisateur? Cette action ne peut pas être annulée.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                                Annuler
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={handleDeleteUser}
                                disabled={submitLoading}
                            >
                                {submitLoading ? "Suppression..." : "Supprimer"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </ProtectedRoute>
    );
}


