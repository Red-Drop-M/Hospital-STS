import GenericTable from "@/components/generic-table/genericTable"
import { userColumns, User } from "./columns"
import { usersData } from "./data"

export default function UsersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <GenericTable<User> columns={userColumns} data={usersData} />
    </div>
  )
}
