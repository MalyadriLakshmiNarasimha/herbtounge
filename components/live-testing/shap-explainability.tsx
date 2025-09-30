"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const shapData = [
  { feature: "RF Peak 1", impact: 0.42 },
  { feature: "NIR Absorption", impact: 0.38 },
  { feature: "Voltammetry", impact: 0.31 },
  { feature: "RF Peak 2", impact: 0.24 },
  { feature: "FTIR Band", impact: 0.19 },
  { feature: "Color Index", impact: 0.12 },
]

export function ShapExplainability() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>SHAP Feature Importance</CardTitle>
        <p className="text-sm text-muted-foreground">Top features driving the AI decision</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={shapData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis dataKey="feature" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="impact" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
