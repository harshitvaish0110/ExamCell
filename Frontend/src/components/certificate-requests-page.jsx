import React from "react"
import { CertificateRequestsTable } from "./certificate-requests-table"
import { DashboardLayout } from "./dashboard-layout"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { CheckCircle, Clock, XCircle } from "lucide-react"

export function CertificateRequestsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Certificate Requests</h2>
            <p className="text-muted-foreground">Manage and process certificate requests</p>
          </div>
          <Button className="bg-[#4a2639] hover:bg-[#4a2639]/90 text-white">Export Requests</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-[#4a2639]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-[#ffe2f3]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
            </CardContent>
          </Card>
          <Card className="border-[#4a2639]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">845</div>
            </CardContent>
          </Card>
          <Card className="border-[#4a2639]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="bg-[#4a2639]/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#4a2639] data-[state=active]:text-white">
              All Requests
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-[#4a2639] data-[state=active]:text-white">
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-[#4a2639] data-[state=active]:text-white">
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-[#4a2639] data-[state=active]:text-white">
              Rejected
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <CertificateRequestsTable />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <CertificateRequestsTable />
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <CertificateRequestsTable />
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <CertificateRequestsTable />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
