import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Zap } from "lucide-react"

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
}

interface ModelPerformanceCardProps {
  modelName: string
  version: string
  metrics: ModelMetrics
  isActive?: boolean
}

export function ModelPerformanceCard({ modelName, version, metrics, isActive }: ModelPerformanceCardProps) {
  return (
    <Card className={`border-border bg-card ${isActive ? "ring-2 ring-primary" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{modelName}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Version {version}</p>
          </div>
          {isActive && (
            <Badge variant="default" className="gap-1">
              <Zap className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Accuracy
            </div>
            <p className="text-2xl font-bold">{metrics.accuracy}%</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              F1 Score
            </div>
            <p className="text-2xl font-bold">{metrics.f1Score}%</p>
          </div>
        </div>

        <div className="space-y-2 rounded-lg bg-secondary p-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Precision</span>
            <span className="font-medium">{metrics.precision}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Recall</span>
            <span className="font-medium">{metrics.recall}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
