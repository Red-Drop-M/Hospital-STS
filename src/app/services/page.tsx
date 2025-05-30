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
import { Plus, Search, PlusCircle, XCircle, Pencil, Trash2 } from "lucide-react"
import GenericTable from "@/components/GeneriComponents/genericTable"
import { Service, ServiceColumns } from "@/app/services/Columns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GenericForm } from '@/components/GeneriComponents/GenericForm'
import { Input } from "@/components/ui/input"
import PaginationComponent from "@/components/GeneriComponents/PaginationComponent"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { getAllServices, createService, updateService, deleteService } from "@/lib/serviceAPI"

// Schéma de validation pour le formulaire
const serviceSchema = z.object({
    Name: z.string().min(2, "Le nom du service doit contenir au moins 2 caractères").max(50, "Le nom du service ne peut pas dépasser 50 caractères"),
});

export default function Services(){
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const { toast } = useToast()
    const pageSize = 10    // Charger les services
    const pageCount = Math.ceil(totalCount / pageSize);
    useEffect(() => {
        fetchServices()
    }, [pageIndex])

    const fetchServices = async () => {
        try {
            setLoading(true)
            const response = await getAllServices({
                page: pageIndex + 1,
                pageSize
            })

            if (response.data) {
                console.log('Services received:', response.data.services)
                setServices(response.data.services)
                setTotalCount(response.data.total)
            } else {
                toast({
                    title: "Erreur",
                    description: response.error || "Impossible de charger les services",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Erreur lors du chargement des services:", error)
            toast({
                title: "Erreur",
                description: "Impossible de charger les services",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    // Gérer l'ajout d'un service
    const handleAddService = async (values: z.infer<typeof serviceSchema>) => {
        try {
            setSubmitLoading(true)
            const response = await createService(values)

            if (response.data) {
                toast({
                    title: "Succès",
                    description: "Service ajouté avec succès",
                })
                setAddModalOpen(false)
                fetchServices()
            } else {
                toast({
                    title: "Erreur",
                    description: response.error || "Impossible d'ajouter le service",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du service:", error)
            toast({
                title: "Erreur",
                description: "Impossible d'ajouter le service",
                variant: "destructive",
            })
        } finally {
            setSubmitLoading(false)
        }
    }

    // Gérer la mise à jour d'un service
    const handleUpdateService = async (values: z.infer<typeof serviceSchema>) => {
        if (!selectedService) return

        try {
            setSubmitLoading(true)
            const response = await updateService(selectedService.id, values)

            if (response.data) {
                toast({
                    title: "Succès",
                    description: "Service mis à jour avec succès",
                })
                setEditModalOpen(false)
                fetchServices()
            } else {
                toast({
                    title: "Erreur",
                    description: response.error || "Impossible de mettre à jour le service",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du service:", error)
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le service",
                variant: "destructive",
            })
        } finally {
            setSubmitLoading(false)
        }
    }

    // Gérer la suppression d'un service
    const handleDeleteService = async () => {
        if (!selectedService) return

        try {
            setSubmitLoading(true)
            const response = await deleteService(selectedService.id)

            if (response.statusCode === 204) {
                toast({
                    title: "Succès",
                    description: "Service supprimé avec succès",
                })
                setDeleteConfirmOpen(false)
                fetchServices()
            } else {
                toast({
                    title: "Erreur",
                    description: response.error || "Impossible de supprimer le service",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du service:", error)
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le service",
                variant: "destructive",
            })
        } finally {
            setSubmitLoading(false)
        }
    }

    // Ouvrir la modale d'édition
    const openEditModal = (service: Service) => {
        setSelectedService(service)
        setEditModalOpen(true)
    }

    // Ouvrir la confirmation de suppression
    const openDeleteConfirm = (service: Service) => {
        setSelectedService(service)
        setDeleteConfirmOpen(true)
    }

    // Filtrer les services en fonction de la recherche
    const filteredServices = services.filter(service => 
        (service?.Name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )

    // Gérer les clics sur les boutons d'action
    const handleActionClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement
        const button = target.closest('button[data-action]')
        
        if (!button) return
        
        const action = button.getAttribute('data-action')
        const serviceId = button.getAttribute('data-service-id')
        
        if (!serviceId) return
        
        const service = services.find(s => s.id === serviceId)
        if (!service) return
        
        if (action === 'edit') {
            openEditModal(service)
        } else if (action === 'delete') {
            openDeleteConfirm(service)
        }
    }
        return (
        <ProtectedRoute requiredRole="User">
            <div className="w-full space-y-10 p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-3xl tracking-tight">Services Management</h1>
                    <div className="flex items-center gap-2">           
                                <Button 
                                    className="gap-1 bg-red-900 hover:bg-red-800"
                                    onClick={() => setAddModalOpen(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden sm:inline-block">Add Service</span>
                                </Button>                       
                    </div>
                </div>
                <Card className="mt-3 hover:border-red-900 transition-colors duration-300">
                    <CardHeader>
                            <CardTitle className="text-xl">Services Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mt-4 p-10" onClick={handleActionClick}>
                            <GenericTable<Service>
                                columns={ServiceColumns}
                                data={filteredServices}
                                pageCount={pageCount}
                                pageIndex={pageIndex}
                                onPageChange={setPageIndex}
                            />
                        </div>
                    </CardContent> 
                </Card>

                {/* Modal d'ajout de service */}
                <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Ajouter un nouveau service</DialogTitle>
                            <DialogDescription>
                                Créez un nouveau service pour l'hôpital.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <GenericForm
                            formSchema={serviceSchema}
                            onSubmit={handleAddService}
                            submitButtonText="Ajouter"
                            defaultValues={{
                                Name: ""
                            }}
                            fields={[
                                {
                                    name: "Name",
                                    label: "Nom du service",
                                    type: "text",
                                    placeholder: "Entrez le nom du service",
                                    required: true
                                }
                            ]}
                        />
                    </DialogContent>
                </Dialog>

                {/* Modal de modification de service */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Modifier le service</DialogTitle>
                            <DialogDescription>
                                Modifiez les informations du service.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <GenericForm
                            formSchema={serviceSchema}
                            onSubmit={handleUpdateService}
                           submitButtonText="Mettre à jour"
                            defaultValues={{
                                Name: selectedService?.Name || ""
                            }}
                            fields={[
                                {
                                    name: "Name",
                                    label: "Nom du service",
                                    type: "text",
                                    placeholder: "Entrez le nom du service",
                                    required: true
                                }
                            ]}
                        />
                    </DialogContent>
                </Dialog>

                {/* Modal de confirmation de suppression */}
                <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce service? Cette action ne peut pas être annulée.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                                Annuler
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={handleDeleteService}
                                disabled={submitLoading}
                            >
                                {submitLoading ? "Suppression..." : "Supprimer"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </ProtectedRoute>
        )
    
}
