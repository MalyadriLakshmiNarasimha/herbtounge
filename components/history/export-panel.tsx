"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { useState } from "react"

export function ExportPanel() {
  const [format, setFormat] = useState("csv")

  const handleExport = () => {
    // Mock export functionality
    const filename = `herbalauth-export-${new Date().toISOString().split("T")[0]}.${format}`
    alert(`Exporting data as ${filename}`)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV Format
                </div>
              </SelectItem>
              <SelectItem value="xlsx">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel Format
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Report
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>

        <div className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
          <p>Export includes all filtered records with complete test data, SHAP values, and Ritual AI verification.</p>
        </div>
      </CardContent>
    </Card>
  )
}
