import React from "react"
import { BarChart3, FileText, Users, CheckCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function StatsCards() {
  const stats = [
    {
      title: "Total Students",
      value: "280",
      description: "Registered in the system",
      icon: Users,
      iconColor: "text-[#ffe2f3]",
      iconBg: "bg-[#4a2639]",
    },
    {
      title: "Total Certificates",
      value: "1,024",
      description: "Generated to date",
      icon: FileText,
      iconColor: "text-[#ffe2f3]",
      iconBg: "bg-[#4a2639]",
    },
    {
      title: "Pending Requests",
      value: "18",
      description: "Awaiting approval",
      icon: BarChart3,
      iconColor: "text-[#ffe2f3]",
      iconBg: "bg-[#4a2639]",
    },
    {
      title: "Approved Today",
      value: "12",
      description: "Certificates issued",
      icon: CheckCircle,
      iconColor: "text-[#ffe2f3]",
      iconBg: "bg-[#4a2639]",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-[#4a2639]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.iconBg}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
