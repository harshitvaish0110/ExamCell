import React, { useEffect, useState } from "react";
import { Check, Eye, X, Download, CheckIcon } from "lucide-react";

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

export function CertificateRequestsTable() {
  let [isLoading, setIsLoading] = useState(false);
  let [certificateRequests, setCertificateRequests] = useState(null);

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
              {certificateRequests?.map((request) => (
                <TableRow key={request.uid}>
                  <TableCell className="font-medium">
                    {request.enrollmentNumber}
                  </TableCell>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>{`${new Date(request.generatedAt).toLocaleDateString()} - ${new Date(request.generatedAt).toTimeString().slice(0, 8)}`}</TableCell>
                  <TableCell>
                    {
                      <a
                        href={`http://localhost:8080/api/bonafide/download/${request.uid}`}
                        target="_blank"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-500 text-white border-0 hover:bg-green-600 cursor-pointer"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </a>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!request.signed ? (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 cursor-pointer"
                            disabled={isLoading}
                            onClick={() => signCertificate(request.uid)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            disabled={isLoading}
                            className="h-8 w-8 cursor-pointer"
                          >
                            <X className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-fit px-2 cursor-pointer"
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span>Signed</span>
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
