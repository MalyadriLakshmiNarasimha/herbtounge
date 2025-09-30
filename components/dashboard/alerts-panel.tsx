import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"

const alerts = [
  {
    id: 1,
    herb: "Ashwagandha",
    batch: "ASH-2024-001",
    status: "flagged",
    purity: 68,
    time: "2 hours ago",
  },
  {
    id: 2,
    herb: "Turmeric",
    batch: "TUR-2024-045",
    status: "verified",
    purity: 98,
    time: "4 hours ago",
  },
  {
    id: 3,
    herb: "Brahmi",
    batch: "BRA-2024-023",
    status: "pending",
    purity: 85,
    time: "6 hours ago",
  },
  {
    id: 4,
    herb: "Shatavari",
    batch: "SHA-2024-012",
    status: "flagged",
    purity: 72,
    time: "8 hours ago",
  },
]

export function AlertsPanel() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-4">
                <div>
                  {alert.status === "flagged" && <AlertTriangle className="h-5 w-5 text-destructive" />}
                  {alert.status === "verified" && <CheckCircle2 className="h-5 w-5 text-success" />}
                  {alert.status === "pending" && <Clock className="h-5 w-5 text-warning" />}
                </div>
                <div>
                  <p className="font-medium">{alert.herb}</p>
                  <p className="text-sm text-muted-foreground">{alert.batch}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{alert.purity}% Purity</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <Badge
                  variant={
                    alert.status === "flagged" ? "destructive" : alert.status === "verified" ? "default" : "secondary"
                  }
                >
                  {alert.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
