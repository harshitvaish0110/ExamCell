import React, { useEffect, useState } from "react";
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
import PwdReqTableRow from "./pwd-req-table-row";

export function ChangePasswordRequestsTable() {
  let [isLoading, setIsLoading] = useState(false);
  let [passwordRequests, setPasswordRequests] = useState(null);

  const acceptPasswordRequest = async (email) => {
    setIsLoading(true);
    let token = sessionStorage.getItem("token");
    let adminMail = sessionStorage.getItem("email");
    try {
      let resp = await fetch("http://localhost:8080/api/password-requests/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, adminMail, email }),
      });
      if (resp.ok) {
        toast.success("Accepted Password Request Successfully");
        fetchPasswordRequests();
      } else {
        toast.error("Failed to Accept Password Request");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to Accept Password Request");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePasswordRequest = async (email) => {
    setIsLoading(true);
    let token = sessionStorage.getItem("token");
    let adminMail = sessionStorage.getItem("email");
    try {
      let resp = await fetch("http://localhost:8080/api/password-requests/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, adminMail, email }),
      });
      if (resp.ok) {
        toast.success("Deleted Password Request Successfully");
        fetchPasswordRequests();
      } else {
        toast.error("Failed to Delete Password Request");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to Delete Password Request");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPasswordRequests = async () => {
    try {
      let resp = await fetch("http://localhost:8080/api/password-requests");
      if (resp.ok) {
        try {
            const data = await resp.json();
            setPasswordRequests(data);
        } catch {
            setPasswordRequests([]);
        }
        toast.success("Password Requests Fetched Sucessfully");
        return;
      } else {
        toast.error("Failed to Fetch Password Requests");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to Fetch Password Requests");
    }
  };

  useEffect(() => {
    fetchPasswordRequests();
  }, []);

  return (
    <Card className="border-primary/20">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Change Password Requests</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide">
                  Email
                </TableHead>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide">
                  NewPassword
                </TableHead>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide text-center">
                  Date Requested
                </TableHead>
                <TableHead className="text-[#ffe2f3] text-bold tracking-wide text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passwordRequests?.map((request) => 
                    <PwdReqTableRow key={request.email} isLoading={isLoading} request={request} acceptPasswordRequest={acceptPasswordRequest} deletePasswordRequest={deletePasswordRequest} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}