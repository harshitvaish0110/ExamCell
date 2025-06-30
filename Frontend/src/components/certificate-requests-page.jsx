import React from "react";
import { CertificateRequestsTable } from "./certificate-requests-table";
import { DashboardLayout } from "./dashboard-layout";
import { StatsCards } from "./stats-cards";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckCircle, Clock, XCircle } from "lucide-react";


export function CertificateRequestsPage() {
  return (    
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Certificate Requests
            </h2>
            <p className="text-muted-foreground">
              Manage and process certificate requests
            </p>
          </div>
          
        </div>
        <StatsCards />

        <Tabs defaultValue="all">
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
  );
}
