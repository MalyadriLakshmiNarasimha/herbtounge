"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, User, Settings, AlertTriangle, CheckCircle2 } from "lucide-react"

const logs = [
  {
    id: "1",
    action: "Test Completed",
    user: "Dr. Priya Sharma",
    details: "Ashwagandha sample ASH-2024-001 tested - Authentic",
    timestamp: "2024-01-30 14:32:15",
    type: "success",
  },
  {
    id: "2",
    action: "User Role Changed",
    user: "Admin",
    details: "Changed Rajesh Kumar role from Viewer to Analyst",
    timestamp: "2024-01-30 13:15:42",
    type: "info",
  },
  {
    id: "3",
    action: "Device Calibration",
    user: "System",
    details: "RF Spectrometer RS-2000X calibrated successfully",
    timestamp: "2024-01-30 12:00:00",
    type: "success",
  },
  {
    id: "4",
    action: "Failed Login Attempt",
    user: "Unknown",
    details: "Multiple failed login attempts from IP 192.168.1.100",
    timestamp: "2024-01-30 11:45:23",
    type: "warning",
  },
  {
    id: "5",
    action: "Model Deployed",
    user: "Admin",
    details: "HerbalAuth Advanced v2.1.0 deployed to production",
    timestamp: "2024-01-30 10:30:00",
    type: "success",
  },
  {
    id: "6",
    action: "Test Completed",
    user: "Rajesh Kumar",
    details: "Turmeric sample TUR-2024-045 tested - Adulterated",
    timestamp: "2024-01-30 09:15:30",
    type: "warning",
  },
]

export function AuditLogs() {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "info":
        return <Settings className="h-4 w-4 text-primary" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge variant="default">Success</Badge>
      case "warning":
        return <Badge variant="destructive">Warning</Badge>
      case "info":
        return <Badge variant="secondary">Info</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
        <p className="text-sm text-muted-foreground">Track all system activities and user actions</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 rounded-lg border border-border p-4">
                <div className="mt-1">{getIcon(log.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{log.action}</p>
                    {getTypeBadge(log.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {log.user}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
