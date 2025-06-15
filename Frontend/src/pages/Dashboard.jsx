"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hourglass, Download } from "lucide-react";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExamPage;
