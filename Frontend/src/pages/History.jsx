"use client";

import React from "react";
import { Clock, UserRound, AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

// const dummyLogs = [
//   {
//     rollno: "CS101",
//     name: "John Doe",
//     time: "10:20:35 12/02/2024",
//     description: "Requested Bonafide Certificate",
//   },
//   {
//     rollno: "CS102",
//     name: "Jane Smith",
//     time: "11:45:10 13/02/2024",
//     description: "Requested Scholarship Letter",
//   },
//   {
//     rollno: "CS103",
//     name: "Mike Johnson",
//     time: "09:05:25 14/02/2024",
//     description: "Certificate Approved by Admin",
//   },
//   {
//     rollno: "CS104",
//     name: "Sarah Williams",
//     time: "15:30:00 15/02/2024",
//     description: "Scholarship Letter Downloaded",
//   },
//   {
//     rollno: "CS105",
//     name: "Alice Brown",
//     time: "08:15:42 16/02/2024",
//     description: "Requested Internship Certificate",
//   },
// ];

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

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const History = () => {
  const [logData, setLogData] = React.useState(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/logs");
      if (!response.ok) {
        toast.error("Failed to fetch logs");
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setLogData(data);
      toast.success("Logs fetched successfully");
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-secondary rounded-b-[2.5rem] text-foreground py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            🕘 History Logs
          </h1>
          <p className="mt-4 text-sm md:text-lg text-muted-background">
            Admin view of certificate request logs
          </p>
        </div>
      </header>

      {/* History Logs */}
      <main className="flex-1 max-w-5xl w-full px-4 py-10 mx-auto">
        <div className="grid gap-6">
          {logData?.map((log) => {
            const status = getStatusTag(log.message);
            const statusColor = getStatusColor(status);
            return (
              <div
                key={log.id}
                className="relative flex gap-4 border-l-4 border-muted pl-4 rounded-xl shadow-md bg-card p-6 transition hover:shadow-xl hover:bg-muted/50"
              >
                {/* Timeline marker */}
                <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-muted-foreground -translate-x-1/2" />

                {/* Avatar */}
                <div className="w-12 h-12 bg-muted text-foreground font-bold rounded-full flex items-center justify-center text-sm shadow-sm">
                  {log.user && getInitials(log.user)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <UserRound className="w-5 h-5 text-muted-foreground" />
                      {log.user}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(log.timestamp), 'HH:mm:ss dd/MM/yyyy')}
                  </div>

                  <div className="flex items-start gap-3 mt-3 text-sm text-foreground">
                    <AlignLeft className="w-5 h-5 text-muted-foreground mt-1" />
                    <p className="leading-relaxed">{log.message}</p>
                  </div>

                  <div className="mt-4">
                    <span
                      className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-medium",
                        statusColor,
                      )}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default History;
