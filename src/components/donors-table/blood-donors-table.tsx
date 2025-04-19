"use client"

import { useState, useEffect } from "react"
import {columns} from "./columns"
import { DataTable } from "./data-table"
import type { Donor } from "./types/donors"

const data: Donor[] = [
  {
    id: "1",
    name: "Jean Dupont",
    bloodType: "A+",
    lastDonation: "2023-10-15",
    donationsCount: 5,
    age: 35,
    phone: "+33 6 12 34 56 78",
    email: "jean.dupont@example.com",
    address: "123 Rue de Paris, 75001 Paris",
    medicalHistory: "Aucun problème de santé connu",
  },
  {
    id: "2",
    name: "Marie Martin",
    bloodType: "O-",
    lastDonation: "2023-11-20",
    donationsCount: 12,
    age: 42,
    phone: "+33 6 23 45 67 89",
    email: "marie.martin@example.com",
    address: "456 Avenue des Champs-Élysées, 75008 Paris",
    medicalHistory: "Allergie légère aux arachides",
  },
  {
    id: "3",
    name: "Pierre Dubois",
    bloodType: "B+",
    lastDonation: "2023-09-05",
    donationsCount: 3,
    age: 28,
    phone: "+33 6 34 56 78 90",
    email: "pierre.dubois@example.com",
    address: "789 Boulevard Saint-Michel, 75005 Paris",
    medicalHistory: "Tension artérielle légèrement élevée",
  },
  {
    id: "4",
    name: "Sophie Leroy",
    bloodType: "AB+",
    lastDonation: "2023-12-01",
    donationsCount: 8,
    age: 31,
    phone: "+33 6 45 67 89 01",
    email: "sophie.leroy@example.com",
    address: "101 Rue de Rivoli, 75001 Paris",
    medicalHistory: "Aucun problème de santé",
  },
  {
    id: "5",
    name: "Thomas Bernard",
    bloodType: "A-",
    lastDonation: "2023-08-12",
    donationsCount: 15,
    age: 45,
    phone: "+33 6 56 78 90 12",
    email: "thomas.bernard@example.com",
    address: "202 Avenue Montaigne, 75008 Paris",
    medicalHistory: "Cholestérol légèrement élevé",
  },
  {
    id: "6",
    name: "Camille Petit",
    bloodType: "O+",
    lastDonation: "2023-11-10",
    donationsCount: 7,
    age: 29,
    phone: "+33 6 67 89 01 23",
    email: "camille.petit@example.com",
    address: "303 Rue Saint-Honoré, 75001 Paris",
    medicalHistory: "Aucun problème de santé",
  },
  {
    id: "7",
    name: "Lucas Moreau",
    bloodType: "B-",
    lastDonation: "2023-10-25",
    donationsCount: 4,
    age: 33,
    phone: "+33 6 78 90 12 34",
    email: "lucas.moreau@example.com",
    address: "404 Boulevard Haussmann, 75008 Paris",
    medicalHistory: "Légère anémie dans le passé",
  },
  {
    id: "8",
    name: "Emma Richard",
    bloodType: "AB-",
    lastDonation: "2023-09-18",
    donationsCount: 10,
    age: 38,
    phone: "+33 6 89 01 23 45",
    email: "emma.richard@example.com",
    address: "505 Rue de la Paix, 75002 Paris",
    medicalHistory: "Aucun problème de santé",
  },
  {
    id: "9",
    name: "Hugo Simon",
    bloodType: "A+",
    lastDonation: "2023-12-05",
    donationsCount: 6,
    age: 27,
    phone: "+33 6 90 12 34 56",
    email: "hugo.simon@example.com",
    address: "606 Avenue Victor Hugo, 75016 Paris",
    medicalHistory: "Aucun problème de santé",
  },
  {
    id: "10",
    name: "Léa Fournier",
    bloodType: "O+",
    lastDonation: "2023-11-30",
    donationsCount: 9,
    age: 36,
    phone: "+33 6 01 23 45 67",
    email: "lea.fournier@example.com",
    address: "707 Rue du Faubourg Saint-Honoré, 75008 Paris",
    medicalHistory: "Légère allergie saisonnière",
  },
  {
    id: "11",
    name: "Nathan Morel",
    bloodType: "B+",
    lastDonation: "2023-10-10",
    donationsCount: 2,
    age: 25,
    phone: "+33 6 12 34 56 78",
    email: "nathan.morel@example.com",
    address: "808 Boulevard Saint-Germain, 75007 Paris",
    medicalHistory: "Aucun problème de santé",
  },
  {
    id: "12",
    name: "Chloé Lefebvre",
    bloodType: "AB+",
    lastDonation: "2023-09-22",
    donationsCount: 11,
    age: 41,
    phone: "+33 6 23 45 67 89",
    email: "chloe.lefebvre@example.com",
    address: "909 Rue de Vaugirard, 75015 Paris",
    medicalHistory: "Aucun problème de santé",
  },
]

export function BloodDonorsTable() {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 5
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([])
  const [filteredData, setFilteredData] = useState<Donor[]>(data)

  // Appliquer les filtres
  useEffect(() => {
    let result = [...data]

    // Appliquer le filtre global
    if (globalFilter) {
      const lowercasedFilter = globalFilter.toLowerCase()
      result = result.filter((donor) => {
        return (
          donor.name.toLowerCase().includes(lowercasedFilter) ||
          donor.bloodType.toLowerCase().includes(lowercasedFilter) ||
          donor.email.toLowerCase().includes(lowercasedFilter) ||
          donor.id.toLowerCase().includes(lowercasedFilter)
        )
      })
    }

    // Appliquer les filtres de colonnes
    if (columnFilters.length > 0) {
      columnFilters.forEach((filter) => {
        if (filter.id === "bloodType") {
          result = result.filter((donor) => filter.value.includes(donor.bloodType))
        } else if (filter.id === "donationsCount") {
          const [min, max] = filter.value
          result = result.filter((donor) => donor.donationsCount >= min && donor.donationsCount <= max)
        } else if (filter.id === "lastDonation") {
          const [startDate, endDate] = filter.value
          if (startDate && endDate) {
            result = result.filter((donor) => {
              const donationDate = new Date(donor.lastDonation)
              return donationDate >= new Date(startDate) && donationDate <= new Date(endDate)
            })
          }
        }
      })
    }

    setFilteredData(result)
    setPageIndex(0) // Réinitialiser à la première page après filtrage
  }, [globalFilter, columnFilters])

  // Pagination des données filtrées
  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      pageCount={Math.ceil(filteredData.length / pageSize)}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      totalRows={filteredData.length}
    />
  )
}
