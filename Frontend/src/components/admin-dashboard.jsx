import React from "react";
import { CertificateRequestsTable } from "./certificate-requests-table";
import { LogsSection } from "./logs-section";
import { StatsCards } from "./stats-cards";
import { TemplatesTable } from "./templates-table";
import { UserManagementTable } from "./user-management-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, Admin
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your certificate generation system
        </p>
      </div>

      <StatsCards />

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto bg-primary/10">
          <TabsTrigger
            value="requests"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Certificate Requests
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            User Management
          </TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="mt-4">
          <CertificateRequestsTable />
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <TemplatesTable />
        </TabsContent>
        <TabsContent value="users" className="mt-4">
          <UserManagementTable />
        </TabsContent>
      </Tabs>

      <LogsSection />
    </div>
  );
}
