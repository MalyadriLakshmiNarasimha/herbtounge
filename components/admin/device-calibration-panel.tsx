"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, AlertTriangle, CheckCircle2, Settings } from "lucide-react"

const devices = [
  {
    id: "1",
    name: "RF Spectrometer",
    model: "RS-2000X",
    status: "calibrated",
    lastCalibration: "2024-01-15",
    nextCalibration: "2024-04-15",
    health: 98,
  },
  {
    id: "2",
    name: "NIR Analyzer",
    model: "NIR-500",
    status: "calibrated",
    lastCalibration: "2024-01-10",
    nextCalibration: "2024-04-10",
    health: 95,
  },
  {
    id: "3",
    name: "FTIR Spectrometer",
    model: "FTIR-3000",
    status: "needs_calibration",
    lastCalibration: "2023-10-20",
    nextCalibration: "2024-01-20",
    health: 82,
  },
  {
    id: "4",
    name: "Voltammetry System",
    model: "VS-100",
    status: "calibrated",
    lastCalibration: "2024-01-12",
    nextCalibration: "2024-04-12",
    health: 92,
  },
]

export function DeviceCalibrationPanel() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "calibrated":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "needs_calibration":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "calibrated":
        return <Badge variant="default">Calibrated</Badge>
      case "needs_calibration":
        return <Badge variant="destructive">Needs Calibration</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Device Calibration Status</CardTitle>
        <p className="text-sm text-muted-foreground">Monitor and manage sensor calibration schedules</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device) => (
          <div key={device.id} className="space-y-3 rounded-lg border border-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(device.status)}
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-sm text-muted-foreground">{device.model}</p>
                </div>
              </div>
              {getStatusBadge(device.status)}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Device Health</span>
                <span className="font-medium">{device.health}%</span>
              </div>
              <Progress value={device.health} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Last Calibration</p>
                <p className="font-medium">{device.lastCalibration}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Due</p>
                <p className="font-medium">{device.nextCalibration}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Settings className="mr-2 h-4 w-4" />
              Calibrate Device
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
