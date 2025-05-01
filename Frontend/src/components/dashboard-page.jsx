import React from "react"
import { DashboardLayout } from "./dashboard-layout"
import { AdminDashboard } from "./admin-dashboard"

export function DashboardPage() {
  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  )
}
