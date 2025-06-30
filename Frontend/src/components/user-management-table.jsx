import React, { useEffect, useState } from "react";
import { Eye, UserX } from "lucide-react";

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

export function UserManagementTable() {
  let [users, setUsers] = useState(null);

  const fetchUsers = async () => {
    try {
      let resp = await fetch("http://localhost:8080/api/students");
      if (resp.ok) {
        const data = await resp.json();
        setUsers(data);
        toast.success("Students Fetched Sucessfully");
        return;
      } else {
        toast.error("Failed to Fetch Students");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to Fetch Students");
    }
  };

  const handleRemoveUser = async (rollNumber) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      let resp = await fetch(`http://localhost:8080/api/admin/students/${rollNumber}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        setUsers(users.filter((user) => user.rollNumber !== rollNumber));
        toast.success("User removed successfully");
      } else {
        const error = await resp.text();
        toast.error(error || "Failed to remove user");
      }
    } catch (err) {
      toast.error("Failed to remove user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card className="border-primary/20">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">User Management</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-[#ffe2f3] font-bold tracking-wide">
                  RollNo
                </TableHead>
                <TableHead className="text-[#ffe2f3] font-bold tracking-wide">
                  Name
                </TableHead>
                <TableHead className="text-[#ffe2f3] font-bold tracking-wide">
                  Program
                </TableHead>
                <TableHead className="text-right text-[#ffe2f3] font-bold tracking-wide">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.rollNumber}>
                  <TableCell className="font-medium">
                    {user.rollNumber}
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{`${user.program} (${user.course})`}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleRemoveUser(user.rollNumber)}>
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
  );
}
