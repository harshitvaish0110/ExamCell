import React from "react";
import { ChangePasswordRequestsTable } from "./change-password-requests-table";
import { DashboardLayout } from "./dashboard-layout";
import { Button } from "./ui/button";

export function ChangePasswordRequestsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Change Password Requests
            </h2>
            <p className="text-muted-foreground">
              Manage and process certificate requests
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Export Requests
          </Button>
        </div>

        <ChangePasswordRequestsTable />
      </div>
    </DashboardLayout>
  );
}
