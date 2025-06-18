"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hourglass, Download, ArrowBigRight, ArrowBigDown, Info } from "lucide-react";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Label } from "@/components/ui/label";

const columns = [
  { key: "request", label: "Requested On", width: "w-2/6" },
  { key: "expire", label: "Expires By", width: "w-2/6" },
  { key: "download", label: "Download", width: "w-1/6" },
  { key: "sign", label: "Signed", width: "w-1/6" },
];

const ExamPage = () => {
  const [userRequests, setUserRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [isRequestLimitReached, setIsRequestLimitReached] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [isChangeReqFormOpen, setIsChangeReqFormOpen] = useState(false);

  const fetchUserRequests = async (rollno) => {
    if (!rollno) {
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const resp = await fetch(
        `http://localhost:8080/api/bonafide/uid/${rollno}`,
      );
      if (!resp.ok) {
        setIsRequestLimitReached(false);
        throw new Error("No Requests Found");
      }
      const data = (await resp.json()).certificates;
      // console.log(data);
      if (
        data.length >= 5 &&
        new Date(data[4].generatedAt).toLocaleDateString() ===
          new Date().toLocaleDateString()
      ) {
        setIsRequestLimitReached(true);
      } else {
        setIsRequestLimitReached(false);
      }
      setUserRequests(
        data.map((req) => {
          let reqDt = new Date(req.generatedAt);
          reqDt = `${reqDt.toLocaleDateString()} - ${reqDt.toTimeString().slice(0, 8)}`;
          let expDt = new Date(req.expiresAt);
          expDt = `${expDt.toLocaleDateString()} - ${expDt.toTimeString().slice(0, 8)}`;
          return {
            request: reqDt,
            expire: expDt,
            download: "http://localhost:8080/api/bonafide/download/" + req.uid,
            sign: req.isSigned,
          };
        }),
      );
      toast.success("Requests fetched successfully");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      // console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studentData"));
    // console.log(userData);
    setUser(userData);
    if (userData.rollNumber) {
      fetchUserRequests(userData.rollNumber);
    }
  }, []);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedData = [...userRequests].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const requestCertificate = async () => {
    if (!isRequestLimitReached) {
      try {
        const resp = await fetch(
          "http://localhost:8080/api/bonafide/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentName: user.fullName,
              email: user.email.toUpperCase(),
              course:
                user.course === "IT"
                  ? "Information Technology"
                  : user.course === "CS"
                    ? "Computer Science"
                    : user.course === "CSAI"
                      ? "Computer Science with Artificial Intelligence"
                      : user.course === "CSB"
                        ? "Computer Science and Business"
                        : user.course,
              semester:
                user.semester +
                (user.semester == 1
                  ? "st"
                  : user.semester == 2
                    ? "nd"
                    : user.semester == 3
                      ? "rd"
                      : "th"),
              purpose: user.purpose,
            }),
          },
        );
        if (!resp.ok) {
          throw new Error("Failed to request certificate");
        }
        const data = await resp.json();
        toast.success("Certificate Request Submitted sucessfully");
        fetchUserRequests(user.rollNumber);
        console.log(data);
      } catch (err) {
        console.log(err);
        toast.error(
          err.message || "Failed to request certificate. Please try again.",
        );
      }
    } else {
      toast.error("Request Limit Reached");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-secondary rounded-b-[2.5rem] text-foreground py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            🎓 Exam Cell
          </h1>
          <p className="mt-4 text-sm md:text-lg text-primary">
            Manage and Monitor Examinations Efficiently
          </p>
        </div>
      </header>

      {/* Search */}

      {/* Table */}
      <main className="flex flex-col px-4 py-10 max-w-7xl mx-auto w-full gap-5">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap gap-3 px-4 mt-3 justify-between">
          <h1 className="pt-3 font-bold text-2xl">
            Welcome, {user?.fullName || "User"}
          </h1>
          <div className="flex flex-row gap-4">
            <Button
              className="cursor-pointer"
              onClick={requestCertificate}
              disabled={isLoading || isRequestLimitReached}
            >
              Request Certificate
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => {
                navigate("/inputform", true);
              }}
            >
              Update Details
            </Button>
          </div>
        </div>
        {!isLoading && (
          <div className="rounded-2xl border shadow bg-card p-4">
            {/* Header Row */}
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr] text-sm text-muted-foreground font-semibold border-b">
              {columns.map((column, idx) => (
                <div
                  key={column.key}
                  className={`px-4 py-3 flex items-center justify-between ${idx !== 0 ? "border-l" : ""} cursor-pointer`}
                  onClick={() => requestSort(column.key)}
                >
                  <span>{column.label}</span>
                  {sortConfig.key === column.key && (
                    <span>
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {sortedData.map((student, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr_2fr_1fr_1fr] text-sm border-b hover:bg-muted/70 transition-colors"
              >
                <div className="px-4 py-3 font-medium">{student.request}</div>
                <div className="px-4 py-3 border-l">{student.expire}</div>
                <div className="px-4 py-3 border-l">
                  <a
                    href={student.download}
                    // className="text-blue-600 underline hover:text-blue-900 transition-colors"
                    target="_blank"
                  >
                    <Badge
                      variant="success"
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Badge>
                  </a>
                </div>
                <div className="px-4 py-3 border-l">
                  {student.sign ? (
                    <Badge variant="secondary">Signed</Badge>
                  ) : (
                    <Badge variant="destructive">Not Signed</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <>
            <div className="text-red-500">Error Fetching User Requests</div>
            <p className="text-sm">{error}</p>
          </>
        )}

        <Card className="p-3">
      <CardHeader 
        className="flex font-bold p-0 text-lg items-center cursor-pointer"
        onClick={() => {setIsChangeReqFormOpen(!isChangeReqFormOpen)}}
      >
        {
          isChangeReqFormOpen ? <ArrowBigDown /> : <ArrowBigRight />
        } Open Change Password Request Form
      </CardHeader>
        {
          isChangeReqFormOpen && (
            <ChangePasswordForm />
          )}
    </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const ChangePasswordForm = () => {
  const [pwdReq, setPwdReq] = useState({
    reason: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPassReq = async () => {
    // const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');
    try {
      let res = await fetch(`http://localhost:8080/api/password-requests/${email}`);
      if (res.ok) {
        const data = await res.json();
        setPwdReq({
          ...data,
          confirmPassword: data?.password,
        });
        setError("")
        console.log(data);
      }
    } catch (err) {
      console.log("Some Err ", err);
    }
  }
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);
    setError("")

    try {
      const res = await fetch("http://localhost:8080/api/password-requests/" + (type=="create" ? "create" : "delete"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: sessionStorage.getItem('token'),
          email: sessionStorage.getItem('email'),
          reason: pwdReq.reason,
          password: pwdReq.password,
        }),
      });
      console.log(res);
      if (res.ok) {
        toast.success("Successfully " + (type=="create" ? "Created" : "Deleted") + " Password Request");
        if (type == "delete") {
          setPwdReq({
              reason: "",
              password: "",
              confirmPassword: "",
            })
        } else fetchPassReq();
      } else {
        toast.error("Failed to " + (type=="create" ? "Create" : "Delete") + " Password Request");
      }
    } catch (err) {
      toast.error("Failed to " + (type=="create" ? "Create" : "Delete") + " Password Request");
      setError("Failed to " + (type=="create" ? "Create" : "Delete") + " Password Request", err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  const checksInput = (reason, password, confirmPassword) => {
    if (reason.length < 20) {
      setError("Reason should be Bigger");
    } else if (password.length < 8) {
      setError("Password should be 8 digits long");
    } else if (password !== confirmPassword) {
      setError("Password and Confirm Password should be same");
    } else {
      setError("");
    }
    setPwdReq({ 
      ...pwdReq,
      reason,
      password,
      confirmPassword,  
    });
  };
  useEffect(() => {
    fetchPassReq();
  }, [])
  return (
            <CardContent>
              {pwdReq?.email
                ? <div>
                  <form onSubmit={handleSubmit} className="space-y-2 pb-4">
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        value={pwdReq.reason}
                        required
                        onChange={(e) => checksInput(e.target.value, pwdReq.password, pwdReq.confirmPassword)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={pwdReq.password}
                        required
                        onChange={(e) => checksInput(pwdReq.reason, e.target.value, pwdReq.confirmPassword)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={pwdReq.confirmPassword}
                        required
                        onChange={(e) => checksInput(pwdReq.reason, pwdReq.password, e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    {error && <div className="space-y-2 flex gap-2 text-red-500 items-center">
                      <Info className="w-4 h-4" /> {error}
                    </div>}
                    <div className="space-y-2 flex gap-3 pt-2">
                      <Button 
                        type="submit" 
                        onClick={(e) => handleSubmit(e, "create")}
                        className="cursor-pointer"
                        disabled={isLoading || error}
                      >
                          Update Request
                      </Button>
                      <Button 
                        type="submit" 
                        onClick={(e) => handleSubmit(e, "delete")}
                        className="cursor-pointer"
                        disabled={isLoading || error}
                      >
                          Delete Request
                      </Button>
                    </div>
                  </form>
                </div>
                : <form onSubmit={handleSubmit} className="space-y-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Input
                      id="reason"
                      value={pwdReq.reason}
                      required
                      onChange={(e) => checksInput(e.target.value, pwdReq.password, pwdReq.confirmPassword)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={pwdReq.password}
                      required
                      onChange={(e) => checksInput(pwdReq.reason, e.target.value, pwdReq.confirmPassword)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={pwdReq.confirmPassword}
                      required
                      onChange={(e) => checksInput(pwdReq.reason, pwdReq.password, e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && <div className="space-y-2 flex gap-2 text-red-500 items-center">
                    <Info className="w-4 h-4" /> {error}
                  </div>}
                  <div className="space-y-2 pt-2">
                    <Button 
                      type="submit" 
                      onClick={(e) => handleSubmit(e, "create")}
                      className="cursor-pointer"
                      disabled={isLoading || error}
                    >
                        Submit
                    </Button>
                  </div>
                </form>
              }
            </CardContent>
  )
}

export default ExamPage;
