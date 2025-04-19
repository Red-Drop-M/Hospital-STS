import { BloodDonorsTable } from "@/components/donors-table/blood-donors-table"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Liste des Donneurs de Sang</h1>
      <BloodDonorsTable />
    </div>
  )
}