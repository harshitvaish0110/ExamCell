"use client"
import React from "react"
import { FileText, Home, LogOut, Users, LayoutTemplate } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { useTheme } from "./theme-provider"

import { Button } from "./ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar"
import { ThemeToggle } from "./theme-toggle"

export function DashboardLayout({ children }) {
  const location = useLocation()
  const { theme } = useTheme()

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/admin-dashboard",
      isActive: location.pathname === "/admin-dashboard",
    },
    {
      title: "Manage Users",
      icon: Users,
      url: "/manage-users",
      isActive: location.pathname === "/manage-users",
    },
    {
      title: "Certificate Requests",
      icon: FileText,
      url: "/certificate-requests",
      isActive: location.pathname === "/certificate-requests",
    },
    {
      title: "Templates",
      icon: LayoutTemplate,
      url: "/templates",
      isActive: location.pathname === "/templates",
    },
    {
      title: "Generated Certificates",
      icon: FileText,
      url: "/generated-certificates",
      isActive: location.pathname === "/generated-certificates",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="bg-accent-foreground text-white">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <div className="font-semibold">Exam Cell</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                  <Link to="/">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 items-center justify-between border-b px-6 bg-[#4a2639] text-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="rounded-full">
                <img src="/placeholder.svg?height=32&width=32" alt="Admin" className="h-8 w-8 rounded-full" />
                <span className="sr-only">Profile</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
          <footer className="bg-[#4a2639] text-white p-6">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/" className="hover:text-[#ffe2f3]">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/certificate-requests" className="hover:text-[#ffe2f3]">
                        Exam Schedule
                      </Link>
                    </li>
                    <li>
                      <Link to="/generated-certificates" className="hover:text-[#ffe2f3]">
                        Results
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span>📧</span>
                      <span>exam@university.edu</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📞</span>
                      <span>(123) 456-7890</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📍</span>
                      <span>Main Campus</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="hover:text-[#ffe2f3]">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#ffe2f3]">
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#ffe2f3]">
                        Support
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center text-sm">© 2025 Exam Cell. All rights reserved.</div>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
