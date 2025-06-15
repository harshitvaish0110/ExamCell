import React from "react";
import { Download } from "lucide-react";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const logs = [
  {
    action: "Certificate Approved",
    user: "Admin",
    timestamp: "Today, 10:30 AM",
  },
  {
    action: "New Template Added",
    user: "Admin",
    timestamp: "Today, 09:15 AM",
  },
  {
    action: "User Account Created",
    user: "System",
    timestamp: "Yesterday, 04:45 PM",
  },
  {
    action: "Certificate Request Rejected",
    user: "Admin",
    timestamp: "Yesterday, 02:30 PM",
  },
  {
    action: "Template Modified",
    user: "Admin",
    timestamp: "Yesterday, 11:20 AM",
  },
];

export function LogsSection() {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <CardDescription>Recent activities in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div>
                <p className="font-medium">{log.action}</p>
                <p className="text-sm text-muted-foreground">By {log.user}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </CardFooter>
    </Card>
  );
}
