import React from "react";
import { UserManagementTable } from "./user-management-table";
import { DashboardLayout } from "./dashboard-layout";
import { Button } from "./ui/button";
import { PlusCircle, Import } from "lucide-react";
import { useState } from "react";

export function UserManagementPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const response = await fetch("http://localhost:8080/api/admin/students/csv", {
        method: "GET",
        headers: {
          // Add auth headers if needed
        },
      });
      if (!response.ok) throw new Error("Failed to download CSV");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("CSV download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              User Management
            </h2>
            <p className="text-muted-foreground">
              Manage all users in the certificate system
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New User
            </Button>
            <Button
              onClick={handleDownloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 shadow-md border-2 border-green-700"
              disabled={downloading}
            >
              {downloading ? (
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <Import className="mr-2 h-4 w-4" />
              )}
              Download Students CSV
            </Button>
          </div>
        </div>

        <UserManagementTable />
      </div>
    </DashboardLayout>
  );
}
