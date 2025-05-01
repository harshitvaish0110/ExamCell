
import React from "react"
import { UserManagementTable } from "./user-management-table"
import { DashboardLayout } from "./dashboard-layout"
import { Button } from "./ui/button"
import { PlusCircle } from "lucide-react"

export function UserManagementPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">Manage all users in the certificate system</p>
          </div>
          <Button className="bg-[#4a2639] hover:bg-[#4a2639]/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <UserManagementTable />
      </div>
    </DashboardLayout>
  )
}
