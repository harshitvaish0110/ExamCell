import React, { useEffect, useState } from "react";
import { Check, Eye, X, Download, CheckIcon, Search as SearchIcon } from "lucide-react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import toast from "react-hot-toast";

export function CertificateRequestsTable({ onSigned }) {
  let [isLoading, setIsLoading] = useState(false);
  let [certificateRequests, setCertificateRequests] = useState(null);
  const [searchRoll, setSearchRoll] = useState("");

  const signCertificate = async (uid) => {
    setIsLoading(true);
    let token = sessionStorage.getItem("token");
    let email = sessionStorage.getItem("email");
    try {
      let resp = await fetch("http://localhost:8080/api/bonafide/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, token, email }),
      });
      if (resp.ok) {
        toast.success("Signed Certificate Successfully");
        fetchCertificates();
        if (onSigned) onSigned();
      } else {
        toast.error("Failed to Sign Certificate");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to Sign Certificate");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      let resp = await fetch("http://localhost:8080/api/bonafide/all");
      if (resp.ok) {
        const data = await resp.json();
        setCertificateRequests(data);
        toast.success("Certificates Fetched Sucessfully");
        return;
      } else {
        toast.error("Failed to Fetch Certificates");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to Fetch Certificates");
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <Card className="border-primary/20">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Certificate Requests</h3>
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="roll-search" className="font-semibold text-base mr-2">Search by Roll No:</label>
          <div className="relative w-[260px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </span>
            <input
              id="roll-search"
              type="text"
              placeholder="Enter roll number..."
              value={searchRoll}
              onChange={e => setSearchRoll(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 text-base"
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide">
                  Roll No
                </TableHead>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide">
                  Name
                </TableHead>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide">
                  Purpose
                </TableHead>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide">
                  Date Requested
                </TableHead>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide">
                  Download
                </TableHead>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide">
                  Sign
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(certificateRequests?.filter(request =>
                request.enrollmentNumber.toLowerCase().includes(searchRoll.toLowerCase())
              ) ?? []).map((request) => (
                <TableRow key={request.uid}>
                  <TableCell className="font-medium">
                    {request.enrollmentNumber}
                  </TableCell>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell>{`${new Date(request.generatedAt).toLocaleDateString()} - ${new Date(request.generatedAt).toTimeString().slice(0, 8)}`}</TableCell>
                  <TableCell>
                    <a
                      href={`http://localhost:8080/api/bonafide/download/${request.uid}`}
                      target="_blank"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-green-400 to-green-600 text-white border-0 shadow-md rounded-full hover:from-green-500 hover:to-green-700 transition-all duration-200 flex items-center gap-2 px-4 py-2"
                        style={{ minWidth: 120 }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!request.signed ? (
                        <>
                          <div className="relative group">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 cursor-pointer bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-0 shadow-md rounded-full hover:from-emerald-500 hover:to-emerald-700 transition-all duration-200"
                              disabled={isLoading}
                              onClick={() => signCertificate(request.uid)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">Approve</span>
                          </div>
                          <div className="relative group">
                            <Button
                              size="icon"
                              variant="outline"
                              disabled={isLoading}
                              className="h-8 w-8 cursor-pointer bg-gradient-to-r from-red-400 to-red-600 text-white border-0 shadow-md rounded-full hover:from-red-500 hover:to-red-700 transition-all duration-200"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Reject</span>
                            </Button>
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">Reject</span>
                          </div>
                        </>
                      ) : (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-fit px-3 cursor-pointer bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0 shadow-md rounded-full flex items-center gap-2"
                          disabled
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          <span className="font-semibold">Signed</span>
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
  );
}
