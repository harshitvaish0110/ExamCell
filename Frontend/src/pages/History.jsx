"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, UserRound, AlignLeft, Hash, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const dummyLogs = [
  {
    rollno: "CS101",
    name: "John Doe",
    time: "10:20:35 12/02/2024",
    description: "Requested Bonafide Certificate",
  },
  {
    rollno: "CS102",
    name: "Jane Smith",
    time: "11:45:10 13/02/2024",
    description: "Requested Scholarship Letter",
  },
  {
    rollno: "CS103",
    name: "Mike Johnson",
    time: "09:05:25 14/02/2024",
    description: "Certificate Approved by Admin",
  },
  {
    rollno: "CS104",
    name: "Sarah Williams",
    time: "15:30:00 15/02/2024",
    description: "Scholarship Letter Downloaded",
  },
  {
    rollno: "CS105",
    name: "Alice Brown",
    time: "08:15:42 16/02/2024",
    description: "Requested Internship Certificate",
  },
]

const getStatusTag = (desc) => {
  if (desc.toLowerCase().includes("requested")) return "Requested"
  if (desc.toLowerCase().includes("approved")) return "Approved"
  if (desc.toLowerCase().includes("downloaded")) return "Downloaded"
  return "Info"
}

const getStatusColor = (status) => {
  switch (status) {
    case "Requested":
      return "bg-yellow-200 text-yellow-800"
    case "Approved":
      return "bg-green-200 text-green-800"
    case "Downloaded":
      return "bg-blue-200 text-blue-800"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

const History = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-foreground text-primary-foreground py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            🕘 History Logs
          </h1>
          <p className="mt-4 text-sm md:text-lg text-secondary">
            Admin view of certificate request logs
          </p>
        </div>
      </header>

      {/* History Logs */}
      <main className="flex-1 max-w-5xl w-full px-4 py-10 mx-auto">
        <div className="grid gap-6">
          {dummyLogs.map((log, index) => {
            const status = getStatusTag(log.description)
            const statusColor = getStatusColor(status)
            return (
              <div
                key={index}
                className="relative flex gap-4 border-l-4 border-muted pl-4 rounded-xl shadow-md bg-card p-6 transition hover:shadow-xl hover:bg-muted/50"
              >
                {/* Timeline marker */}
                <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-muted-foreground -translate-x-1/2" />

                {/* Avatar */}
                <div className="w-12 h-12 bg-muted text-foreground font-bold rounded-full flex items-center justify-center text-sm shadow-sm">
                  {getInitials(log.name)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <UserRound className="w-5 h-5 text-muted-foreground" />
                      {log.name}
                    </h2>
                    <Badge variant="outline" className="text-xs">
                      <Hash className="w-3 h-3 mr-1" />
                      {log.rollno}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    {log.time}
                  </div>

                  <div className="flex items-start gap-3 mt-3 text-sm text-foreground">
                    <AlignLeft className="w-5 h-5 text-muted-foreground mt-1" />
                    <p className="leading-relaxed">{log.description}</p>
                  </div>

                  <div className="mt-4">
                    <span
                      className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-medium",
                        statusColor
                      )}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-10 mt-12 rounded-t-[2.5rem] shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1 text-secondary">
              <li className="hover:underline cursor-pointer">Dashboard</li>
              <li className="hover:underline cursor-pointer">Exam Schedule</li>
              <li className="hover:underline cursor-pointer">Results</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-1 text-secondary">
              <li>📧 exam@university.edu</li>
              <li>📱 (123) 456-7890</li>
              <li>📍 Main Campus</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul className="space-y-1 text-secondary">
              <li className="hover:underline cursor-pointer">Help Center</li>
              <li className="hover:underline cursor-pointer">FAQs</li>
              <li className="hover:underline cursor-pointer">Support</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6 text-xs text-secondary border-t pt-4">
          © {new Date().getFullYear()} Exam Cell. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default History
