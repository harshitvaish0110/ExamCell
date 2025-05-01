"use client"

import React, { useState } from "react"
import {
  Input
} from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Hourglass, Download } from "lucide-react";


const dummyData = [
  { rollno: "CS101", name: "John Doe", status: "completed", type: "Bonafied Certificate" },
  { rollno: "CS102", name: "Jane Smith", status: "Not Completed", type: "Scholarship" },
  { rollno: "CS103", name: "Mike Johnson", status: "completed", type: "Bonafied Certificate" },
  { rollno: "CS104", name: "Sarah Williams", status: "completed", type: "Scholarship" },
]

const columns = [
  { key: "rollno", label: "Roll No", width: "w-1/6" },
  { key: "name", label: "Name", width: "w-2/6" },
  { key: "status", label: "Status", width: "w-1/6" },
  { key: "type", label: "Type", width: "w-2/6" },
]

const ExamPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  })

  const filteredData = dummyData.filter((student) =>
    Object.values(student).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-foreground text-primary-foreground py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            🎓 Exam Cell
          </h1>
          <p className="mt-4 text-sm md:text-lg text-secondary">
            Manage and Monitor Examinations Efficiently
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-8">
        <Input
          placeholder="Search by any field..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow"
        />
      </div>

      {/* Table */}
      <main className="flex-1 px-4 py-10 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl border shadow bg-card p-4">
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_2fr_1fr_2fr] text-sm text-muted-foreground font-semibold border-b">
            {columns.map((column, idx) => (
              <div
                key={column.key}
                className={`px-4 py-3 flex items-center justify-between ${idx !== 0 ? "border-l" : ""} cursor-pointer`}
                onClick={() => requestSort(column.key)}
              >
                <span>{column.label}</span>
                {sortConfig.key === column.key && (
                  <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                )}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {sortedData.map((student, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr_2fr_1fr_2fr] text-sm border-b hover:bg-muted/70 transition-colors"
            >
              <div className="px-4 py-3 font-medium">{student.rollno}</div>
              <div className="px-4 py-3 border-l">{student.name}</div>
              <div className="px-4 py-3 border-l">
                {student.status?.toLowerCase() === "completed" ? (
                  <a
                    href={`#`}
                    // className="text-blue-600 underline hover:text-blue-900 transition-colors"
                  >
<Badge variant="success" className="flex items-center gap-1">
  <Download className="w-4 h-4" />
  Download
</Badge>
</a>
                ) : (
<Badge variant="destructive" className="flex items-center gap-1">
  <Hourglass className="w-4 h-4" />
  Pending
</Badge>
                )}
              </div>
              <div className="px-4 py-3 border-l">
                <Badge variant="secondary">{student.type}</Badge>
              </div>
            </div>
          ))}
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

export default ExamPage
