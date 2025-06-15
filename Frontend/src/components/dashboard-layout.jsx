"use client";
import React from "react";
import { FileText, Home, LogOut, Users, LayoutTemplate } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
// import { useTheme } from "./theme-provider"

import { Button } from "./ui/button";
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
} from "./ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import Footer from "./Footer";

export function DashboardLayout({ children }) {
  const location = useLocation();
  // const { theme } = useTheme()

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
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="bg-accent-foreground text-white">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-foreground">
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
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        tooltip={item.title}
                      >
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
                  <Link to="/logout">
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
          <header className="flex h-16 items-center justify-between border-b px-6 bg-primary text-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-accent"
              >
                {/* <img src="/placeholder.svg?height=32&width=32" alt="Admin" className="h-8 w-8 rounded-full" /> */}
                <span className="font-bold text-2xl -top-0.5 relative">A</span>
                <span className="sr-only">Profile</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
          {/* <Footer /> */}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
