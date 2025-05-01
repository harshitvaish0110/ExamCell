"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

const programCourses = {
  "B.Tech": ["B.Tech (IT)", "B.Tech (CS)", "B.Tech (CSB)", "B.Tech (CSAI)"],
  "M.Tech": ["M.Tech (CS)"],
  "MBA": ["MBA (Digital Business)"],
  "M.Sc": ["M.Sc. (Data Science)", "M.Sc. (AI & ML)", "M.Sc. (Economics & Management)"],
  "PhD": ["PhD"]
}

const semesterMap = {
  "B.Tech": 8,
  "M.Tech": 4,
  "M.Sc": 4,
  "MBA": 4,
  "PhD": 12
}

const InputForm = () => {
  const [formData, setFormData] = useState({
    rollno: "",
    name: "",
    email: "",
    program: "",
    course: "",
    semester: "",
    purpose: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "program" && { course: "", semester: "" }),
      ...(name === "course" && { semester: "" })
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const courseOptions = programCourses[formData.program] || []
  const maxSemester =
    Object.entries(programCourses).find(([prog, list]) =>
      list.includes(formData.course)
    )?.[0] || ""

  const semesterCount = semesterMap[maxSemester] || 0
  const semesterOptions = Array.from({ length: semesterCount }, (_, i) => i + 1)

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#4B1E1E]">
      <header className="bg-[oklch(0.3_0.05_350)] text-white py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            📝 Student Form
          </h1>
          <p className="mt-4 text-sm md:text-lg text-[#FCD8D4]">
            Submit student info for certification requests
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-xl bg-white text-[#4B1E1E] shadow-xl border border-[oklch(0.3_0.05_350)] rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              📄 Enter Student Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="rollno"
                placeholder="Roll Number"
                value={formData.rollno}
                onChange={handleChange}
                required
                className="placeholder:text-[#8B5E5E]"
              />
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="placeholder:text-[#8B5E5E]"
              />
              <Input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                required
                className="placeholder:text-[#8B5E5E]"
              />

              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md bg-white border border-[oklch(0.3_0.05_350)] text-[#4B1E1E]"
              >
                <option value="">Select Program</option>
                {Object.keys(programCourses).map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>

              {courseOptions.length > 0 && (
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-md bg-white border border-[oklch(0.3_0.05_350)] text-[#4B1E1E]"
                >
                  <option value="">Select Course</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              )}

              {semesterOptions.length > 0 && (
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-md bg-white border border-[oklch(0.3_0.05_350)] text-[#4B1E1E]"
                >
                  <option value="">Select Semester</option>
                  {semesterOptions.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              )}

              <Input
                type="text"
                name="purpose"
                placeholder="Purpose (e.g., Bonafide, Scholarship)"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="placeholder:text-[#8B5E5E]"
              />

              <Button
                type="submit"
                className="w-full bg-[oklch(0.3_0.05_350)] hover:bg-[oklch(0.3_0.05_350)] text-white"
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-[oklch(0.3_0.05_350)] text-white py-10 mt-12 rounded-t-[2.5rem] shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1 text-[#FCD8D4]">
              <li className="hover:underline cursor-pointer">Dashboard</li>
              <li className="hover:underline cursor-pointer">Exam Schedule</li>
              <li className="hover:underline cursor-pointer">Results</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-1 text-[#FCD8D4]">
              <li>📧 exam@university.edu</li>
              <li>📱 (123) 456-7890</li>
              <li>📍 Main Campus</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul className="space-y-1 text-[#FCD8D4]">
              <li className="hover:underline cursor-pointer">Help Center</li>
              <li className="hover:underline cursor-pointer">FAQs</li>
              <li className="hover:underline cursor-pointer">Support</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6 text-xs text-[#FCD8D4] border-t border-[#FCD8D4] pt-4">
          © {new Date().getFullYear()} Exam Cell. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default InputForm
