import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  iconColor?: string
}

export function MetricCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: MetricCardProps) {
  const changeColors = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }

  return (
    <Card className="card-hover border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {change && <p className={`mt-2 text-sm ${changeColors[changeType]}`}>{change}</p>}
          </div>
          <div className={`rounded-lg bg-primary/10 p-3 ${iconColor || "text-primary"}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
