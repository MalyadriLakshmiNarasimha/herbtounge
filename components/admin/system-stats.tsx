import { Card, CardContent } from "@/components/ui/card"
import { Users, Activity, Database, Cpu } from "lucide-react"

const stats = [
  { label: "Total Users", value: "24", icon: Users, color: "text-chart-1" },
  { label: "Active Sessions", value: "12", icon: Activity, color: "text-chart-2" },
  { label: "Database Size", value: "2.4 GB", icon: Database, color: "text-chart-3" },
  { label: "System Load", value: "42%", icon: Cpu, color: "text-chart-4" },
]

export function SystemStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-lg bg-secondary p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
