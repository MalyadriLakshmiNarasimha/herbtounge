"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

const performanceData = [
  { samples: 100, baseline: 82, advanced: 88 },
  { samples: 500, baseline: 85, advanced: 92 },
  { samples: 1000, baseline: 87, advanced: 94 },
  { samples: 2000, baseline: 88, advanced: 95 },
  { samples: 5000, baseline: 89, advanced: 96 },
  { samples: 10000, baseline: 90, advanced: 97 },
]

export function ModelComparison() {
  const [metric, setMetric] = useState("accuracy")

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Model Performance Comparison</CardTitle>
            <p className="text-sm text-muted-foreground">Baseline vs Advanced Model</p>
          </div>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accuracy">Accuracy</SelectItem>
              <SelectItem value="precision">Precision</SelectItem>
              <SelectItem value="recall">Recall</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="samples"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: "Training Samples", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={[75, 100]}
              label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              name="Baseline Model"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="advanced"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Advanced Model"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
