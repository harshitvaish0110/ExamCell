import React from "react";
import { ChangePasswordRequestsTable } from "./change-password-requests-table";
import { DashboardLayout } from "./dashboard-layout";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export function ChangePasswordRequestsPage() {
  const handleExportCSV = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/password-requests/export-csv");
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'password_requests.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("CSV exported successfully!");
      } else {
        toast.error("Failed to export CSV");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV");
    }
  };

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
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleExportCSV}
          >
            Export Requests
          </Button>
        </div>

        <ChangePasswordRequestsTable />
      </div>
    </DashboardLayout>
  );
}
