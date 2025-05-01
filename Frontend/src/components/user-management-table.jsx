import React from "react"
import { Eye, UserX } from "lucide-react"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

const users = [
  {
    name: "Alice Johnson",
    role: "Student",
    department: "Computer Science",
    status: "Active",
  },
  {
    name: "Bob Smith",
    role: "Faculty",
    department: "Engineering",
    status: "Active",
  },
  {
    name: "Charlie Brown",
    role: "Student",
    department: "Business",
    status: "Inactive",
  },
  {
    name: "Diana Prince",
    role: "Faculty",
    department: "Arts",
    status: "Active",
  },
  {
    name: "Edward Norton",
    role: "Student",
    department: "Medicine",
    status: "Active",
  },
]

export function UserManagementTable() {
  return (
    <Card className="border-[#4a2639]/20">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">User Management</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-[#4a2639]">
              <TableRow>
                <TableHead className="text-[#ffe2f3]">User Name</TableHead>
                <TableHead className="text-[#ffe2f3]">Role</TableHead>
                <TableHead className="text-[#ffe2f3]">Department</TableHead>
                <TableHead className="text-[#ffe2f3]">Status</TableHead>
                <TableHead className="text-right text-[#ffe2f3]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.name}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? "outline" : "secondary"}
                      className={
                        user.status === "Active"
                          ? "bg-pink-100 text-[#4a2639] border-0"
                          : "bg-gray-200 text-gray-700 border-0"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <UserX className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Remove</span>
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
