import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const getStatusTag = (desc) => {
  if (desc.toLowerCase().includes("requested")) return "Requested";
  if (desc.toLowerCase().includes("signed")) return "Approved";
  if (desc.toLowerCase().includes("generated")) return "Generated";
  return "Info";
};

const getStatusColor = (status) => {
  switch (status) {
    case "Requested":
      return "bg-yellow-200 text-yellow-800";
    case "Approved":
      return "bg-green-200 text-green-800";
    case "Generated":
      return "bg-blue-200 text-blue-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export function LogsSection() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/logs");
      const data = await response.json();
      const sortedData = data
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      setLogs(sortedData);
    } catch (error) {
      toast.error("Failed to load system logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>
            {[...Array(5)].map((_, index) => (
              <div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(
              logs.map((log, index) => {
                const status = getStatusTag(log.message);
                const statusColor = getStatusColor(status);
                return (
                  <div
                    key={log.id || index}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{log.user || "System"}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}> {status} </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2"> {log.message} </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={() => window.location.href = '/history'}
        >
          View All Logs
        </Button>
      </CardFooter>
    </Card>
  );
}
