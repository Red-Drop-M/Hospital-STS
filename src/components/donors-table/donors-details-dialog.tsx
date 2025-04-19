"use client"

import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Donor } from "@/components/donors-table/types/donors"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Phone, Mail, MapPin, Activity, User } from "lucide-react"

interface DonorDetailsDialogProps {
  donor: Donor
  children: ReactNode
}

export function DonorDetailsDialog({ donor, children }: DonorDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du Donneur</DialogTitle>
          <DialogDescription>Informations complètes sur {donor.name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="h-8 w-8 text-slate-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{donor.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {donor.id}</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getBloodTypeColor(donor.bloodType)}`}
                  >
                    {donor.bloodType}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Groupe Sanguin</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium">Âge</p>
                    <p className="text-sm text-muted-foreground">{donor.age} ans</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium">Dernière donation</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(donor.lastDonation).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium">Nombre de donations</p>
                <p className="text-sm text-muted-foreground">{donor.donationsCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">{donor.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{donor.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">{donor.address}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Historique médical</p>
            <p className="text-sm text-muted-foreground">{donor.medicalHistory}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getBloodTypeColor(bloodType: string): string {
  switch (bloodType) {
    case "A+":
    case "A-":
      return "bg-red-100 text-red-800"
    case "B+":
    case "B-":
      return "bg-blue-100 text-blue-800"
    case "AB+":
    case "AB-":
      return "bg-purple-100 text-purple-800"
    case "O+":
    case "O-":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
