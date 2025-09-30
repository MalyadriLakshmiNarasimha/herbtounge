"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Share2, Eye } from "lucide-react"
import { useState } from "react"

const reports = [
  {
    id: "1",
    title: "Monthly Authenticity Report",
    date: "January 2024",
    type: "Monthly Summary",
    status: "ready",
  },
  {
    id: "2",
    title: "Supplier Reliability Analysis",
    date: "Q4 2023",
    type: "Quarterly Report",
    status: "ready",
  },
  {
    id: "3",
    title: "Model Performance Review",
    date: "2023 Annual",
    type: "Annual Report",
    status: "ready",
  },
  {
    id: "4",
    title: "Regulatory Compliance Report",
    date: "January 2024",
    type: "Compliance",
    status: "ready",
  },
]

export default function ReportsPage() {
  const [reportType, setReportType] = useState("all")

  const handleGenerateReport = () => {
    alert("Generating new report...")
  }

  const handleDownload = (id: string) => {
    alert(`Downloading report ${id}`)
  }

  const handlePreview = (id: string) => {
    alert(`Previewing report ${id}`)
  }

  const handleShare = (id: string) => {
    alert(`Sharing report ${id}`)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-balance">Reports</h1>
              <p className="mt-2 text-muted-foreground">Generate and download comprehensive test reports</p>
            </div>
            <Button onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {reports.map((report) => (
              <Card key={report.id} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{report.type}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handlePreview(report.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleDownload(report.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare(report.id)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
