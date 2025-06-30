import React, { useEffect, useState } from "react";
import { BarChart3, FileText, Users, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function StatsCards({ refresh, onLoaded }) {
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    totalCertificates: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      setLoading(true);
      fetch("http://localhost:8080/api/admin/dashboard-stats")
        .then((res) => res.json())
        .then((data) => {
          setStatsData(data);
          setLoading(false);
          if (onLoaded) onLoaded(data);
        })
        .catch(() => setLoading(false));
    };
    fetchStats();
    window.addEventListener("certificate-requested", fetchStats);
    return () => window.removeEventListener("certificate-requested", fetchStats);
  }, [refresh]);

  const stats = [
    {
      title: "Total Students",
      value: loading ? "..." : statsData.totalStudents,
      description: "Registered in the system",
      icon: Users,
      iconColor: "text-[#ffe2f3]",
      iconBg: "bg-primary",
    },
    {
      title: "Total Certificates",
      value: loading ? "..." : statsData.totalCertificates,
      description: "Generated to date",
      icon: FileText,
      iconColor: "text-[#ffe2f3]",
      iconBg: "bg-primary",
    },
    {
      title: "Pending Requests",
      value: loading ? "..." : statsData.pendingRequests,
      description: "Awaiting approval",
      icon: BarChart3,
      iconColor: "text-[#ffe2f3]",
      iconBg: "bg-primary",
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-primary/20">
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
  );
}
