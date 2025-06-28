"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hourglass, Download, ArrowBigRight, ArrowBigDown, Info, LogOut, CheckCircle, XCircle } from "lucide-react";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Label } from "@/components/ui/label";

// Define column widths for perfect sync
const columnWidths = ['180px', '180px', '1fr', '140px', '140px', '160px'];
const columns = [
  { key: "request", label: "Requested On" },
  { key: "expire", label: "Expires By" },
  { key: "purpose", label: "Purpose" },
  { key: "download", label: "Download" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "sign", label: "Signed" },
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
            purpose: req.purpose,
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
        window.dispatchEvent(new Event("certificate-requested"));
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

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    localStorage.removeItem("studentData");
    toast.success("Logged Out Successfully");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-secondary rounded-b-[2.5rem] text-foreground py-12 px-4 shadow-md relative">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            🎓 Exam Cell
          </h1>
          <p className="mt-4 text-sm md:text-lg text-primary">
            Manage and Monitor Examinations Efficiently
          </p>
        </div>
        
        {/* Logout Button */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2 font-semibold"
            variant="destructive"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
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
            <div className="grid border-b text-sm text-muted-foreground font-semibold" style={{gridTemplateColumns: columnWidths.join(' ')}}>
              {columns.map((column, idx) => (
                <div
                  key={column.key}
                  className={`px-4 py-3 flex items-center justify-between ${idx !== 0 ? "border-l" : ""} ${['download','whatsapp','sign'].includes(column.key) ? 'whitespace-nowrap' : ''}`}
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
                className="grid border-b hover:bg-muted/70 transition-colors"
                style={{gridTemplateColumns: columnWidths.join(' ')}}
              >
                <div className="px-4 py-3 font-medium">{student.request}</div>
                <div className="px-4 py-3 border-l">{student.expire}</div>
                <div className="px-4 py-3 border-l">{student.purpose}</div>
                <div className="px-4 py-3 border-l whitespace-nowrap">
                  <a
                    href={student.download}
                    target="_blank"
                  >
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-400 to-green-600 text-white border-0 shadow-md rounded-full hover:from-green-500 hover:to-green-700 transition-all duration-200 flex items-center gap-2 px-4 py-2"
                      style={{ minWidth: 100 }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </a>
                </div>
                <div className="px-4 py-3 border-l whitespace-nowrap">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0 shadow-md rounded-full hover:from-blue-500 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 px-4 py-2"
                    style={{ minWidth: 100 }}
                    onClick={async () => {
                      const phone = user?.mobileNumber;
                      if (!phone) {
                        toast.error('No WhatsApp number found for this student.');
                        return;
                      }
                      try {
                        const uid = student.download.split('/').pop();
                        const resp = await fetch(`http://localhost:8080/api/bonafide/send-whatsapp/${uid}`, {
                          method: 'POST',
                          headers: {},
                          body: new URLSearchParams({ phone }),
                        });
                        const data = await resp.json();
                        if (resp.ok && data.status === 'success') {
                          toast.success('Sent via WhatsApp!');
                        } else {
                          toast.error(data.message || 'Failed to send via WhatsApp');
                        }
                      } catch (e) {
                        toast.error('Failed to send via WhatsApp');
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" /> WhatsApp
                  </Button>
                </div>
                <div className="px-4 py-3 border-l whitespace-nowrap">
                  {student.sign ? (
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-semibold rounded-full px-5 py-1 shadow-md whitespace-nowrap">
                      <CheckCircle className="w-4 h-4" /> Signed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-full px-5 py-1 shadow-md whitespace-nowrap">
                      <XCircle className="w-4 h-4" /> Not Signed
                    </span>
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
