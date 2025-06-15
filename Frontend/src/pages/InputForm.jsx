"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Footer from "../components/Footer";
import { LucideInfo } from "lucide-react";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom"

const programCourses = {
  "B.Tech": ["IT", "CS", "CSB", "CSAI"],
  "M.Tech": ["CS"],
  MBA: ["Digital Business"],
  "M.Sc": ["Data Science", "AI & ML", "Economics & Management"],
  PhD: ["PhD"],
};

const semesterMap = {
  "B.Tech": 8,
  "M.Tech": 4,
  "M.Sc": 4,
  MBA: 4,
  PhD: 12,
};

const InputForm = () => {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  let studentData = JSON.parse(localStorage.getItem("studentData"));
  let hasDetails = !!studentData;

  const [formData, setFormData] = useState(
    hasDetails
      ? studentData
      : {
          rollNumber: "",
          fullName: "",
          email: "",
          program: "",
          course: "",
          semester: "",
          purpose: "",
        },
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "program" && { course: "", semester: "" }),
      ...(name === "course" && { semester: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/students", {
        method: hasDetails ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit your data");
      }

      const data = await response.json();
      toast.success("Details Submitted Sucessfully");
      console.log("Form submitted:", data);
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("Failed to Submit Data");
      setError(err.message || "Data Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const courseOptions = useMemo(
    () => programCourses[formData.program] || [],
    [formData.program],
  );
  const maxSemester =
    Object.entries(programCourses).find(([prog, list]) =>
      list.includes(formData.course),
    )?.[0] || "";

  const semesterCount = semesterMap[maxSemester] || 0;
  const semesterOptions = Array.from(
    { length: semesterCount },
    (_, i) => i + 1,
  );

  useEffect(() => {
    const email = sessionStorage.getItem("email").replaceAll('"', "");
    const rollNumber = email.split("@")[0].toUpperCase();
    if (rollNumber && email) {
      setFormData((prev) => ({
        ...prev,
        rollNumber,
        email,
      }));
    }
  }, []);

  useEffect(() => {
    let selected = courseOptions.filter((course) =>
      formData.rollNumber.includes(course),
    );
    if (selected.length > 0) {
      setFormData((prev) => ({
        ...prev,
        course: selected[0],
      }));
    }
  }, [formData.rollNumber, courseOptions]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-secondary text-foreground rounded-b-[2.5rem] py-10 px-4 shadow-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            📝 Student Form
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            Submit student info for certification requests
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl shadow-xl border rounded-2xl bg-card text-card-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold mb-1">
              📄{hasDetails ? " Update" : " Submit"} Student Details
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Please fill out all fields carefully
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  type="text"
                  name="rollNumber"
                  id="rollNumber"
                  placeholder="Enter Roll Number"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Enter Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="program">Program</Label>
                <select
                  name="program"
                  id="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-md border bg-background text-foreground"
                  disabled={isLoading}
                >
                  <option value="">Select Program</option>
                  {Object.keys(programCourses).map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              </div>

              {courseOptions.length > 0 &&
                (formData.course ? (
                  <div className="space-y-1">
                    <Label htmlFor="course">Course</Label>
                    <select
                      name="course"
                      id="course"
                      value={formData.course}
                      required
                      disabled
                      className="w-full p-2 rounded-md border bg-background text-foreground"
                    >
                      <option value="">Select Course</option>
                      {courseOptions.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label htmlFor="course">Course</Label>
                    <select
                      name="course"
                      id="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full p-2 rounded-md border bg-background text-foreground"
                    >
                      <option value="">Select Course</option>
                      {courseOptions.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

              {semesterOptions.length > 0 && (
                <div className="space-y-1">
                  <Label htmlFor="semester">Semester</Label>
                  <select
                    name="semester"
                    id="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full p-2 rounded-md border bg-background text-foreground"
                  >
                    <option value="">Select Semester</option>
                    {semesterOptions.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  type="text"
                  name="purpose"
                  id="purpose"
                  placeholder="Purpose (e.g. Bonafide, Scholarship)"
                  value={formData.purpose}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <p className="text-destructive text-sm text-center flex items-center justify-center gap-1">
                  <LucideInfo /> {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full text-lg font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Submitting...</span>
                ) : hasDetails ? (
                  "Update Details"
                ) : (
                  "Submit Details"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default InputForm;
