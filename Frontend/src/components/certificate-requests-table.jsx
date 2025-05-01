import React from "react"
import { Check, Eye, X, Download } from "lucide-react"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

const certificateRequests = [
  {
    id: "CS101",
    studentName: "John Doe",
    certificateType: "Bonafied Certificate",
    dateRequested: "2023-04-15",
    status: "Approved",
  },
  {
    id: "CS102",
    studentName: "Jane Smith",
    certificateType: "Scholarship",
    dateRequested: "2023-04-14",
    status: "Pending",
  },
  {
    id: "CS103",
    studentName: "Mike Johnson",
    certificateType: "Bonafied Certificate",
    dateRequested: "2023-04-13",
    status: "Approved",
  },
  {
    id: "CS104",
    studentName: "Sarah Williams",
    certificateType: "Scholarship",
    dateRequested: "2023-04-12",
    status: "Approved",
  },
]

export function CertificateRequestsTable() {
  return (
    <Card className="border-[#4a2639]/20">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Certificate Requests</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-[#4a2639]">
              <TableRow>
                <TableHead className="text-[#ffe2f3]">Roll No</TableHead>
                <TableHead className="text-[#ffe2f3]">Name</TableHead>
                <TableHead className="text-[#ffe2f3]">Certificate Type</TableHead>
                <TableHead className="text-[#ffe2f3]">Date Requested</TableHead>
                <TableHead className="text-[#ffe2f3]">Status</TableHead>
                <TableHead className="text-right text-[#ffe2f3]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificateRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        request.certificateType === "Bonafied Certificate"
                          ? "bg-pink-100 text-[#4a2639] border-0"
                          : "bg-pink-100 text-[#4a2639] border-0"
                      }
                    >
                      {request.certificateType}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.dateRequested}</TableCell>
                  <TableCell>
                    {request.status === "Approved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-500 text-white border-0 hover:bg-green-600 cursor-pointer"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-500 text-white border-0 hover:bg-red-600"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Pending
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {request.status === "Pending" ? (
                        <>
                          <Button size="icon" variant="outline" className="h-8 w-8 cursor-pointer">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 cursor-pointer">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </>
                      ) : (
                        <Button size="icon" variant="outline" className="h-8 w-8 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      )}
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
