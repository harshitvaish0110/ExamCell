import React from "react"
import { Edit, Trash } from "lucide-react"

import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"

const templates = [
  {
    name: "Degree Certificate",
    type: "Academic",
    lastUpdated: "2023-03-15",
    usedIn: "124 certificates",
  },
  {
    name: "Course Completion",
    type: "Course",
    lastUpdated: "2023-02-20",
    usedIn: "356 certificates",
  },
  {
    name: "Merit Certificate",
    type: "Achievement",
    lastUpdated: "2023-01-10",
    usedIn: "89 certificates",
  },
  {
    name: "Participation Certificate",
    type: "Event",
    lastUpdated: "2023-04-05",
    usedIn: "215 certificates",
  },
  {
    name: "Internship Certificate",
    type: "Professional",
    lastUpdated: "2023-03-22",
    usedIn: "78 certificates",
  },
]

export function TemplatesTable() {
  return (
    <Card className="border-[#4a2639]/20">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Certificate Templates</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-[#4a2639]">
              <TableRow>
                <TableHead className="text-[#ffe2f3]">Template Name</TableHead>
                <TableHead className="text-[#ffe2f3]">Type</TableHead>
                <TableHead className="text-[#ffe2f3]">Last Updated</TableHead>
                <TableHead className="text-[#ffe2f3]">Used In</TableHead>
                <TableHead className="text-right text-[#ffe2f3]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.name}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-pink-100 text-[#4a2639] border-0">
                      {template.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{template.lastUpdated}</TableCell>
                  <TableCell>{template.usedIn}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Trash className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
