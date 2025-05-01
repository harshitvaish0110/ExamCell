import React from "react"
import { TemplatesTable } from "./templates-table"
import { DashboardLayout } from "./dashboard-layout"
import { Button } from "./ui/button"
import { PlusCircle } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Certificate Templates</h2>
            <p className="text-muted-foreground">Manage and create certificate templates</p>
          </div>
          <Button className="bg-[#4a2639] hover:bg-[#4a2639]/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Template
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="bg-[#4a2639]/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#4a2639] data-[state=active]:text-white">
              All Templates
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-[#4a2639] data-[state=active]:text-white">
              Academic
            </TabsTrigger>
            <TabsTrigger value="course" className="data-[state=active]:bg-[#4a2639] data-[state=active]:text-white">
              Course
            </TabsTrigger>
            <TabsTrigger
              value="achievement"
              className="data-[state=active]:bg-[#4a2639] data-[state=active]:text-white"
            >
              Achievement
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <TemplatesTable />
          </TabsContent>
          <TabsContent value="academic" className="mt-4">
            <TemplatesTable />
          </TabsContent>
          <TabsContent value="course" className="mt-4">
            <TemplatesTable />
          </TabsContent>
          <TabsContent value="achievement" className="mt-4">
            <TemplatesTable />
          </TabsContent>
        </Tabs>

        <Card className="border-[#4a2639]/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Template Preview</h3>
            <div className="aspect-[1.414/1] bg-muted rounded-lg flex items-center justify-center border">
              <p className="text-muted-foreground">Select a template to preview</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
