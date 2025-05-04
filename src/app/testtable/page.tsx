"use client"
// import GenericTable from "@/components/GeneriComponents/genericTable"
// import { userColumns, User } from "./columns"
// import { usersData } from "./data"
//  import { DonorColumns , Donor } from "@/components/Donors/columns"
//  import { donors } from "@/components/Donors/data"
// export default function UsersPage() {
//   return (
//     <div className="flex min-h-screen flex-col">
//       {/* <GenericTable<User> columns={userColumns} data={usersData} /> */}
//       <GenericTable<Donor> columns={DonorColumns} data={donors} />
//     </div>
//   )
// }

import { useState } from "react"
import GenericTable from "@/components/GeneriComponents/genericTable"
import { DonorColumns , Donor } from "@/components/Donors/columns"
import { donors } from "@/components/Donors/data"

export default function DonorsPage  ()  {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10
  
  // Simulez des données paginées (remplacez par votre vraie logique d'API)
  const paginatedData = donors.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(donors.length / pageSize)

  return (
    <div className="p-4">
      <GenericTable<Donor>
        columns={DonorColumns}
        data={paginatedData}
        pageCount={pageCount}
        pageIndex={pageIndex}
        onPageChange={setPageIndex}
      />
    </div>
  )
}